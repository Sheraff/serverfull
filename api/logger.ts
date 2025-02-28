import { pino } from "pino"

export const logger = pino(
	process.env.NODE_ENV !== 'production'
		? await import('pino-pretty')
			.then(m => m.default({ colorize: true }))
		: undefined
)