import { Resolver } from "@nestjs/graphql"
import { Query } from "@nestjs/graphql"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { AccountService } from "./account.service"
import { UserModel } from "./models/user.model"

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: "findProfile" })
	async findMe(@Authorized("id") id: string) {
		return this.accountService.findMe(id)
	}
}
