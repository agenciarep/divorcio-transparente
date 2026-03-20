import { useState, useEffect } from "react"
import LandingPage from "./components/LandingPage.jsx"
import Simulator from "./components/Simulator.jsx"

export default function App() {
  const [page, setPage] = useState("landing")

  // If URL has ?simulador=1 go straight to simulator (for direct ad links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("simulador") === "1") setPage("simulator")
  }, [])

  if (page === "simulator") return <Simulator onBackToLanding={() => setPage("landing")} />
  return <LandingPage onStart={() => setPage("simulator")} />
}
