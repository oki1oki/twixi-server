import { Field, InputType } from "@nestjs/graphql"
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MinLength
} from "class-validator"

@InputType()
export class DeactivateAccountInput {
	@Field()
	@IsEmail()
	@IsNotEmpty()
	email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6)
	token?: string
}
