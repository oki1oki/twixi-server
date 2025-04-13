import { Module } from "@nestjs/common"
import { NotificationModule } from "../notification/notification.module"
import { StreamModule } from "../stream/stream.module"
import { WebhookController } from "./webhook.controller"
import { WebhookService } from "./webhook.service"

@Module({
	imports: [StreamModule, NotificationModule],
	controllers: [WebhookController],
	providers: [WebhookService]
})
export class WebhookModule {}
