import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import { PrismaService } from "src/core/prisma/prisma.service"
import { MailService } from "../libs/mail/mail.service"
import { StorageService } from "../libs/storage/storage.service"

@Injectable()
export class CronService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly storageService: StorageService
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		const deactivatedAccounts = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deacivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})

		for (const account of deactivatedAccounts) {
			await this.mailService.sendAccountDeletion(account.email)

			this.storageService.remove(account.avatar)
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deacivatedAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
