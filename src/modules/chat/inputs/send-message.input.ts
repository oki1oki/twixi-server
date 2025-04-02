import { Field, ID, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

@InputType()
export class SendMessageInput {
	@Field(() => ID)
	@IsString()
	@IsNotEmpty()
	streamId: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@MaxLength(300)
	text: string
}
