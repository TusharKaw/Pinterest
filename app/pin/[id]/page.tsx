"use client"

import { useRouter } from "next/navigation"
import { PinDetailNew } from "@/components/pin-detail-new"
import { use } from "react"

export default function PinPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const handleClose = () => {
    router.back()
  }

  return (
    <PinDetailNew 
      pinId={id} 
      onClose={handleClose} 
    />
  )
}
