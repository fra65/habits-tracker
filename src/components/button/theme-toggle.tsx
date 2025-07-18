import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  context?: "sidebar" | "header" | "footer" | string;
}

export function ThemeToggle({
  value,
  onChange,
  disabled = false,
  context,
}: ThemeToggleProps) {
  const { theme: systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Usa il valore ricevuto o fallback al theme di sistema
  const currentTheme =
    value !== undefined
      ? value
      : systemTheme || "system";

  const isDark =
    currentTheme === "dark" ||
    (currentTheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const Icon = isDark ? Moon : Sun;

  const handleChange = (newTheme: string) => {
    if (onChange) {
      onChange(newTheme);
    } else {
      setTheme(newTheme);
    }
  };

  if (context === "sidebar") {
    // Bottone iconico senza dropdown
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          // Cicla tra light, dark, system
          if (currentTheme === "light") handleChange("dark");
          else if (currentTheme === "dark") handleChange("system");
          else handleChange("light");
        }}
      >
        <Icon className="w-4 h-4 stroke-foreground" />
      </Button>
    );
  }

  // Render dropdown per default o altri contesti
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={context === "header" ? "sm" : "default"}
          className="cursor-pointer shadow-none border-none"
          aria-label="Select theme"
          disabled={disabled}
        >
          <Icon className="w-4 h-4 stroke-foreground" />
        </Button>
      </DropdownMenuTrigger>
      {!disabled && (
        <DropdownMenuContent
          align="start"
          className="border-none shadow-md w-full min-w-[150px]"
        >
          <DropdownMenuItem
            onClick={() => handleChange("light")}
            className="cursor-pointer w-full"
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleChange("dark")}
            className="cursor-pointer w-full"
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleChange("system")}
            className="cursor-pointer w-full"
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
