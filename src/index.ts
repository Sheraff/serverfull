import Fastify from "fastify"
import { serve } from "inngest/fastify"
import { inngest, functions } from "#inngest"

const fastify = Fastify({
	logger: true,
})

fastify.route({
	method: ["GET", "POST", "PUT"],
	handler: serve({ client: inngest, functions }),
	url: "/api/inngest",
})

fastify.get("/api/hello", async function (request, reply) {
	await inngest.send({
		name: "test/hello.world",
		data: {
			email: "testUser@example.com",
		},
	})
	return { message: "Event sent!" }
})

// Start up the fastify server
fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
