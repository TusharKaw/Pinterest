import { Header } from "@/components/header"
import { PinDetail } from "@/components/pin-detail"

export default function PinPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <PinDetail pinId={params.id} />
      </main>
    </div>
  )
}
