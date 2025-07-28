/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

type DeleteLogModalProps = {
  habitId: number
  onClose: () => void
  onDeleteSuccess: () => Promise<void> // anche async perché può aggiornare dati
  deleteLogApi: (id: number, date: Date) => Promise<{ isDelete: boolean; message: string }>
}

export default function DeleteLogModal({
  habitId,
  onClose,
  onDeleteSuccess,
  deleteLogApi,
}: DeleteLogModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const now = new Date()
      const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const response = await deleteLogApi(habitId, logDate)

      if (!response.isDelete) {
        setError(response.message)
      } else {
        setSuccessMessage(response.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossibile cancellare il log.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = async () => {
    if (successMessage) {
      // Se abbiamo successo, aggiorniamo i dati prima di chiudere
      await onDeleteSuccess()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">Conferma cancellazione log</h3>

        {!successMessage && (
          <>
            <p className="mb-6">
              Sei sicuro di voler eliminare questo log? Questa operazione è irreversibile.
            </p>

            {error && <p className="text-red-600 mb-4" role="alert">{error}</p>}

            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                Annulla
              </Button>
              <Button
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? 'Eliminazione in corso...' : 'Conferma'}
              </Button>
            </div>
          </>
        )}

        {successMessage && (
          <>
            <p className="mb-6 text-green-600" role="alert">
              {successMessage}
            </p>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Chiudi</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
