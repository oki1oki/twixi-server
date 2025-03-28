import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class MetaModel {
	@Field(() => Int)
	page: number

	@Field(() => Int)
	limit: number

	@Field(() => Int)
	total: number
}
