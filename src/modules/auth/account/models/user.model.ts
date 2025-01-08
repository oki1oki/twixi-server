import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
	@Field(() => ID)
	id: number

	@Field()
	username: string

	@Field()
	email: string

	@Field()
	displayName: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field({ nullable: true })
	avatar?: string

	@Field({ nullable: true })
	bio?: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
