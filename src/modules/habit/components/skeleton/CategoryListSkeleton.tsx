import React from 'react'
import { Skeleton } from '@/components/ui/skeleton' // Assicurati che il percorso sia corretto per il tuo progetto
import { cn } from '@/lib/utils' // Funzione utility per condizionare classi Tailwind

interface ListSkeletonProps {
  /**
   * Numero di elementi skeleton da mostrare nella lista.
   * @default 5
   */
  count?: number;
  /**
   * Larghezza opzionale per ciascun elemento skeleton.
   * Utile se gli elementi della lista hanno larghezze variabili.
   * @default "w-full" (occupa tutta la larghezza disponibile)
   */
  itemWidth?: string;
  /**
   * Altezza opzionale per ciascun elemento skeleton.
   * Utile per simulare l'altezza degli elementi reali della lista.
   * @default "h-12"
   */
  itemHeight?: string;
  /**
   * Classi Tailwind CSS aggiuntive per il contenitore principale dello skeleton.
   */
  className?: string;
}

const HabitsListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  itemWidth = "w-full",
  itemHeight = "h-12",
  className,
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className={cn(itemWidth, itemHeight)} />
      ))}
    </div>
  )
}

export default HabitsListSkeleton
