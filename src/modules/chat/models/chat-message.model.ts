import { Field, ID, ObjectType } from "@nestjs/graphql"
import { ChatMessage } from "@prisma/client"
import { UserModel } from "src/modules/auth/account/models/user.model"

@ObjectType()
export class ChatMessageModel implements ChatMessage {
	@Field(() => ID)
	id: string

	@Field(() => ID)
	userId: string

	@Field(() => ID)
	streamId: string

	@Field()
	text: string

	@Field(() => UserModel)
	user: UserModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
