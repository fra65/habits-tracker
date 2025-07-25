/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from "react"
import HabitsListItem from "../list-item/habitsListItem"
import HabitsListSkeleton from "../skeleton/CategoryListSkeleton"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
// import {CreateHabitModal} from "../modals/createHabitModal"
import getHabitsWithCategory from "../../api/getHabitsWithCategory"
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema"
import { HabitDetailsModal } from "../modals/HabitDetailsModal"
import { CreateHabitModal } from "../modals/createHabitModal"
// import { HabitDetailsModal } from "../modals/HabitDetailsModal"
// import { HabitDetailsModal } from "../modals/habitDetailsModal"

const HabitsList = () => {
  const [habits, setHabits] = useState<HabitCategoryOutput[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<HabitCategoryOutput | null>(null)

  const t = useTranslations("HabitsListPage")

  async function fetchHabitsWithCategory() {
    setLoading(true)
    const data = await getHabitsWithCategory()
    setHabits(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchHabitsWithCategory()
  }, [])

  const handleHabitCreated = async () => {
    await fetchHabitsWithCategory(); // refresh della lista (attendi fine)
  }

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
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8 my-auto">
      <div className="max-w-4xl mx-auto px-0.5 flex flex-col">
        <h1 className="w-full text-center font-bold text-xl text-foreground">
          {t('hlp-title')}
        </h1>
        <p className="text-center text-muted-foreground">{t('hlp-subtitle')}</p>
      </div>

      <ul className="space-y-3 w-full">

        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">

          {habits?.map((habit) => (
            <HabitsListItem
                  key={habit.id}
                  titolo={habit.titolo}
                  descrizione={habit.descrizione}
                  color={habit.color}
                  id={habit.id}
                  categoria={habit.categoria}
                  onClick={() => openDetailsModal(habit)} categoriaId={0} startDate={""} priority={"BASSA"} isActive={habit.isActive} userId={0}          />
          ))}

        </div>

      </ul>

      <div className="mt-4 mx-auto">
        <Button onClick={() => setCreateModalOpen(true)}>{t("Buttons.b-new")}</Button>
      </div>

      {/* Modale crea nuovo habit */}
      <CreateHabitModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onHabitCreated={handleHabitCreated}
      />

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

export default HabitsList
