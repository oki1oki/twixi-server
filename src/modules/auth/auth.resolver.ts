import { Args, Context, Mutation, Resolver } from "@nestjs/graphql"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { UserAgent } from "src/shared/decorators/user-agent.decorator"
import { GQLContext } from "src/shared/utils/types/gql-context.type"
import { CreateUserInput } from "./account/inputs/create-user.input"
import { UserModel } from "./account/models/user.model"
import { AuthService } from "./auth.service"
import { LoginInput } from "./session/inputs/login.input"

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => Boolean, { name: "registerUser" })
	async register(@Args("data") registerData: CreateUserInput) {
		return this.authService.register(registerData)
	}

	@Mutation(() => UserModel, { name: "loginUser" })
	async login(
		@Context() { req }: GQLContext,
		@Args("data") loginData: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.authService.login(req, loginData, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "logoutUser" })
	async logout(@Context() { req }: GQLContext) {
		return this.authService.logout(req)
	}
}
