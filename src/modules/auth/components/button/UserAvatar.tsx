'use client';

import { DashboardSkeleton } from '@/components/skeletons/dashboardSkeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const UserAvatar = () => {
  const { data: session, status,  } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // aspetta che lo stato sia definito

    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <DashboardSkeleton /> // opzionale: mostra qualcosa mentre carica
  }

  if (!session) {
    return null; // evita di renderizzare contenuti se non autenticato
  }

  return (
    <div>
      <p>
        Welcome 
        {
          session.user.name ?
          session.user.name :
          session.user.username ?
          session.user.username :
          "Unknown"
        }
      </p>

      {session.user.role === 'ADMIN' ? "BIG BOSS" : "Common user"}
    </div>
  );
};

export default UserAvatar;
