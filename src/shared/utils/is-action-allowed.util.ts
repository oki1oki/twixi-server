import type { TokenType } from "@prisma/client"
import type { PrismaService } from "src/core/prisma/prisma.service"
import { actionsTimeLimit } from "./constants/actions-rate-limits.constants"
import { ms } from "./ms.util"

export async function isActionAllowed(
	prismaService: PrismaService,
	userId: string,
	actionType: TokenType
) {
	const attemptsCount = await prismaService.actionAttempt.count({
		where: {
			type: actionType,
			userId,
			createdAt: {
				gte: new Date(
					new Date().getTime() - ms(actionsTimeLimit[actionType].timeFrame)
				)
			}
		}
	})

	return attemptsCount <= actionsTimeLimit[actionType].limit
}
