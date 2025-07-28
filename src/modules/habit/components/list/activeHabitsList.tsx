/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from "react"
import HabitsListSkeleton from "../skeleton/CategoryListSkeleton"
import { useTranslations } from "next-intl"
import getActiveHabitsWithCategory from "../../api/getActiveHabitsWithCategory"
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"
import { HabitDetailsModal } from "../modals/HabitDetailsModal"
import ActiveHabitsListItem from "../list-item/activeHabitsListItem"

interface ActiveHabitsListProps {
  refreshCalendar: () => Promise<void>
}

const ActiveHabitsList = ({ refreshCalendar }: ActiveHabitsListProps) => {
  const [habits, setHabits] = useState<HabitCategoryOutput[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<HabitCategoryOutput | null>(null)

  const t = useTranslations("HabitsListPage")

  async function fetchHabitsWithCategory() {
    setLoading(true)
    try {
      const data = await getActiveHabitsWithCategory()
      setHabits(data)
    } catch (error) {
      console.error("Errore caricamento abitudini attive:", error)
      setHabits([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHabitsWithCategory()
  }, [])

  // Richiama il ricaricamento dei dati nella lista dopo un update sull’habit
  function handleHabitUpdated() {
    fetchHabitsWithCategory()
  }

  function handleHabitDeleted() {
    fetchHabitsWithCategory()
  }

  function openDetailsModal(habit: HabitCategoryOutput) {
    setSelectedHabit(habit)
    setDetailsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="p-4 w-full box-border">
        <HabitsListSkeleton />
      </div>
    )
  }

  return (
    <div className="w-full p-4 flex flex-col gap-8 box-border">
      <div className="w-full px-0.5 flex flex-col items-center">
        <h1 className="w-full text-center font-bold text-xl text-foreground">
          {t('hlp-title')}
        </h1>
        <p className="text-center text-muted-foreground">{t('hlp-subtitle')}</p>
      </div>

      {/* Lista degli habits */}
      <div className="space-y-3 w-full p-4 border rounded-md shadow-sm box-border">
        {habits && habits.length > 0 ? (
          habits.map((habit) => (
            <ActiveHabitsListItem
              key={habit.id}
              id={habit.id}
              titolo={habit.titolo}
              descrizione={habit.descrizione}
              color={habit.color}
              categoria={habit.categoria}
              isActive={habit.isActive}
              priority={habit.priority}
              categoriaId={habit.categoriaId}
              startDate={habit.startDate}
              userId={habit.userId}
              onClick={() => openDetailsModal(habit)}
              refreshCalendar={refreshCalendar} // Passa la funzione refresh
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground">{t('hlp-no-habits')}</p>
        )}
      </div>

      {/* Modale dettagli/modifica habit */}
      <HabitDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        habit={selectedHabit}
        onHabitUpdated={() => {
          handleHabitUpdated()
          setDetailsModalOpen(false)
        }}
        onHabitDeleted={() => {
          handleHabitDeleted()
          setDetailsModalOpen(false)
        }}
      />
    </div>
  )
}

export default ActiveHabitsList
