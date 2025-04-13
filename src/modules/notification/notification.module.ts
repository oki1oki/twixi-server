import { Module } from "@nestjs/common"
import { TokenModule } from "src/core/token/token.module"
import { NotificationResolver } from "./notification.resolver"
import { NotificationService } from "./notification.service"

@Module({
	imports: [TokenModule],
	providers: [NotificationResolver, NotificationService],
	exports: [NotificationService]
})
export class NotificationModule {}
