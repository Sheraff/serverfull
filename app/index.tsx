import { DemoQuery } from "#app/components/DemoQuery"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
)

function App() {
	return <>
		<h1>Hello, world!</h1>
		<hr />
		<DemoQuery />
	</>
}