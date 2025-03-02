import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import { UserAgent } from "src/shared/decorators/user-agent.decorator"
import type { GQLContext } from "src/shared/utils/types/gql-context.type"
import { VerificationInput } from "./inputs/verification.input"
import { VerificationService } from "./verification.service"

@Resolver()
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	@Mutation(() => Boolean, { name: "verifyAccount" })
	async verify(
		@Context() { req }: GQLContext,
		@Args("data") data: VerificationInput,
		@UserAgent() userAgent: string
	) {
		return this.verificationService.verify(req, data, userAgent)
	}
}
