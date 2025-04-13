import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/core/prisma/prisma.service"

@Injectable()
export class ChannelService {
	constructor(private readonly prismaService: PrismaService) {}

	async findRecommended() {
		return this.prismaService.user.findMany({
			where: {
				isDeactivated: false
			},
			orderBy: {
				followers: {
					_count: "desc"
				}
			},
			include: {
				stream: true
			},
			take: 7
		})
	}

	async findByUsername(username: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				username
			},
			include: {
				socialLinks: {
					orderBy: {
						position: "asc"
					}
				},
				stream: {
					include: {
						category: true
					}
				},
				followings: true
			}
		})

		if (!channel) throw new NotFoundException("Канал не найден")

		return channel
	}

	async findChannelFollowersCount(channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})

		if (!channel) throw new NotFoundException("Канал не найден")

		const followersCount = await this.prismaService.follow.count({
			where: {
				followingId: channelId
			}
		})

		return followersCount
	}
}
