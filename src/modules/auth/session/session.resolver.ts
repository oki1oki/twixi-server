import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Authorization } from "src/shared/decorators/auth.decorator"
import type { GQLContext } from "src/shared/utils/types/gql-context.type"
import { SessionModel } from "./models/session.model"
import { SessionService } from "./session.service"

@Resolver()
export class SessionResolver {
	constructor(private readonly sessionService: SessionService) {}

	@Authorization()
	@Query(() => [SessionModel], { name: "findSessionsByUser" })
	async findByUser(@Context() { req }: GQLContext) {
		return this.sessionService.findByUser(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: "findCurrentSession" })
	async findCurrent(@Context() { req }: GQLContext) {
		return this.sessionService.findCurrent(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeSession" })
	async removeSession(@Context() { req }: GQLContext, @Args("id") id: string) {
		return this.sessionService.removeById(req, id)
	}
}
