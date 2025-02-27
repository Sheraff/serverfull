import Fastify from "fastify"
import { serve } from "inngest/fastify"
import { functions, inngest } from "#inngest"

const fastify = Fastify({
	logger: {
		stream: process.env.NODE_ENV !== 'production'
			? await import('pino-pretty')
				.then(m => m.default({ colorize: true }))
			: undefined
	},
})

fastify.route({
	method: ["GET", "POST", "PUT"],
	handler: serve({
		client: inngest,
		functions,
		streaming: "force"
	}),
	url: "/api/inngest",
})

fastify.get("/api/hello", async () => {
	await inngest.send({
		name: "test/hello.world",
		data: {
			email: "testUser@example.com",
		},
	})
	return { message: "Event sent!" }
})

// Start up the fastify server
fastify.listen({ port: 3000 }, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
