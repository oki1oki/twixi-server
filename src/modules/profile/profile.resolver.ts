import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs"
import Upload from "graphql-upload/Upload.mjs"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { FileValidationPipe } from "src/shared/pipes/file-validation.pipe"
import { ChangeProfileInfoInput } from "./inputs/change-profile-info.input"
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from "./inputs/social-link.input"
import { SocialLinkModel } from "./models/social-link.model"
import { ProfileService } from "./profile.service"

@Resolver()
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeProfileAvatar" })
	async changeAvatar(
		@Authorized() user: User,
		@Args("avatar", { type: () => GraphQLUpload }, FileValidationPipe)
		avatar: Upload
	) {
		return this.profileService.changeAvatar(user, avatar)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeProfileAvatar" })
	async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeProfileInfo" })
	async changeInfo(
		@Authorized() user: User,
		@Args("data") input: ChangeProfileInfoInput
	) {
		return this.profileService.changeInfo(user, input)
	}

	@Authorization()
	@Query(() => [SocialLinkModel], { name: "mySocialLinks" })
	async mySocialLinks(@Authorized("id") userId: string) {
		return this.profileService.userSocialLinks(userId)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "addSocialLink" })
	async addSocialLink(
		@Authorized() user: User,
		@Args("data") input: SocialLinkInput
	) {
		return this.profileService.createSocialLink(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "reorderSocialLinks" })
	async reorderSocialLinks(
		@Args("data", { type: () => [SocialLinkOrderInput] })
		data: SocialLinkOrderInput[]
	) {
		return this.profileService.reorderSocialLinks(data)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "updateSocialLink" })
	async updateSocialLink(
		@Args("id") id: string,
		@Args("data") input: SocialLinkInput
	) {
		return this.profileService.updatedSocialLink(id, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeSocialLink" })
	async removeSocialLink(@Args("id") id: string) {
		return this.profileService.removeSocialLink(id)
	}
}
