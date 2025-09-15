"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /patients immediately
    router.replace('/patients')
  }, [router])

  // Return null since we're redirecting
  return null
}
