import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to home feed if authenticated, otherwise show landing
  redirect("/home")
}
