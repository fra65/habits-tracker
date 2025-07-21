/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import resetPreferences from '../../api/resetPreferences';
import { useTranslations } from 'next-intl';

type ResetConfirmModalProps = {
  onClose: () => void;
  onResetSuccess: () => void;
};

export default function ResetModal({ onClose, onResetSuccess }: ResetConfirmModalProps) {
  const t = useTranslations("ProfilePage");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmReset = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await resetPreferences();
      if (result) {
        onResetSuccess();
      } else {
        setError(t('Modals.ResetPreferences.rp-error'));
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          t('Modals.ResetPreferences.rp-fail')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">{t('Modals.ResetPreferences.rp-title')}</h3>
        <p className="mb-6">{t('Modals.ResetPreferences.rp-desc')}</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-4">
          <Button className="cursor-pointer" variant="outline" onClick={onClose} disabled={loading}>
            {t('Buttons.b-cancel')}
          </Button>
          <Button
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            onClick={handleConfirmReset}
            disabled={loading}
          >
            {loading ? t('Modals.ResetPreferences.rp-loading') : t('Buttons.b-confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
