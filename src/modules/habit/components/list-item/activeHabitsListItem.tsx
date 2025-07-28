import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IconFromName } from "@/components/icons/iconFromName";
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema";
import CreateLogModal from "@/modules/calendar/components/modals/createLogModal";
import DeleteLogModal from "@/modules/calendar/components/modals/deleteLogModal";
import deleteLog from "@/modules/calendar/api/deleteLog";

interface ActiveHabitsListItemProps extends HabitCategoryOutput {
  onClick: () => void;
  refreshCalendar: () => Promise<void>; // funzione per refresh calendario
}

const ActiveHabitsListItem = ({
  id,
  titolo,
  color,
  priority,
  isActive,
  categoria,
  refreshCalendar,
}: ActiveHabitsListItemProps) => {
  const t = useTranslations("HabitsListPage");

  const displayPriority = t(`Priorities.${priority.toUpperCase()}`);

  const activeClass = isActive ? "opacity-100" : "opacity-50";

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Apertura/chiusura modale creazione log
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Apertura/chiusura modale cancellazione
  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <>
      <li
        id={`${id}`}
        style={{ backgroundColor: color }}
        className={`flex items-center justify-between rounded-md p-4 shadow-sm text-white cursor-pointer ${activeClass}`}
        // Rimosso onClick e onKeyDown per non far succedere nulla al click generico
        role="listitem" // - opzionale per accessibilità (invece di role=button)
        tabIndex={-1}  // Non focusabile per tab
      >
        <div className="flex items-center space-x-4">
          <div>
            <IconFromName iconName={categoria.icona} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{titolo}</h3>
            <small className="text-xs opacity-70">
              {t("hlp-priority")}: {displayPriority}
            </small>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 min-w-[150px]">
          <div className="flex space-x-2">
            <button
              onClick={handleOpenModal}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
              aria-label="Create Log modal"
            >
              ✔️
            </button>
            <button
              onClick={openDeleteModal}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              aria-label="Remove from log"
            >
              ❌
            </button>
          </div>
        </div>
      </li>

      {/* Modale creazione log */}
      {modalOpen && (
        <CreateLogModal
          isOpen={modalOpen}
          habitId={id}
          habitTitle={titolo}
          onClose={handleCloseModal}
          refreshCalendar={refreshCalendar} // <-- aggiunto
        />
      )}

      {/* Modale conferma cancellazione */}
      {deleteModalOpen && (
        <DeleteLogModal
          habitId={id}
          onClose={closeDeleteModal}
          onDeleteSuccess={async () => {
            await refreshCalendar(); // aggiornamento dietro le quinte
            closeDeleteModal();
          }}
          deleteLogApi={deleteLog} // passiamo la funzione API al modale
        />
      )}
    </>
  );
};

export default ActiveHabitsListItem;
