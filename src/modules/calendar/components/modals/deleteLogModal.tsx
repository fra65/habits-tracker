/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'


type DeleteLogModalProps = {
  habitId: number
  onClose: () => void
  onDeleteSuccess: () => Promise<void> // async perché aggiorna dati dopo cancellazione
  deleteLogApi: (id: number, date: Date) => Promise<{ isDelete: boolean; message: string }>
}

export default function DeleteLogModal({
  habitId,
  onClose,
  onDeleteSuccess,
  deleteLogApi,
}: DeleteLogModalProps) {
  const t = useTranslations('DeleteLogModal')

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
      logDate.setDate(logDate.getDate() + 1); // aggiunge un giorno


      const response = await deleteLogApi(habitId, logDate)

      if (!response.isDelete) {
        setError(response.message)
      } else {
        setSuccessMessage(response.message)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('error-default'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = async () => {
    if (successMessage) {
      await onDeleteSuccess()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">{t('title')}</h3>

        {!successMessage && (
          <>
            <p className="mb-6">{t('description')}</p>

            {error && (
              <p className="text-red-600 mb-4" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                {t('cancel')}
              </Button>
              <Button
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? t('loading') : t('confirm')}
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
              <Button onClick={handleClose}>{t('close')}</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
