import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { UserAgent } from "src/shared/decorators/user-agent.decorator"
import { GQLContext } from "src/shared/utils/types/gql-context.type"
import { EmailChangeService } from "./email-change.service"
import { ChangeEmailInput } from "./inputs/change-email.input"

@Resolver()
export class EmailChangeResolver {
	constructor(private readonly emailChangeService: EmailChangeService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: "sendLinkToOldEmail" })
	async sendLinkToOldEmail(
		@Context() { req }: GQLContext,
		@Authorized() user: User,
		@UserAgent() userAgent: string
	) {
		return this.emailChangeService.sendEmailToken(req, user, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeEmail" })
	async changeEmail(
		@Context() { req }: GQLContext,
		@Authorized() user: User,
		@Args("data") input: ChangeEmailInput,
		@UserAgent() userAgent: string
	) {
		return this.emailChangeService.change(req, input, user, userAgent)
	}
}
