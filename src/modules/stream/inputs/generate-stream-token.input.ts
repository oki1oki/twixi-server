import { Field, ID, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString, IsUUID } from "class-validator"

@InputType()
export class GenerateStreamTokenInput {
	@Field(() => ID)
	@IsUUID()
	@IsNotEmpty()
	userId: string

	@Field()
	@IsString()
	@IsNotEmpty()
	channelId: string
}
