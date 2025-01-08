import { Module } from '@nestjs/common'

import { AccountModule } from './account/account.module'
import { SessionModule } from './session/session.module'

@Module({
	imports: [AccountModule, SessionModule],
	exports: [AccountModule, SessionModule]
})
export class AuthModule {}
