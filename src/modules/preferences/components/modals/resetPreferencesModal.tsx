/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import resetPreferences from '../../api/resetPreferences';

type ResetConfirmModalProps = {
  onClose: () => void;
  onResetSuccess: () => void;
};

export default function ResetModal({ onClose, onResetSuccess }: ResetConfirmModalProps) {
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
        setError('Il reset non è andato a buon fine.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore durante il reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">Conferma Ripristino</h3>
        <p className="mb-6">Cliccando su Conferma, le preferenze verranno riportate alle impostazioni di fabbrica. Questa azione è irreversibile!</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-end gap-4">
          <Button className='cursor-pointer' variant="outline" onClick={onClose} disabled={loading}>
            Annulla
          </Button>
          <Button className='bg-destructive hover:bg-destructive/90 cursor-pointer' onClick={handleConfirmReset} disabled={loading}>
            {loading ? 'Ripristino...' : 'Conferma'}
          </Button>
        </div>
      </div>
    </div>
  );
}
