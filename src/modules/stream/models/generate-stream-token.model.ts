import { ObjectType } from "@nestjs/graphql"
import { Field } from "@nestjs/graphql"

@ObjectType()
export class GenerateStreamTokenModel {
	@Field()
	token: string
}
