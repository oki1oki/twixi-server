import { Field, InputType } from "@nestjs/graphql"
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length
} from "class-validator"

@InputType()
export class ChangeEmailInput {
	@Field()
	@IsEmail()
	@IsNotEmpty()
	newEmail: string

	@Field()
	@IsString()
	@IsNotEmpty()
	oldEmailToken: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6)
	newEmailToken?: string
}
