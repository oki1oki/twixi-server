import { Field, InputType } from "@nestjs/graphql"
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
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
	@IsUUID()
	@IsNotEmpty()
	oldEmailToken: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6)
	@IsNotEmpty()
	newEmailToken?: string
}
