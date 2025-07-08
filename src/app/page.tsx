/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Image from 'next/image';

gsap.registerPlugin(TextPlugin);

const screenshots = [
  '/images/demo1.png',
  '/images/demo2.png',
  '/images/demo3.png',
]; // Sostituisci con immagini reali o mockup

function Navbar({ toggleTheme, theme }:  any) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md flex justify-between items-center px-6 py-3 z-50">
      <div className="font-bold text-xl text-red-700">HabTrack</div>
      <div className="space-x-6 hidden md:flex text-red-700 font-medium">
        <a href="#about" className="hover:underline">About</a>
        <a href="#contact" className="hover:underline">Contact Us</a>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-red-700 hover:text-red-900 transition"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <a
          href="/login"
          className="bg-red-700 text-white px-4 py-2 rounded-md shadow hover:bg-red-800 transition"
        >
          Inizia Ora
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    gsap.to(titleRef.current, {
      duration: 2,
      text: "Trasforma la tua dedizione in abitudini vincenti",
      ease: "power1.inOut",
    });
    gsap.to(subtitleRef.current, {
      delay: 2,
      duration: 2,
      text:
        "Crea, modifica e monitora le tue abitudini con feedback motivazionali e un calendario intuitivo.",
      ease: "power1.inOut",
    });
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 bg-white">
      <h1
        ref={titleRef}
        className="text-4xl md:text-6xl font-extrabold text-red-700 min-h-[3rem]"
      ></h1>
      <p
        ref={subtitleRef}
        className="mt-6 max-w-xl text-lg md:text-xl text-gray-700 min-h-[3rem]"
      ></p>
    </section>
  );
}

function DemoGallery() {
const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if(containerRef.current) {

      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 40,
        stagger: 0.3,
        duration: 1,
        ease: "power2.out",
      });

    }
  }, []);

  return (
    <section className="py-16 bg-gray-50 px-6 flex justify-center gap-8 flex-wrap max-w-6xl mx-auto">
      {screenshots.map((src, i) => (
        <div
          key={i}
          className="shadow-lg rounded-lg overflow-hidden w-64 h-480 md:h-96 bg-white"
        >
          <Image
            src={src}
            alt={`Screenshot app ${i + 1}`}
            width={256}
            height={384}
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </section>
  );
}

function Features() {
  return (
    <section
      id="about"
      className="max-w-4xl mx-auto py-16 px-6 text-gray-800 space-y-12"
    >
      <h2 className="text-3xl font-semibold text-red-700 text-center mb-8">
        Funzionalità Principali
      </h2>

      <article className="space-y-4">
        <h3 className="text-xl font-bold">Gestione abitudini</h3>
        <p>
          Crea, modifica ed elimina abitudini personalizzando i giorni di
          ripetizione per adattarle al tuo stile di vita.
        </p>
      </article>

      <article className="space-y-4">
        <h3 className="text-xl font-bold">Tracciamento e feedback</h3>
        <p>
          Monitora i tuoi progressi quotidiani e ricevi messaggi motivazionali
          sia in caso di successo che di mancato completamento.
        </p>
      </article>

      <article className="space-y-4">
        <h3 className="text-xl font-bold">Calendario storico</h3>
        <p>
          Visualizza lo storico delle tue abitudini con un calendario colorato:
          rosso indica nessuna abitudine completata, giallo alcune, verde tutte
          completate. Ogni giorno mostra un elenco delle abitudini da completare.
        </p>
      </article>
    </section>
  );
}

export default function Home() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <main className="pt-20 bg-white dark:bg-slate-900 transition-colors duration-500">
        <Hero />
        <DemoGallery />
        <Features />
        {/* Footer da aggiungere */}
      </main>
    </>
  );
}
