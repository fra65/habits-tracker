"use client"

import React from "react"
import { toast, Toaster } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CompletaProfiloToast() {
  React.useEffect(() => {
    toast.custom((tId) => (
      <div
        key={tId}
        className="
          flex flex-col gap-2 max-w-sm p-4 rounded-md shadow-md
          bg-warning text-warning-foreground
          pointer-events-auto
          animate-fadeIn
          transform transition-all
        "
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <p className="font-semibold text-sm">Profilo incompleto</p>
        <p className="text-xs">
          Il tuo profilo non è completo, completa le informazioni mancanti.
        </p>

        <Link href="/pages/profile" passHref>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(tId)}
            className="self-start"
          >
            Completa Profilo
          </Button>
        </Link>
      </div>
    ), { duration: 8000 })
  }, [])

  return <Toaster position="bottom-right" richColors closeButton />
}
