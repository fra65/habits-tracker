'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import getIsCompleteProfile from '../../api/getIsComplete';
import InfoProfilo from './infoProfilo';
// import CompletaProfilo from './completaProfilo';
import { DashboardSkeleton } from '@/components/skeletons/dashboardSkeleton';
import { CompletaProfiloToast } from './completaProfiloToast';

const ProfileInfoContainer = () => {
  const { data: session, status } = useSession();

  const [isComplete, setIsComplete] = useState<boolean | null | undefined>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      // Se non autenticato o in caricamento, resetta stato
      setIsComplete(null);
      return;
    }

    // Quando siamo autenticati, carica lo stato del profilo
    const fetchProfileStatus = async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const result = await getIsCompleteProfile();
        setIsComplete(result);
      } catch (err) {
        setError('Errore nel caricamento del profilo' + err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileStatus();
  }, [status, session]);

  if (status === 'loading' || loadingProfile) {
    return <DashboardSkeleton />
  }

  if (!session) {
    return null; // Non autenticato: non mostrare nulla o redirect
  }

  if (error) {
    return <p>{error}</p>; // Mostra errore se presente
  }

  if (isComplete === null) {
    // Stato non ancora definito (puoi mostrare loader o nulla)
    return <p>Caricamento stato profilo...</p>;
  }

  return (
    <>
      {isComplete ? <InfoProfilo /> : <CompletaProfiloToast />}
    </>
  );
};

export default ProfileInfoContainer;