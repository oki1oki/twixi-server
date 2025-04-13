import { Injectable, NotFoundException } from "@nestjs/common"
import { User } from "@prisma/client"
import { PrismaService } from "src/core/prisma/prisma.service"
import { TokenService } from "src/core/token/token.service"
import { ChangeNotificationSettingsInput } from "./inputs/change-notification-settings.input"

@Injectable()
export class NotificationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly tokenService: TokenService
	) {}

	async findUnreadCount(userId: string) {
		return this.prismaService.notification.count({
			where: {
				userId,
				isRead: false
			}
		})
	}

	async findByUserId(userId: string) {
		const notifications =
			await this.prismaService.notification.updateManyAndReturn({
				where: {
					userId,
					isRead: false
				},
				data: {
					isRead: true
				}
			})

		return notifications
	}

	async changeSettings(userId: string, input: ChangeNotificationSettingsInput) {
		const { siteNotifications, telegramNotifications } = input

		const notificationSettings =
			await this.prismaService.notificationSettings.update({
				where: {
					userId
				},
				data: {
					siteNotifications,
					telegramNotifications
				},
				include: {
					user: true
				}
			})

		if (
			notificationSettings.telegramNotifications &&
			!notificationSettings.user.telegramId
		) {
			const telegramAuthToken = await this.tokenService.generate(
				userId,
				"TELEGRAM_AUTH"
			)

			return {
				notificationSettings,
				telegramAuthToken
			}
		}

		if (
			!notificationSettings.telegramNotifications &&
			notificationSettings.user.telegramId
		) {
			await this.prismaService.user.update({
				where: {
					id: userId
				},
				data: {
					telegramId: null
				}
			})

			return notificationSettings
		}

		return notificationSettings
	}

	async createStreamStart(userId: string, channel: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
                    <p className="font-medium">Не пропустите начало стрима!</p>
                    <p>Присоединяйтесь к трансляции пользователя <a href="/${channel.username}" className="text-semibold">${channel.username}</a></p>
                `,
				type: "STREAM_START",
				userId
			}
		})

		return notification
	}

	async createNewFollower(userId: string, follower: User) {
		const notification = await this.prismaService.notification.create({
			data: {
				message: `
                    <p className="font-medium">У вас новый подписчик!</p>
                    <p>Пользователь <a href="/${follower.username}" className="text-semibold">${follower.username}</a> подписался на вас</p>
                `,
				type: "NEW_FOLLOWER",
				userId
			}
		})

		return notification
	}
}
