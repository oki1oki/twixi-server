import '@fastify/session'

declare module '@fastify/session' {
	interface FastifySessionObject {
		userId?: string
		createdAt?: Date | string
	}
}
