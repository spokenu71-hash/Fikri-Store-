import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Products from "@/components/landing/Products";
import UseCases from "@/components/landing/UseCases";
import ValueProps from "@/components/landing/ValueProps";
import Story from "@/components/landing/Story";
import FAQ from "@/components/landing/FAQ";
import ClosingCTA from "@/components/landing/ClosingCTA";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import MobileBottomCTA from "@/components/landing/MobileBottomCTA";
import Reveal from "@/components/ui/reveal";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Reveal as="div" className="fs-section-reveal"><Hero /></Reveal>
        <Reveal as="div" className="fs-section-reveal"><Products /></Reveal>
        <Reveal as="div" className="fs-section-reveal"><UseCases /></Reveal>
        <Reveal as="div" className="fs-section-reveal"><ValueProps /></Reveal>
        <Reveal as="div" className="fs-section-reveal"><Story /></Reveal>
        <Reveal as="div" className="fs-section-reveal"><FAQ /></Reveal>
        <Reveal as="div" className="fs-section-reveal"><ClosingCTA /></Reveal>
      </main>
      <Footer />

      <FloatingWhatsApp />
      <MobileBottomCTA />
    </div>
  );
}
