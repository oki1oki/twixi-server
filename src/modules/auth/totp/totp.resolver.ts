import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { EnableTotpInput } from "./inputs/enable-totp.input"
import { TotpModel } from "./models/totp.model"
import { TotpService } from "./totp.service"

@Resolver("Totp")
export class TotpResolver {
	constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, { name: "generateTotpSecret" })
	async generate(@Authorized() user: User) {
		return this.totpService.generate(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "enableTotp" })
	async enable(@Authorized() user: User, @Args("data") input: EnableTotpInput) {
		return this.totpService.enable(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "disableTotp" })
	async disable(@Authorized() user: User) {
		return this.totpService.disable(user)
	}
}
