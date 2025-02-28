import { EventSchemas, Inngest, InngestMiddleware, NonRetriableError } from "inngest"
import { object, string } from "zod"

const eventsMap = {
	"test/hello.world": {
		data: object({
			email: string(),
		}),
	}
}

const validate = new InngestMiddleware({
	name: 'schema-validation',
	init: async () => ({
		onFunctionRun: () => ({
			transformInput({ ctx }) {
				if (ctx.event) {
					if (ctx.event.data && ctx.event.name in eventsMap) {
						const schema = eventsMap[ctx.event.name as keyof typeof eventsMap].data
						const result = schema.safeParse(ctx.event.data)
						if (!result.success) {
							throw new NonRetriableError(result.error.message)
						}
						ctx.event.data = result.data
					}
				}
			},
		}),
	})
})

export const inngest = new Inngest({
	id: "my-app",
	schemas: new EventSchemas().fromZod(eventsMap),
	middleware: [
		validate,
	],
})

const helloWorld = inngest.createFunction(
	{ id: "hello-world" },
	{ event: "test/hello.world" },
	async ({ event, step }) => {
		const data = event.data
		await step.sleep("wait-a-moment", "1s")
		return { message: `Hello ${data.email}!` }
	},
)

export const functions = [
	helloWorld,
]