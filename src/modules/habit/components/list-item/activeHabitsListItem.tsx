import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IconFromName } from "@/components/icons/iconFromName";
import { HabitCategoryOutput } from "../../schema/HabitCategoryOutputSchema";
import CreateLogModal from "@/modules/calendar/components/modals/createLogModal";
import deleteLog from "@/modules/calendar/api/deleteLog";
import DeleteResponse from "@/modules/calendar/types/DeleteResponse";

interface ActiveHabitsListItemProps extends HabitCategoryOutput {
  onClick: () => void;
}

// const predefinedTitles = ["Salute", "Lavoro", "Sport"]; // Puoi adattare se serve

const ActiveHabitsListItem = ({
  id,
  titolo,
  color,
  priority,
  isActive,
  categoria,
  onClick,
}: ActiveHabitsListItemProps) => {
  const t = useTranslations("HabitsListPage");

  const displayPriority = t(`Priorities.${priority.toUpperCase()}`);

  const activeClass = isActive ? "opacity-100" : "opacity-50";

  // Stato per apertura modale
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  // Gestione apertura modale al click del bottone spunta
  const handleOpenModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Simulazione API di rimozione dal log (puoi sostituire con la tua funzione reale)
  async function removeFromLog(response: DeleteResponse) {
    setLoadingRemove(true);
    setMessage(null);
    setMessageType(null);
    try {
      // Simula delay API
      await new Promise((r) => setTimeout(r, 1000));
      // Logica dummy: se id è pari, fallisce
      if (!response.isDelete) {
        setMessage(response.message);
        setMessageType("error");
      } else {
        setMessage(response.message);
        setMessageType("success");
      }
    } catch {
      setMessage(t("error-generic"));
      setMessageType("error");
    } finally {
      setLoadingRemove(false);
    }
  }

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const now = new Date();
    const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const response = await deleteLog(id, logDate)
    
    removeFromLog(response);
  };

  return (
    <>
      <li
        id={`${id}`}
        style={{ backgroundColor: color }}
        className={`flex items-center justify-between rounded-md p-4 shadow-sm text-white cursor-pointer ${activeClass}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="flex items-center space-x-4">
          <div>
            <IconFromName iconName={categoria.icona} />
            {/* {displayCategoryTitle} */}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{titolo}</h3>
            {/* <p className="text-sm opacity-90">{descrizione}</p> */}
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
              onClick={handleRemove}
              disabled={loadingRemove}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded text-sm"
              aria-label="Remove from log"
            >
              {loadingRemove ? t("loading") : "❌"}
            </button>
          </div>

          {message && (
            <p
              className={`text-xs whitespace-normal max-w-xs ${
                messageType === "success" ? "text-green-300" : "text-red-300"
              }`}
              role={messageType === "error" ? "alert" : undefined}
            >
              {message}
            </p>
          )}
        </div>
      </li>

      {/* Passa isOpen, habitId, habitTitle e onClose al modale */}
      <CreateLogModal
        isOpen={modalOpen}
        habitId={id}
        habitTitle={titolo}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ActiveHabitsListItem;
