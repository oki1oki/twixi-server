import { Field, ObjectType } from "@nestjs/graphql"
import { UserModel } from "./user.model"

@ObjectType()
export class AuthModel {
	@Field(() => UserModel, { nullable: true })
	user: UserModel

	@Field({ nullable: true })
	message: string
}
