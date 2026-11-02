import React, { useEffect, useRef } from "react";
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
  const pageRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const updateProgress = () => {
      if (!progressRef.current) return;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      progressRef.current.style.transform = `scaleX(${progress})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    let observer = null;
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reduceMotion && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("fs-is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -48px 0px",
        }
      );

      const motionTargets = page.querySelectorAll(
        "main > section:not(#hero), main > section .grid > *, main > section .space-y-3 > *"
      );

      motionTargets.forEach((element, index) => {
        element.classList.add("fs-motion-pending");
        element.style.setProperty(
          "--fs-motion-delay",
          `${Math.min(index % 5, 4) * 65}ms`
        );
        observer.observe(element);
      });
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="fs-experience relative min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      <div className="fs-scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

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
