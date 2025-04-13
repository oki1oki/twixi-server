import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { PrismaService } from "src/core/prisma/prisma.service"
import { NotificationService } from "../notification/notification.service"

@Injectable()
export class FollowService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationService: NotificationService
	) {}

	async findMyFollowers(userId: string) {
		return this.prismaService.follow.findMany({
			where: {
				followingId: userId,
				follower: {
					isDeactivated: false
				}
			},
			include: {
				follower: true
			},
			orderBy: {
				createdAt: "desc"
			}
		})
	}

	async findMyFollowings(userId: string) {
		return this.prismaService.follow.findMany({
			where: {
				followerId: userId,
				following: {
					isDeactivated: false
				}
			},
			include: {
				following: true
			},
			orderBy: {
				createdAt: "desc"
			}
		})
	}

	async follow(userId: string, channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
				isDeactivated: false
			}
		})

		if (!channel) throw new NotFoundException("Канал не найден")

		if (channelId === userId)
			throw new BadRequestException("Нельзя подписаться на самого себя")

		const existingFollow = await this.prismaService.follow.findFirst({
			where: {
				followerId: userId,
				followingId: channelId
			}
		})

		if (existingFollow)
			throw new ConflictException("Вы уже подписаны на этот канал")

		const follow = await this.prismaService.follow.create({
			data: {
				followerId: userId,
				followingId: channelId
			},
			include: {
				follower: true,
				following: {
					include: {
						notificationSettings: true
					}
				}
			}
		})

		if (follow.following.notificationSettings.siteNotifications) {
			await this.notificationService.createNewFollower(
				channelId,
				follow.follower
			)
		}

		return true
	}

	async unfollow(userId: string, channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId,
				isDeactivated: false
			}
		})

		if (!channel) throw new NotFoundException("Канал не найден")

		if (channelId === userId)
			throw new BadRequestException("Нельзя отписаться от самого себя")

		const existingFollow = await this.prismaService.follow.findFirst({
			where: {
				followerId: userId,
				followingId: channelId
			}
		})

		if (!existingFollow)
			throw new ConflictException("Вы не подписаны на этот канал")

		await this.prismaService.follow.delete({
			where: {
				id: existingFollow.id
			}
		})

		return true
	}
}
