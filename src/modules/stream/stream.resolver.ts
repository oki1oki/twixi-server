import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs"
import Upload from "graphql-upload/Upload.mjs"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { FileValidationPipe } from "src/shared/pipes/file-validation.pipe"
import { ChangeStreamInfoInput } from "./inputs/change-stream-info.input"
import { FiltersInput } from "./inputs/filters.input"
import { GenerateStreamTokenInput } from "./inputs/generate-stream-token.input"
import { GenerateStreamTokenModel } from "./models/generate-stream-token.model"
import { StreamResponseModel } from "./models/stream-response.model"
import { StreamModel } from "./models/stream.model"
import { StreamService } from "./stream.service"

@Resolver()
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => StreamResponseModel, { name: "findAllStreams" })
	async findAllStreams(@Args("filters") input: FiltersInput) {
		const { limit, page, searchTerm } = input
		return this.streamService.findAll(limit, page, searchTerm)
	}

	@Query(() => StreamModel, { name: "findRandomStream" })
	async findRandomStream() {
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
	async generateStreamToken(@Args("data") input: GenerateStreamTokenInput) {
		return this.streamService.generateToken(input)
	}
}
