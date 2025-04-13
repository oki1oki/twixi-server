import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { FollowService } from "./follow.service"
import { FollowModel } from "./models/follow.model"

@Resolver("Follow")
export class FollowResolver {
	constructor(private readonly followService: FollowService) {}

	@Authorization()
	@Query(() => [FollowModel], { name: "findMyFollowers" })
	async findMyFollows(@Authorized("id") userId: string) {
		return this.followService.findMyFollowers(userId)
	}

	@Authorization()
	@Query(() => [FollowModel], { name: "findMyFollowings" })
	async findMyFollowings(@Authorized("id") userId: string) {
		return this.followService.findMyFollowings(userId)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "followChannel" })
	async follow(
		@Authorized("id") userId: string,
		@Args("channelId") channelId: string
	) {
		return this.followService.follow(userId, channelId)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "unfollowChannel" })
	async unfollow(
		@Authorized("id") userId: string,
		@Args("channelId") channelId: string
	) {
		return this.followService.unfollow(userId, channelId)
	}
}
