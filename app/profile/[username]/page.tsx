import { Header } from "@/components/header"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <UserProfile username={params.username} />
      </main>
    </div>
  )
}
