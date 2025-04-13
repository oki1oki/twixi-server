import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { ChangeNotificationSettingsInput } from "./inputs/change-notification-settings.input"
import {
	ChangeNotificationSettingsResponse,
	NotificationSettingsModel
} from "./models/notification-settings.model"
import { NotificationModel } from "./models/notification.model"
import { NotificationService } from "./notification.service"

@Resolver("Notification")
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@Authorization()
	@Query(() => Number, { name: "findUnreadNotificationsCount" })
	async findUnreadCount(@Authorized("id") userId: string) {
		return this.notificationService.findUnreadCount(userId)
	}

	@Authorization()
	@Query(() => [NotificationModel], { name: "findUserNotifications" })
	async findByUserId(@Authorized("id") userId: string) {
		return this.notificationService.findByUserId(userId)
	}

	@Authorization()
	@Mutation(() => ChangeNotificationSettingsResponse, {
		name: "changeNotificationSettings"
	})
	async changeNotificationSettings(
		@Authorized("id") userId: string,
		@Args("data") input: ChangeNotificationSettingsInput
	) {
		return this.notificationService.changeSettings(userId, input)
	}
}
