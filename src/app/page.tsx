import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  TrendingUp,
  Calendar,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  Shield,
  Smartphone,
} from "lucide-react"
import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import HeroSection from "@/components/sections/heroSection"

export default function HabitsTrackerLanding() {
  return (
    <div className="w-full bg-background">


      {/* Header */}
      <Navbar />


      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tutto quello che ti serve per il successo</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strumenti potenti e intuitivi per aiutarti a costruire abitudini durature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Tracking Intelligente</CardTitle>
                <CardDescription>Monitora le tue abitudini con un sistema intuitivo e personalizzabile</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Analisi Dettagliate</CardTitle>
                <CardDescription>Visualizza i tuoi progressi con grafici e statistiche avanzate</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Obiettivi Personalizzati</CardTitle>
                <CardDescription>Imposta obiettivi realistici e raggiungi traguardi significativi</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>App Mobile</CardTitle>
                <CardDescription>Accedi alle tue abitudini ovunque con la nostra app mobile</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>Connettiti con altri utenti e condividi i tuoi successi</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Sicurezza</CardTitle>
                <CardDescription>I tuoi dati sono protetti con crittografia di livello enterprise</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Come funziona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tre semplici passi per trasformare la tua vita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Definisci le tue abitudini</h3>
              <p className="text-muted-foreground">
                Scegli le abitudini che vuoi sviluppare e imposta obiettivi realistici
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Traccia i progressi</h3>
              <p className="text-muted-foreground">
                Registra quotidianamente i tuoi progressi con il nostro sistema intuitivo
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Celebra i successi</h3>
              <p className="text-muted-foreground">Visualizza i tuoi risultati e celebra ogni traguardo raggiunto</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-8 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cosa dicono i nostri utenti</h2>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Inizia oggi il tuo percorso di crescita</h2>
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

      {/* Footer */}
      <Footer />


    </div>
  )
}
