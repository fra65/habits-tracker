import React from 'react'

const HowItWorksSection = () => {
  return (
          <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-foreground md:text-4xl font-bold mb-4">Come funziona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tre semplici passi per trasformare la tua vita
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl text-foreground font-semibold mb-4">Definisci le tue abitudini</h3>
              <p className="text-muted-foreground">
                Scegli le abitudini che vuoi sviluppare e imposta obiettivi realistici
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl text-foreground font-semibold mb-4">Traccia i progressi</h3>
              <p className="text-muted-foreground">
                Registra quotidianamente i tuoi progressi con il nostro sistema intuitivo
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl text-foreground font-semibold mb-4">Celebra i successi</h3>
              <p className="text-muted-foreground">Visualizza i tuoi risultati e celebra ogni traguardo raggiunto</p>
            </div>
          </div>
        </div>
      </section>

  )
}

export default HowItWorksSection