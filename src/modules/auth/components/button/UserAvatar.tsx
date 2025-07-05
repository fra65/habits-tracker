'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const UserAvatar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // aspetta che lo stato sia definito

    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>; // opzionale: mostra qualcosa mentre carica
  }

  if (!session) {
    return null; // evita di renderizzare contenuti se non autenticato
  }

  return (
    <div>
      <p>Signed in as {session.user?.name}</p>
    </div>
  );
};

export default UserAvatar;
