'use client'

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { ProfileOutput } from '../../schema/ProfileOutput';
import getUserProfile from '../../api/getUser';

const InfoProfilo = () => {

    const { data: session, status } = useSession();
    const [error, setError] = useState<string>()
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profile, setProfile] = useState<ProfileOutput | undefined | null>(null)

  useEffect(() => {
    if (status !== 'authenticated') {

      return;
    }

    // Quando siamo autenticati, carica lo stato del profilo
    const fetchProfile = async () => {

      setLoadingProfile(true);
      setError("");

      try {

        const result = await getUserProfile();
        setProfile(result);

      } catch (err) {
        setError('Errore nel caricamento del profilo' + err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();

  }, [status, session]);

  if (status === 'loading' || loadingProfile) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>; // Mostra errore se presente
  }

    if (!profile) {
    // Non renderizzare nulla se profile è null o undefined
    return null;
    }

    return (
    <div>
        <h2>Profilo Utente</h2>
        <p><strong>Nome:</strong> {profile.nome}</p>
        <p><strong>Cognome:</strong> {profile.cognome}</p>
        <p><strong>Data di nascita:</strong> {new Date(profile.data_nascita).toLocaleDateString()}</p>
        <p><strong>Completo:</strong> {profile.is_complete ? 'Sì' : 'No'}</p>
        {/* Altri campi */}
    </div>
    );

}

export default InfoProfilo