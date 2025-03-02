import { Field, ID, ObjectType } from "@nestjs/graphql"
import type { User } from "@prisma/client"

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

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

	@Field({ nullable: true })
	avatar: string

	@Field({ nullable: true })
	bio: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
