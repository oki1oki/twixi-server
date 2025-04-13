import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Notification, NotificationType } from "@prisma/client"
import { UserModel } from "src/modules/auth/account/models/user.model"

registerEnumType(NotificationType, {
	name: "NotificationType"
})

@ObjectType()
export class NotificationModel implements Notification {
	@Field(() => ID)
	id: string

	@Field()
	message: string

	@Field(() => NotificationType)
	type: NotificationType

	@Field(() => Boolean)
	isRead: boolean

	@Field(() => UserModel)
	user: UserModel

	@Field()
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
