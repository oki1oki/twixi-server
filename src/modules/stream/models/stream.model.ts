import { Field, ID, Int } from "@nestjs/graphql"
import { ObjectType } from "@nestjs/graphql"
import { Stream } from "@prisma/client"
import { CategoryModel } from "src/modules/category/models/category.model"

@ObjectType()
export class StreamModel implements Stream {
	@Field(() => ID)
	id: string

	@Field()
	title: string

	@Field({ nullable: true })
	description: string

	@Field({ nullable: true })
	thumbnailUrl: string

	@Field({ nullable: true })
	thumbnailId: string

	@Field({ nullable: true })
	ingressId: string

	@Field({ nullable: true })
	serverUrl: string

	@Field({ nullable: true })
	streamKey: string

	@Field(() => Boolean)
	isLive: boolean

	@Field(() => Boolean)
	isChatEnabled: boolean

	@Field(() => Boolean)
	isChatFollowersOnly: boolean

	@Field(() => Boolean)
	isChatPremiumOnly: boolean

	@Field(() => CategoryModel)
	category: CategoryModel

	@Field({ nullable: true })
	categoryId: string

	@Field(() => Boolean, { nullable: true })
	isPrivate: boolean

	@Field({ nullable: true })
	password: string

	@Field()
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
