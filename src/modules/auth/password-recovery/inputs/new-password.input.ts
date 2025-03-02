import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString, Length } from "class-validator"

@InputType()
export class NewPasswordInput {
	@Field()
	@Length(6)
	@IsNotEmpty()
	token: string

	@Field()
	@IsString()
	@IsNotEmpty()
	password: string
}
