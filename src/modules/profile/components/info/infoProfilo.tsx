/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { ProfileOutput } from '../../schema/ProfileOutput'
import getUserProfile from '../../api/getUser'
import { Button } from '@/components/ui/button'
import DeleteModal from '../modals/deleteModal'

const InfoProfilo = () => {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [profile, setProfile] = useState<ProfileOutput | null>(null)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [notFound, setNotFound] = useState<boolean>(false) // Stato per 404

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    const fetchProfile = async () => {
      setLoadingProfile(true)
      setError(null)
      setNotFound(false)

      try {
        const result = await getUserProfile()
        if (!result) {
          // Profilo non trovato
          setNotFound(true)
          setProfile(null)
        } else {
          setProfile(result)
          setNotFound(false)
        }
      } catch (err: any) {
        // Se l'errore è 404 gestiscilo come profilo non trovato,
        // altrimenti mostra errore generico
        if ((err.response?.status === 404)) {
          setNotFound(true)
          setProfile(null)
        } else {
          setError('Errore nel caricamento del profilo: ' + (err.message || String(err)))
        }
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [status, session, isDelete])

  if (status === 'loading' || loadingProfile) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>
  }

  if (notFound) {
    // Renderizza componente alternativo se profilo non trovato (404)
    return (
      <div>
        <h2>Profilo non trovato</h2>
        <p>Il profilo utente non esiste o è stato eliminato.</p>
        {/* Qui puoi anche mostrare un componente per completare il profilo o altro */}
      </div>
    )
  }

  if (!profile) {
    // Stato iniziale o profilo vuoto: puoi mostrare nulla o un messaggio
    return null
  }

  return (
    <>
      <div>
        <h2>Profilo Utente</h2>
        <p>
          <strong>Nome:</strong> {profile.nome}
        </p>
        <p>
          <strong>Cognome:</strong> {profile.cognome}
        </p>
        <p>
          <strong>Data di nascita:</strong>{' '}
          {new Date(profile.data_nascita).toLocaleDateString()}
        </p>
        <p>
          <strong>Completo:</strong> {profile.is_complete ? 'Sì' : 'No'}
        </p>
        {/* Altri campi */}
      </div>

      <div>
        <Button type="button" onClick={() => setShowModal(true)}>
          DELETE
        </Button>
      </div>

      {showModal && (
        <DeleteModal
          onClose={() => setShowModal(false)}
          onDeleteSuccess={() => {
            setShowModal(false)
            setIsDelete(true)
            setProfile(null)
            setError(null)
            setNotFound(true) // Imposta anche notFound per mostrare messaggio 404 dopo cancellazione
          }}
        />
      )}
    </>
  )
}

export default InfoProfilo
