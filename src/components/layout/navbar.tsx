import { Target } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Navbar() {
  return (

    <header className="sticky top-0 z-50 w-full px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">HabitFlow</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Funzionalità
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Prezzi
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
            Recensioni
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href='/pages/dashboard'>
            <Button size="sm" className="bg-primary hover:bg-primary/90 cursor-pointer">
              Inizia Ora
            </Button>
          </Link>
        </div>
      </div>
    </header>

  );
}