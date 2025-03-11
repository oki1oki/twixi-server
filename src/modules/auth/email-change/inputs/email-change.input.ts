import { Field, InputType } from "@nestjs/graphql"
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length
} from "class-validator"

@InputType()
export class EmailChangeInput {
	@Field()
	@IsEmail()
	@IsNotEmpty()
	newEmail: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6)
	@IsNotEmpty()
	oldEmailToken?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	@Length(6, 6)
	@IsNotEmpty()
	newEmailToken?: string
}
