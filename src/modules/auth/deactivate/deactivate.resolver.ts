import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { UserAgent } from "src/shared/decorators/user-agent.decorator"
import { GQLContext } from "src/shared/utils/types/gql-context.type"
import { UserModel } from "../account/models/user.model"
import { DeactivateService } from "./deactivate.service"
import { DeactivateAccountInput } from "./inputs/deactivate-account.input"

@Resolver()
export class DeactivateResolver {
	constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Mutation(() => UserModel, { name: "deactivateAccount" })
	async deactivate(
		@Context() { req }: GQLContext,
		@Args("data") input: DeactivateAccountInput,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.deactivateService.deactivate(req, input, user, userAgent)
	}
}
