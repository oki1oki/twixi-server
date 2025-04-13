import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Follow } from "@prisma/client"
import { UserModel } from "src/modules/auth/account/models/user.model"

@ObjectType()
export class FollowModel implements Follow {
	@Field(() => ID)
	id: string

	@Field()
	followingId: string

	@Field(() => UserModel)
	following: UserModel

	@Field()
	followerId: string

	@Field(() => UserModel)
	follower: UserModel

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
