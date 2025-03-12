import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { Query } from "@nestjs/graphql"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { AccountService } from "./account.service"
import { ChangePasswordInput } from "./inputs/change-password.input"
import { UserModel } from "./models/user.model"

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: "findProfile" })
	async findMe(@Authorized("id") id: string) {
		return this.accountService.findMe(id)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changePassword" })
	async changePassword(
		@Authorized("id") id: string,
		@Args("data") input: ChangePasswordInput
	) {
		return this.accountService.changePassword(id, input)
	}
}
