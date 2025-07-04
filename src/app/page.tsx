import * as React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Link href="/login">
        <Button size="lg">
          Inizia ora
        </Button>
      </Link>
    </div>
  )
}