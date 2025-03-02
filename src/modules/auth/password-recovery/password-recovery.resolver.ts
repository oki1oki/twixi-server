import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import { UserAgent } from "src/shared/decorators/user-agent.decorator"
import { GQLContext } from "src/shared/utils/types/gql-context.type"
import { NewPasswordInput } from "./inputs/new-password.input"
import { ResetPasswordInput } from "./inputs/reset-password.input"
import { PasswordRecoveryService } from "./password-recovery.service"

@Resolver()
export class PasswordRecoveryResolver {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}

	@Mutation(() => Boolean, { name: "resetPassword" })
	async resetPassword(
		@Context() { req }: GQLContext,
		@Args("data") data: ResetPasswordInput,
		@UserAgent() userAgent: string
	) {
		return this.passwordRecoveryService.resetPassword(req, data, userAgent)
	}

	@Mutation(() => Boolean, { name: "newPassword" })
	async newPassword(@Args("data") data: NewPasswordInput) {
		return this.passwordRecoveryService.newPassword(data)
	}
}
