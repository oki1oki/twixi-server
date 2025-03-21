import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Prisma } from "@prisma/client"
import Upload from "graphql-upload/Upload.mjs"
import { AccessToken } from "livekit-server-sdk"
import sharp from "sharp"
import { PrismaService } from "src/core/prisma/prisma.service"
import { StorageService } from "src/modules/libs/storage/storage.service"
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input"
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input"

@Injectable()
export class StreamService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly storageService: StorageService
	) {}

	async findAll(limit: number = 12, page: number = 1, searchTerm: string) {
		const whereClause = searchTerm
			? this.searchTermClause(searchTerm)
			: undefined

		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				},
				isPrivate: false,
				...whereClause
			},
			include: {
				user: true
			},

			take: limit,
			skip: page ? (page - 1) * limit : 0
		})

		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false
				},
				isPrivate: false,
				...whereClause
			}
		})

		return {
			items: streams,
			meta: {
				page,
				limit,
				total
			}
		}
	}

	async findById(id: string) {
		const stream = await this.prismaService.stream.findUnique({
			where: { id }
		})

		if (!stream) throw new NotFoundException("Стрим не найден")

		return stream
	}

	async findByUser(userId: string) {
		return this.prismaService.stream.findMany({
			where: {
				userId
			}
		})
	}

	async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: { isDeactivated: false }
			}
		})

		const randomIndex = Math.floor(Math.random() * total)

		const randomStream = await this.prismaService.stream.findFirst({
			where: {
				user: { isDeactivated: false }
			},
			take: 1,
			skip: randomIndex
		})

		return randomStream
	}

	async changeInfo(input: ChangeStreamInfoInput) {
		await this.prismaService.stream.update({
			where: { id: input.id },
			data: input
		})

		return true
	}

	async changeThumbnail(id: string, file: Upload) {
		const stream = await this.findById(id)

		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl)
		}

		const fileChunks: Buffer[] = []
		for await (const chunk of file.file.createReadStream()) {
			fileChunks.push(chunk)
		}

		const fileBuffer = Buffer.concat(fileChunks)
		const fileName = `/streams/${stream.id}.webp`

		const processedBuffer = await sharp(fileBuffer)
			.resize(1280, 720)
			.webp()
			.toBuffer()

		await this.storageService.upload(processedBuffer, fileName, "image/webp")

		await this.prismaService.stream.update({
			where: {
				id
			},
			data: {
				thumbnailUrl: fileName
			}
		})

		return true
	}

	async removeThumbnail(id: string) {
		const stream = await this.findById(id)

		if (!stream.thumbnailUrl) {
			return
		}

		await this.storageService.remove(stream.thumbnailUrl)

		await this.prismaService.stream.update({
			where: {
				id
			},
			data: {
				thumbnailUrl: null
			}
		})

		return true
	}

	async generateToken(input: GenerateStreamTokenInput) {
		const { userId, channelId } = input

		let self: { id: string; username: string }

		const user = await this.prismaService.user.findUnique({
			where: { id: userId }
		})

		if (user) {
			self = { id: user.id, username: user.username }
		} else {
			self = {
				id: userId,
				username: `Зритель ${Math.floor(Math.random() * 1000000)}`
			}
		}

		const channel = await this.prismaService.user.findUnique({
			where: { id: channelId }
		})

		if (!channel) {
			throw new NotFoundException("Канал не найден")
		}

		const isHost = self.id === channel.id

		const token = new AccessToken(
			this.configService.getOrThrow("LIVEKIT_API_KEY"),
			this.configService.getOrThrow("LIVEKIT_API_SECRET"),
			{
				identity: isHost ? `Host-${self.id}` : self.id,
				name: self.username
			}
		)

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
		})

		return { token: token.toJwt() }
	}
	async handleStreamLiveStatus(ingressId: string, isLive: boolean) {
		const stream = await this.findStreamByIngressId(ingressId)

		if (!stream) {
			throw new NotFoundException("Стрим не найден")
		}

		await this.updateStreamLiveStatus(ingressId, isLive)
	}

	private async findStreamByIngressId(ingressId: string) {
		return this.prismaService.stream.findUnique({
			where: { ingressId }
		})
	}

	private async updateStreamLiveStatus(ingressId: string, isLive: boolean) {
		await this.prismaService.stream.update({
			where: { ingressId },
			data: { isLive }
		})
	}

	private searchTermClause(searchTerm: string): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: "insensitive"
					}
				},
				{
					user: {
						username: {
							contains: searchTerm,
							mode: "insensitive"
						}
					}
				}
			]
		}
	}
}
