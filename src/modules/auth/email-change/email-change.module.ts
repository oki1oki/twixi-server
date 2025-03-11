import { Module } from "@nestjs/common"
import { TokenModule } from "src/core/token/token.module"
import { EmailChangeResolver } from "./email-change.resolver"
import { EmailChangeService } from "./email-change.service"

@Module({
	imports: [TokenModule],
	providers: [EmailChangeResolver, EmailChangeService]
})
export class EmailChangeModule {}
