/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

type ChangePasswordConfirmModalProps = {
  onClose: () => void;
};

export default function ChangePasswordModal({ onClose }: ChangePasswordConfirmModalProps) {
  const t = useTranslations("ProfilePage");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    try {
      // Effettua il logout e reindirizza esplicitamente
      await signOut({ callbackUrl: '/forgot-password' });
      // Attenzione: signOut gestisce già il redirect.
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        t('Modals.ChangePassword.cp-error')
      );
      setLoading(false); // Torna interattivo solo se errore
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">{t('Modals.ChangePassword.cp-title')}</h3>
        <p className="mb-6">
          {t.rich('Modals.ChangePassword.cp-desc', {
            continue: (children) => <span className="font-semibold">{children}</span>,
            br: () => <>
              <br />
              <br />
            </>
          })}
          <span className="text-red-600">{t('Modals.ChangePassword.cp-advise')}</span>
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-4">
          <Button className="cursor-pointer" variant="outline" onClick={onClose} disabled={loading}>
            {t('Buttons.b-cancel')}
          </Button>
          <Button className="cursor-pointer" onClick={handleContinue} disabled={loading}>
            {loading ? t('Modals.ChangePassword.cp-loading') : t('Buttons.b-confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
