import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Category } from "@prisma/client"
import { StreamModel } from "src/modules/stream/models/stream.model"

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	id: string

	@Field()
	title: string

	@Field()
	slug: string

	@Field({ nullable: true })
	description: string

	@Field()
	thumbnailUrl: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}

@ObjectType()
export class CategoryWithStreamsModel extends CategoryModel {
	@Field(() => [StreamModel])
	streams: StreamModel[]
}
