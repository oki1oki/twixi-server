import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql"
import { PubSub } from "graphql-subscriptions"
import { Authorization } from "src/shared/decorators/auth.decorator"
import { Authorized } from "src/shared/decorators/authorized.decorator"
import { ChatService } from "./chat.service"
import { ChangeChatSettingsInput } from "./inputs/change-chat-settings.input"
import { SendMessageInput } from "./inputs/send-message.input"
import { ChatMessageModel } from "./models/chat-message.model"

const pubSub = new PubSub()

@Resolver("Chat")
export class ChatResolver {
	constructor(private readonly chatService: ChatService) {}

	@Query(() => [ChatMessageModel], { name: "findStreamMessages" })
	async findStreamMessages(@Args("streamId") streamId: string) {
		return this.chatService.findStreamMessages(streamId)
	}

	@Authorization()
	@Mutation(() => ChatMessageModel, { name: "sendChatMessage" })
	async sendMessage(
		@Authorized("id") userId: string,
		@Args("data") input: SendMessageInput
	) {
		const message = await this.chatService.sendMessage(userId, input)

		pubSub.publish("CHAT_MESSAGE_ADDED", { chatMessageAdded: message })

		return message
	}

	@Subscription(() => ChatMessageModel, {
		name: "chatMessageAdded",
		filter: (payload, variables) =>
			payload.chatMessageAdded.streamId === variables.streamId
	})
	subscribeToChatMessageAdded(@Args("streamId") streamId: string) {
		return pubSub.asyncIterableIterator("CHAT_MESSAGE_ADDED")
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeChatSetting" })
	async changeSettings(
		@Authorized("id") userId: string,
		@Args("data") input: ChangeChatSettingsInput
	) {
		return this.chatService.changeSettings(userId, input)
	}
}
