import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { PrismaService } from "src/core/prisma/prisma.service"

@Injectable()
export class GQLAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const req = ctx.getContext().req

		if (typeof req.session.userId === "undefined")
			throw new UnauthorizedException("Пользователь не авторизован")

		const user = await this.prismaService.user.findUnique({
			where: {
				id: req.session.userId
			}
		})

		req.user = user
		return true
	}
}
