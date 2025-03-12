import { BadRequestException, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import Upload from "graphql-upload/Upload.mjs"
import sharp from "sharp"
import { PrismaService } from "src/core/prisma/prisma.service"
import { StorageService } from "../libs/storage/storage.service"
import { ChangeProfileInfoInput } from "./inputs/change-profile-info.input"
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from "./inputs/social-link.input"

@Injectable()
export class ProfileService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService
	) {}

	async changeAvatar(user: User, file: Upload) {
		if (user.avatar) {
			await this.storageService.remove(user.avatar)
		}

		const fileChunks: Buffer[] = []
		for await (const chunk of file.file.createReadStream()) {
			fileChunks.push(chunk)
		}

		const fileBuffer = Buffer.concat(fileChunks)
		const fileName = `/channels/${user.id}.webp`
		const isAnimatedGif = file.file.filename?.endsWith(".gif")

		const processedBuffer = await sharp(fileBuffer, { animated: isAnimatedGif })
			.resize(512, 512)
			.webp()
			.toBuffer()

		await this.storageService.upload(processedBuffer, fileName, "image/webp")

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: fileName
			}
		})

		return true
	}

	async removeAvatar(user: User) {
		if (!user.avatar) {
			return
		}

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: null
			}
		})

		return true
	}

	async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, displayName, bio } = input

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (isUsernameExists || username === user.username)
			throw new BadRequestException("Это имя пользователя уже занято")

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				username,
				displayName,
				bio
			}
		})

		return true
	}

	async userSocialLinks(userId: string) {
		return this.prismaService.socialLink.findMany({
			where: {
				userId: userId
			},
			orderBy: {
				position: "asc"
			}
		})
	}

	async createSocialLink(user: User, input: SocialLinkInput) {
		const { title, url } = input

		const userLinks = await this.prismaService.socialLink.findMany({
			where: {
				userId: user.id
			},
			orderBy: { position: "desc" }
		})

		if (userLinks.length >= 10) {
			throw new BadRequestException(
				"У вас уже 10 ссылок, добавить ещё не получится"
			)
		}

		const position = userLinks ? userLinks[0].position + 1 : 1

		await this.prismaService.socialLink.create({
			data: {
				title,
				url,
				position,
				userId: user.id
			}
		})

		return true
	}

	async reorderSocialLinks(data: SocialLinkOrderInput[]) {
		if (!data.length) return

		const updatePromises = data.map(link => {
			return this.prismaService.socialLink.update({
				where: {
					id: link.id
				},
				data: {
					position: link.postition
				}
			})
		})

		await Promise.all(updatePromises)

		return true
	}

	async updatedSocialLink(id: string, input: SocialLinkInput) {
		const { title, url } = input

		await this.prismaService.socialLink.update({
			where: {
				id
			},
			data: {
				title,
				url
			}
		})

		return true
	}

	async removeSocialLink(id: string) {
		await this.prismaService.socialLink.delete({
			where: { id }
		})

		return true
	}
}
