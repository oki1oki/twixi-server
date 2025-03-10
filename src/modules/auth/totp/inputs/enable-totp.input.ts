import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString, Length } from "class-validator"

@InputType()
export class EnableTotpInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	secret: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Length(6, 6)
	token: string
}
