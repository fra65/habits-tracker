/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import deleteCategory from '../../api/deleteCategory'
import { useTranslations } from 'next-intl'

type DeleteCategoryModalProps = {
  categoryId: number
  onClose: () => void
  onDeleteSuccess: () => void
}

export default function DeleteCategoryModal({
  categoryId,
  onClose,
  onDeleteSuccess,
}: DeleteCategoryModalProps) {
  const t = useTranslations('CategoryPage')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await deleteCategory(categoryId)
      if (result) {
        onDeleteSuccess()
      } else {
        setError(t('Modals.DeleteCategory.dc-error'))
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          t('Modals.DeleteCategory.dc-fail')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg text-foreground font-bold mb-4">{t('Modals.DeleteCategory.dc-title')}</h3>
        <p className="mb-6 text-muted-foreground">{t('Modals.DeleteCategory.dc-desc')}</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-4">
          <Button className='cursor-pointer text-foreground' variant="ghost" onClick={onClose} disabled={loading}>
            {t('Buttons.b-cancel')}
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? t('Modals.DeleteCategory.dc-loading') : t('Buttons.b-confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
