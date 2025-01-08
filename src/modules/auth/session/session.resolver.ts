import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { GQLContext } from 'src/shared/utils/types/gql-context.type'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver()
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	async login(
		@Context() { req }: GQLContext,
		@Args('data') loginData: LoginInput
	) {
		return this.sessionService.login(req, loginData)
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	async logout(@Context() { req }: GQLContext) {
		return this.sessionService.logout(req)
	}
}
