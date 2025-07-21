/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

type ConfirmModalProps = {
  onClose: () => void;
  onConfirm: () => Promise<boolean> | boolean; // funzione async o sync che salva (ritorna true se ok)
};

export default function ConfirmModal({ onClose, onConfirm }: ConfirmModalProps) {
  const t = useTranslations("ProfilePage");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onConfirm(); // chiama la funzione save passata dal form
      if (!result) {
        setError(t('Modals.SavePreferences.sp-error', { defaultValue: 'La modifica non è andata a buon fine.' }));
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || t('Modals.SavePreferences.sp-error', { defaultValue: 'Errore durante la modifica.' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      // dopo 2 secondi effettua il reload della pagina
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        {!success ? (
          <>
            <h3 className="text-lg font-bold mb-4">
              {t('Modals.SavePreferences.sp-title')}
            </h3>
            <p className="mb-6">
              {t('Modals.SavePreferences.sp-desc')}
            </p>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                {t('Buttons.b-cancel')}
              </Button>
              <Button className="bg-primary" variant="default" onClick={handleConfirm} disabled={loading}>
                {loading
                  ? t('Buttons.b-save', { defaultValue: 'Salvataggio...' })
                  : t('Buttons.b-confirm')}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-green-700 font-semibold">
            {t('Modals.SavePreferences.sp-success')}<br />
            {t('Modals.SavePreferences.sp-reload')}
          </div>
        )}
      </div>
    </div>
  );
}
