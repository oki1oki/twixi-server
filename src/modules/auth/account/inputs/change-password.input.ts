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
export class ChangePasswordInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	oldPassword: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
	newPassword: string
}
