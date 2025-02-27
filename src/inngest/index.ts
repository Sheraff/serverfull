import { EventSchemas, Inngest } from "inngest"
import { object, string } from "zod"

const eventsMap = {
	"test/hello.world": {
		data: object({
			email: string(),
		}),
	}
}

export const inngest = new Inngest({
	id: "my-app", schemas: new EventSchemas()
		.fromZod(eventsMap),
})

// Your new function:
const helloWorld = inngest.createFunction(
	{ id: "hello-world" },
	{ event: "test/hello.world" },
	async ({ event, step }) => {
		await step.sleep("wait-a-moment", "1s")
		return { message: `Hello ${event.data.email}!` }
	},
)

// Add the function to the exported array:
export const functions = [
	helloWorld,
]