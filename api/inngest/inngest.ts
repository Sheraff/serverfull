import { EventSchemas, Inngest, NonRetriableError } from "inngest"
import { object, string } from "zod"

const eventsMap = {
	"test/hello.world": {
		data: object({
			email: string(),
		}),
	}
}

export const inngest = new Inngest({
	id: "my-app",
	schemas: new EventSchemas().fromZod(eventsMap),
})

function parse<T>(key: keyof typeof eventsMap, event: { data: T }): T {
	const schema = eventsMap[key].data
	const result = schema.safeParse(event.data)
	if (!result.success) {
		throw new NonRetriableError(result.error.message)
	}
	return result.data as T
}

const helloWorld = inngest.createFunction(
	{ id: "hello-world" },
	{ event: "test/hello.world" },
	async ({ event, step }) => {
		const data = parse("test/hello.world", event)
		await step.sleep("wait-a-moment", "1s")
		return { message: `Hello ${data.email}!` }
	},
)

export const functions = [
	helloWorld,
]