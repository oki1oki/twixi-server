import type { FastifyReply, FastifyRequest } from "fastify"

export interface GQLContext {
	req: FastifyRequest
	reply: FastifyReply
}
