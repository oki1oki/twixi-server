import { Module } from "@nestjs/common"
import { TokenModule } from "../../core/token/token.module"
import { MailModule } from "./mail/mail.module"
import { StorageModule } from "./storage/storage.module"

@Module({
	imports: [MailModule, StorageModule, TokenModule],
	exports: [MailModule]
})
export class LibsModule {}
