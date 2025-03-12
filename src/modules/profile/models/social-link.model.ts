import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class SocialLinkModel {
	@Field(() => ID)
	id: string

	@Field()
	title: string

	@Field()
	url: string

	@Field(() => Number)
	position: number

	@Field()
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
