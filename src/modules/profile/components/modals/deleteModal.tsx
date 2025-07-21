/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import deleteProfile from '../../api/deleteProfile';
import { useTranslations } from 'next-intl';

type DeleteConfirmModalProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
};

export default function DeleteModal({ onClose, onDeleteSuccess }: DeleteConfirmModalProps) {
  const t = useTranslations("ProfilePage");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteProfile();
      if (result === true) {
        onDeleteSuccess();
      } else {
        setError(t('Modals.DeleteProfile.dp-error', { defaultValue: 'La cancellazione non è andata a buon fine.' }));
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        t('Modals.DeleteProfile.dp-fail', { defaultValue: 'Errore durante la cancellazione.' })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">{t('Modals.DeleteProfile.dp-title')}</h3>
        <p className="mb-6">{t('Modals.DeleteProfile.dp-desc')}</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t('Buttons.b-cancel')}
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? t('Modals.DeleteProfile.dp-loading', { defaultValue: 'Eliminazione...' }) : t('Buttons.b-confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
