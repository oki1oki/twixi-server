import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

@InputType()
export class SocialLinkInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	title: string

	@Field()
	@IsString()
	@IsNotEmpty()
	url: string
}

@InputType()
export class SocialLinkOrderInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	id: string

	@Field()
	@IsNumber()
	@IsNotEmpty()
	postition: number
}
