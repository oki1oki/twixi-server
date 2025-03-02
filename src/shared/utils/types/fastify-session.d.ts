import "@fastify/session"
import type { SessionMetadata } from "./session-metadata.type"

declare module "@fastify/session" {
	interface FastifySessionObject {
		userId?: string
		createdAt?: Date | string
		metadata: SessionMetadata
	}
}
