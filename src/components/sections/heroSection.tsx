import { Zap, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function HeroSection() {

    return(

        <section className="py-20 md:py-32">
            <div className="container">
                <div className="mx-auto max-w-4xl text-center">
                <Badge variant="secondary" className="mb-6">
                    <Zap className="mr-2 h-3 w-3" />
                    Nuovo: Statistiche avanzate disponibili
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                    Trasforma le tue <span className="text-primary">abitudini</span> in successi quotidiani
                </h1>

                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
                    Il modo più semplice e potente per tracciare, costruire e mantenere abitudini positive. Raggiungi i tuoi
                    obiettivi con HabitFlow.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                    Inizia oggi
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                    Guarda la demo
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-sm text-muted-foreground">Utenti attivi</div>
                    </div>
                    <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">1M+</div>
                    <div className="text-sm text-muted-foreground">Abitudini tracciate</div>
                    </div>
                    <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Tasso di successo</div>
                    </div>
                </div>
                </div>
            </div>
        </section>


    )

}