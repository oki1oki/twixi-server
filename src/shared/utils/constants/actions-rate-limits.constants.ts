import { TokenType } from "@prisma/client"

interface RateLimit {
	timeFrame: string
	limit: number
}

export const actionsTimeLimit: Partial<Record<TokenType, RateLimit>> = {
	PASSWORD_RESET: { timeFrame: "1h", limit: 3 },
	DEACTIVATE_ACCOUNT: { timeFrame: "2h", limit: 3 }
}
