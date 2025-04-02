import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql"
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs"
import Upload from "graphql-upload/Upload.mjs"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { FileValidationPipe } from "src/shared/pipes/file-validation.pipe"
import { GQLContext } from "src/shared/utils/types/gql-context.type"
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input"
import { FiltersInput } from "./inputs/filters.input"
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input"
import { GenerateStreamTokenModel } from "./models/generate-stream-token.model"
import { StreamAndMetaModel } from "./models/stream-and-meta.model"
import { StreamModel } from "./models/stream.model"
import { StreamService } from "./stream.service"

@Resolver("Stream")
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => StreamAndMetaModel, { name: "findAllStreams" })
	async findAll(@Args("filters") input: FiltersInput) {
		const { limit, page, searchTerm } = input
		return this.streamService.findAll(limit, page, searchTerm)
	}

	@Query(() => [StreamModel], { name: "findRandomStreams" })
	async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeStreamInfo" })
	async changeStreamInfo(@Args("data") input: ChangeStreamInfoInput) {
		return this.streamService.changeInfo(input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeStreamThumbnail" })
	async changeThumbnail(
		@Args("thumbnail", { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload,
		@Args("id")
		streamId: string
	) {
		return this.streamService.changeThumbnail(streamId, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeStreamThumbnail" })
	async removeThumbnail(@Args("id") streamId: string) {
		return this.streamService.removeThumbnail(streamId)
	}

	@Mutation(() => GenerateStreamTokenModel, { name: "generateStreamToken" })
	async generateStreamToken(
		@Context() { req }: GQLContext,
		@Args("data") input: GenerateStreamTokenInput
	) {
		return this.streamService.generateToken(req, input)
	}
}
