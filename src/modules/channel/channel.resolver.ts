import { Args, Query, Resolver } from "@nestjs/graphql"
import { UserModel } from "../auth/account/models/user.model"
import { ChannelService } from "./channel.service"

@Resolver("Channel")
export class ChannelResolver {
	constructor(private readonly channelService: ChannelService) {}

	@Query(() => [UserModel], { name: "findRecommendedChannels" })
	async findRecommended() {
		return this.channelService.findRecommended()
	}

	@Query(() => UserModel, { name: "findChannelByUsername" })
	async findByUsername(@Args("username") username: string) {
		return this.channelService.findByUsername(username)
	}

	@Query(() => Number, { name: "findChannelFollowersCount" })
	async findChannelFollowersCount(@Args("channelId") channelId: string) {
		return this.channelService.findChannelFollowersCount(channelId)
	}
}
