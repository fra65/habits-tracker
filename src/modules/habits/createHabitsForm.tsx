'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { format } from 'date-fns'
// import { cn } from '@/lib/utils'

export default function CreateHabitForm() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [visibility, setVisibility] = useState(true)

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Titolo</label>
        <Input placeholder="Esempio: Meditazione mattutina" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categoria</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="salute">Salute</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="lavoro">Lavoro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">Descrizione</label>
        <Textarea placeholder="Scrivi una descrizione opzionale..." rows={3} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Data inizio</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              {startDate ? format(startDate, 'PPP') : <span>Seleziona data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Data fine</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              {endDate ? format(endDate, 'PPP') : <span>Seleziona data (opzionale)</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Priorità</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Scegli priorità" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bassa">Bassa</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Colore</label>
        <Input type="color" className="h-10 p-1" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target</label>
        <Input type="number" placeholder="Esempio: 10.000 (passi, minuti, ecc.)" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Visibilità</label>
        <div className="flex items-center gap-2">
          <Switch checked={visibility} onCheckedChange={setVisibility} />
          <span className="text-sm text-muted-foreground">
            {visibility ? 'Pubblica' : 'Privata'}
          </span>
        </div>
      </div>

      <div className="md:col-span-2">
        <Button type="submit" className="w-full">Crea Abitudine</Button>
      </div>
    </form>
  )
}