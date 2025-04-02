import { Module } from "@nestjs/common"
import { StreamModule } from "../stream/stream.module"
import { WebhookController } from "./webhook.controller"
import { WebhookService } from "./webhook.service"

@Module({
	imports: [StreamModule],
	controllers: [WebhookController],
	providers: [WebhookService]
})
export class WebhookModule {}
