import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import type { FastifyRequest } from "fastify"

export const UserAgent = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		if (ctx.getType() === "http") {
			const req = ctx.switchToHttp().getRequest() as FastifyRequest

			return req.headers["user-agent"]
		} else {
			const req = GqlExecutionContext.create(ctx).getContext().req

			return req.headers["user-agent"]
		}
	}
)
