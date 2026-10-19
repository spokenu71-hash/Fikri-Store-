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

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <UseCases />
        <ValueProps />
        <Story />
        <FAQ />
        <ClosingCTA />
      </main>
      <Footer />

      <FloatingWhatsApp />
      <MobileBottomCTA />
    </div>
  );
}