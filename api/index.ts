import Fastify from "fastify"
import { serve } from "inngest/fastify"
import { functions, inngest } from "#api/inngest/inngest"
import { parseArgs, styleText } from 'node:util'
import { logger } from "#api/logger"

process.title = "fastify"

const fastify = Fastify({
	loggerInstance: logger.child({ module: "fastify" }),
})

fastify.route({
	method: ["GET", "POST", "PUT"],
	handler: serve({
		client: inngest,
		functions,
		streaming: "force",
	}),
	url: "/api/inngest",
})

fastify.get("/api/hello", async () => {
	await inngest.send({
		name: "test/hello.world",
		data: {
			foo: "testUser@example.com",
		},
	})
	return { message: "Event sent!" }
})

fastify.get("/api/hellos", async () => {
	await inngest.send([
		{
			name: "test/hello.world",
			data: {
				foo: "111",
			},
		},
		{
			name: "test/hello.world",
			data: {
				email: "222",
			},
		}
	])
	return { message: "Events sent!" }
})

fastify.get('/api/michel', async () => {
	return { message: 'Hello Michel!' }
})

const { values: args } = parseArgs({
	options: {
		host: { type: 'string', default: 'localhost', short: 'h' },
		port: { type: 'string', default: '3001', short: 'p' },
	}
})
fastify.listen({
	port: Number(args.port),
	host: args.host
}, (err) => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	fastify.log.info(`Server listening at ${styleText('green', `http://${args.host}:${args.port}`)}`)
	if (process.env.NODE_ENV !== 'production') {
		fastify.log.info(`Pushing updates to inngest functions...`)
		fetch(`http://${args.host}:${args.port}/api/inngest`, { method: "PUT" })
	}
})

fastify.log.info('Server started')