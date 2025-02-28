import { useEffect, useState } from "react"

export function DemoQuery() {
	const [data, setData] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	useEffect(() => {
		let running = true
		setLoading(true)
		setError("")
		fetch("/api/michel")
			.then(res => res.json())
			.then(
				(result) => {
					if (running) {
						setData(result)
						setLoading(false)
						setError("")
					}
				},
				(error) => {
					if (running) {
						setError(error)
						setLoading(false)
						setData("")
					}
				}
			)

		return () => {
			running = false
		}
	}, [])

	return <pre>{JSON.stringify({ data, loading, error }, null, 2)}</pre>
}