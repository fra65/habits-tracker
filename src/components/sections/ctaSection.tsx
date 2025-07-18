import { ArrowRight, CheckCircle } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const CtaSection = () => {
  return (
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl text-foreground md:text-4xl font-bold mb-6">Inizia oggi il tuo percorso di crescita</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ricevi tramite email il nostro template cartaceo da stampare per tenere traccia dei tuoi progressi... direttamente in camera tua!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Input type="email" placeholder="Inserisci la tua email" className="max-w-sm" />
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Inizia Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                Gratis per sempre
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                Nessuna carta richiesta
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                Cancellazione facile
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default CtaSection