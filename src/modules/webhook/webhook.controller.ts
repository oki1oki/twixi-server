import {
	Body,
	Controller,
	Headers,
	Post,
	UnauthorizedException
} from "@nestjs/common"
import { WebhookService } from "./webhook.service"

@Controller("webhook")
export class WebhookController {
	constructor(private readonly webhookService: WebhookService) {}

	@Post("livekit")
	async receiveWebhook(
		@Body() body: string,
		@Headers("authorization") authToken: string
	) {
		if (!authToken) {
			throw new UnauthorizedException("Отсутствует токен авторизации")
		}

		return this.webhookService.receiveWebhook(body, authToken)
	}
}
