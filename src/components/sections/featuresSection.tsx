import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Calendar, BarChart3, TrendingUp, Smartphone, Users, Shield } from 'lucide-react'

const FeaturesSection = () => {
  return (
          <section id="features" className="py-20 px-8 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-foreground  text-3xl md:text-4xl font-bold mb-4">Tutto quello che ti serve per il successo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strumenti potenti e intuitivi per aiutarti a costruire abitudini durature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Tracking Intelligente</CardTitle>
                <CardDescription>Monitora le tue abitudini con un sistema intuitivo e personalizzabile</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analisi Dettagliate</CardTitle>
                <CardDescription>Visualizza i tuoi progressi con grafici e statistiche avanzate</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Obiettivi Personalizzati</CardTitle>
                <CardDescription>Imposta obiettivi realistici e raggiungi traguardi significativi</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>App Mobile</CardTitle>
                <CardDescription>Accedi alle tue abitudini ovunque con la nostra app mobile</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>Connettiti con altri utenti e condividi i tuoi successi</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Sicurezza</CardTitle>
                <CardDescription>I tuoi dati sono protetti con crittografia di livello enterprise</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

  )
}

export default FeaturesSection