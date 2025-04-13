import { Field, ID, ObjectType } from "@nestjs/graphql"
import type { User } from "@prisma/client"
import { FollowModel } from "src/modules/follow/models/follow.model"
import { NotificationSettingsModel } from "src/modules/notification/models/notification-settings.model"
import { NotificationModel } from "src/modules/notification/models/notification.model"
import { StreamModel } from "src/modules/stream/models/stream.model"
import { SocialLinkModel } from "../../../profile/models/social-link.model"

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field({ nullable: true })
	telegramId: string

	@Field()
	username: string

	@Field()
	email: string

	@Field()
	password: string

	@Field()
	displayName: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date)
	deacivatedAt: Date

	@Field(() => Boolean)
	isTotpEnable: boolean

	@Field()
	totpSecret: string

	@Field({ nullable: true })
	avatar: string

	@Field({ nullable: true })
	bio: string

	@Field(() => [SocialLinkModel])
	socialLinks: SocialLinkModel[]

	@Field(() => ID, { nullable: true })
	streamId: string

	@Field(() => StreamModel)
	stream: StreamModel

	@Field(() => [FollowModel])
	followers: FollowModel[]

	@Field(() => [FollowModel])
	followings: FollowModel[]

	@Field(() => [NotificationModel])
	notifications: NotificationModel[]

	@Field(() => NotificationSettingsModel)
	notificationSettings: NotificationSettingsModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
