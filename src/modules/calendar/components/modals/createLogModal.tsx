/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import CreateLog from "../../api/CreateLog"

interface HabitLogFormProps {
  habitId: number
  habitTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function CreateLogModal({ habitId, habitTitle, isOpen, onClose }: HabitLogFormProps) {
  const t = useTranslations("HabitLogModal")

  const [completed, setCompleted] = useState(true)
  const [value, setValue] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    
    const now = new Date()
    const logDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const data = JSON.stringify({
      habitId,
      completed,
      value: value ? Number.parseInt(value) : null,
      note: note || null,
      logDate: new Date(logDate.toISOString()),
    })

    try {
      const response = await CreateLog(data)

      if (!response) {
        console.error("Errore nella chiamata dell'api")
      }
      
      setMessage({ type: "success", text: t("hlm-success") })
      // Reset form
      setCompleted(true)
      setValue("")
      setNote("")
      // Close modal after delay
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 2000)

    } catch (error) {
      setMessage({ type: "error", text: t("hlm-error") })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setCompleted(true)
    setValue("")
    setNote("")
    setMessage(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("hlm-title")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("hlm-description", { habitTitle })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Completed Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(checked as boolean)}
              />
              <Label
                htmlFor="completed"
                className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("hlm-completed")}
              </Label>
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              <Label htmlFor="value" className="text-muted-foreground">
                {t("hlm-value-label")}
              </Label>
              <Input
                id="value"
                type="number"
                placeholder={t("hlm-value-placeholder")}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            {/* Note Textarea */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-muted-foreground">
                {t("hlm-note-label")}
              </Label>
              <Textarea
                id="note"
                placeholder={t("hlm-note-placeholder")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px] text-muted-foreground"
              />
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" className="text-foreground cursor-pointer" onClick={handleCancel} disabled={isLoading}>
              {t("hlm-cancel")}
            </Button>
            <Button className="cursor-pointer" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("hlm-loading")}
                </>
              ) : (
                t("hlm-insert")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
