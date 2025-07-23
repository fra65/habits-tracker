import React from "react"
import { iconMap } from "@/utils/icons/iconMap"
import { Target } from "lucide-react"

interface IconFromNameProps {
  iconName: string
  size?: number
  color?: string
}

export function IconFromName({ iconName, size = 24, color = "currentColor" }: IconFromNameProps) {
  const IconComponent = iconMap[iconName]

  if (!IconComponent) return <Target/>

  return <IconComponent size={size} color={color} />
}
