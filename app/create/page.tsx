import { Header } from "@/components/header"
import { CreatePinForm } from "@/components/create-pin-form"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">Create Pin</h1>
            <CreatePinForm />
          </div>
        </div>
      </main>
    </div>
  )
}
