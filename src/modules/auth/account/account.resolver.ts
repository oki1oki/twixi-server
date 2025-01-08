import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Query } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

@Resolver()
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'getAllUsers' })
	async getAll() {
		return this.accountService.getAll()
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	async create(@Args('data') createUserData: CreateUserInput) {
		return this.accountService.create(createUserData)
	}
}
