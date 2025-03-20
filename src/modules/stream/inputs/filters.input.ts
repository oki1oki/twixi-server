import { Field, InputType } from "@nestjs/graphql"
import { IsNumber, IsOptional, IsString } from "class-validator"

@InputType()
export class FiltersInput {
	@Field(() => Number, { nullable: true })
	@IsNumber()
	@IsOptional()
	limit?: number

	@Field(() => Number, { nullable: true })
	@IsNumber()
	@IsOptional()
	page?: number

	@Field({ nullable: true })
	@IsString()
	@IsOptional()
	searchTerm?: string
}
