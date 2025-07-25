/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from "react"
import HabitsListItem from "../list-item/habitsListItem"
import HabitsListSkeleton from "../skeleton/CategoryListSkeleton"
import { useTranslations } from "next-intl"
import getActiveHabitsWithCategory from "../../api/getActiveHabitsWithCategory"
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"
import { HabitDetailsModal } from "../modals/HabitDetailsModal"
import ActiveHabitsListItem from "../list-item/activeHabitsListItem"

const ActiveHabitsList = () => {
  const [habits, setHabits] = useState<HabitCategoryOutput[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<HabitCategoryOutput | null>(null)

  const t = useTranslations("HabitsListPage")

  async function fetchHabitsWithCategory() {
    setLoading(true)
    const data = await getActiveHabitsWithCategory()
    setHabits(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchHabitsWithCategory()
  }, [])

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
      <div className="p-4">
        <HabitsListSkeleton />
      </div>
    )
  }

  return (
    <div className="w-xl mx-auto p-4 flex flex-col gap-8 my-auto">
      <div className="max-w-4xl mx-auto px-0.5 flex flex-col">
        <h1 className="w-full text-center font-bold text-xl text-foreground">
          {t('hlp-title')}
        </h1>
        <p className="text-center text-muted-foreground">{t('hlp-subtitle')}</p>
      </div>

      {/* Container unico che avvolge tutta la lista */}
      <div className="space-y-3 w-full p-4 border rounded-md shadow-sm">
        {habits?.map((habit) => (
          <ActiveHabitsListItem
            key={habit.id}
            titolo={habit.titolo}
            descrizione={habit.descrizione}
            color={habit.color}
            id={habit.id}
            categoria={habit.categoria}
            onClick={() => openDetailsModal(habit)}
            categoriaId={0}
            startDate={""}
            priority={"BASSA"}
            isActive={habit.isActive}
            userId={0}
          />
        ))}
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
