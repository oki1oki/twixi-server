import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { PrismaService } from "src/core/prisma/prisma.service"
import { ChangeChatSettingsInput } from "./inputs/change-chat-settings.input"
import { SendMessageInput } from "./inputs/send-message.input"

@Injectable()
export class ChatService {
	constructor(private readonly prismaSeervice: PrismaService) {}

	async findStreamMessages(streamId: string) {
		return this.prismaSeervice.chatMessage.findMany({
			where: {
				streamId: streamId
			},
			orderBy: {
				createdAt: "desc"
			},
			include: {
				user: true
			}
		})
	}

	async sendMessage(userId: string, input: SendMessageInput) {
		const { text, streamId } = input

		const stream = await this.prismaSeervice.stream.findUnique({
			where: { id: streamId }
		})

		if (!stream) throw new NotFoundException("Стрим не найден")

		if (!stream.isLive) throw new BadRequestException("Стрим не в эфире")

		const message = await this.prismaSeervice.chatMessage.create({
			data: {
				userId,
				streamId,
				text
			}
		})

		return message
	}

	async changeSettings(userId: string, input: ChangeChatSettingsInput) {
		const { isChatEnabled, isChatFollowersOnly, isChatPremiumOnly } = input

		await this.prismaSeervice.stream.update({
			where: { userId },
			data: {
				isChatEnabled,
				isChatFollowersOnly,
				isChatPremiumOnly
			}
		})

		return true
	}
}
