import React from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'
import { Star } from 'lucide-react'

const TestimonialsSection = () => {
  return (
          <section id="testimonials" className="py-20 px-8 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-foreground md:text-4xl font-bold mb-4">Cosa dicono i nostri utenti</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Migliaia di persone hanno già trasformato le loro vite con HabitFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  &quot;HabitFlow ha completamente cambiato il mio approccio alle abitudini. Finalmente riesco a essere
                  costante!&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">MR</span>
                  </div>
                  <div>
                    <div className="font-medium">Marco Rossi</div>
                    <div className="text-sm text-muted-foreground">Imprenditore</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  &quot;L&apos;interfaccia è bellissima e le statistiche mi motivano ogni giorno. Non potrei più farne a meno!&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">LB</span>
                  </div>
                  <div>
                    <div className="font-medium">Laura Bianchi</div>
                    <div className="text-sm text-muted-foreground">Designer</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="text-base">
                  &quot;Grazie a HabitFlow ho sviluppato 5 nuove abitudini positive in soli 3 mesi. Incredibile!&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-medium">AG</span>
                  </div>
                  <div>
                    <div className="font-medium">Andrea Gialli</div>
                    <div className="text-sm text-muted-foreground">Studente</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

  )
}

export default TestimonialsSection