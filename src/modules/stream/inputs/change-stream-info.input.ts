import { Field, ID, InputType } from "@nestjs/graphql"
import { Stream } from "@prisma/client"
import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from "class-validator"

@InputType()
export class ChangeStreamInfoInput implements Partial<Stream> {
	@Field(() => ID)
	@IsString()
	@IsNotEmpty()
	id: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	title?: string

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	categoryId?: string

	@Field(() => Boolean, { nullable: true })
	@IsBoolean()
	@IsOptional()
	isPrivate?: boolean

	@Field({ nullable: true })
	@IsString()
	@MinLength(6)
	@IsOptional()
	password?: string
}
