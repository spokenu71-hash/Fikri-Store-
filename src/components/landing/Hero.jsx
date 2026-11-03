import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Truck, ShieldCheck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/products";

const SCENES = [
  { label: "WORKSPACE", title: "Ruang kerja", detail: "Fokus pada hal penting." },
  { label: "STUDY MODE", title: "Belajar lebih leluasa", detail: "Materi, catatan, dan ide." },
  { label: "CREATIVE DESK", title: "Karya dimulai di sini", detail: "Dari konsep sampai jadi." },
];
const FEATURES = [
  { icon: CheckCircle2, label: "Unit dicek sebelum dikirim" },
  { icon: Truck, label: "Pengiriman seluruh Indonesia" },
  { icon: WhatsAppIcon, label: "Konsultasi via WhatsApp" },
];

export default function Hero() {
  const [scene, setScene] = useState(0);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  useEffect(() => {
    const timer = window.setInterval(() => setScene((current) => (current + 1) % SCENES.length), 4600);
    return () => window.clearInterval(timer);
  }, []);
  function handlePointerMove(event) {
    if (!stageRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      stageRef.current?.style.setProperty("--tilt-x", (y * -7).toFixed(2) + "deg");
      stageRef.current?.style.setProperty("--tilt-y", (x * 10).toFixed(2) + "deg");
    });
  }
  function resetPointer() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    stageRef.current?.style.setProperty("--tilt-x", "0deg");
    stageRef.current?.style.setProperty("--tilt-y", "0deg");
  }
  const waLink = buildWhatsAppLink("Halo Fikri Store, saya sedang mencari laptop. Bisa bantu rekomendasikan unit sesuai kebutuhan dan budget saya?");
  return (
    <section id="hero" className="fs-hero fs-laptop-hero relative pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      <div className="fs-laptop-hero-glow" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="fs-laptop-copy">
            <span className="fs-laptop-kicker"><span className="fs-live-dot" /> LAPTOP PILIHAN FIKRI STORE</span>
            <h1 className="mt-5 font-heading text-[2rem] sm:text-[2.35rem] lg:text-[2.8rem] font-bold tracking-[-0.02em] leading-[1.16]">Temukan laptop yang pas untuk <span className="text-primary">aktivitasmu.</span></h1>
            <p className="mt-5 text-[15px] sm:text-base text-muted-foreground leading-[1.7] max-w-lg">Untuk kuliah, kerja, dan berkarya. Lihat pilihan laptop yang tersedia atau konsultasikan kebutuhanmu bersama Fikri Store.</p>
            <div className="fs-hero-actions">
              <a href="#produk" className="fs-hero-button mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground min-h-[46px]">Lihat Laptop <ArrowRight className="h-4 w-4" /></a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="fs-secondary-button mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold min-h-[46px]"><WhatsAppIcon className="h-4 w-4" /> Konsultasi</a>
            </div>
            <div className="fs-laptop-trust"><span><ShieldCheck className="h-4 w-4 text-primary" /> Unit diperiksa</span><span><WhatsAppIcon className="h-4 w-4 text-primary" /> Tanya langsung</span></div>
          </div>
          <div className="fs-laptop-stage-wrap">
            <div ref={stageRef} className="fs-laptop-stage" onPointerMove={handlePointerMove} onPointerLeave={resetPointer} onPointerCancel={resetPointer}>
              <div className="fs-stage-light" aria-hidden="true" /><div className="fs-laptop-shadow" aria-hidden="true" />
              <div className="fs-laptop-device">
                <div className="fs-laptop-lid">
                  <div className="fs-laptop-screen">
                    <div className="fs-screen-topbar"><span /><span /><span /><i>FIKRI / DESK</i></div>
                    <div className="fs-screen-content">
                      {SCENES.map((item, index) => <div key={item.label} className={"fs-screen-scene " + (scene === index ? "is-active" : "")} aria-hidden={scene !== index}>
                        <div className="fs-screen-eyebrow">{item.label}</div><div className="fs-screen-heading">{item.title}</div><div className="fs-screen-detail">{item.detail}</div>
                        <div className={"fs-screen-layout fs-screen-layout-" + (index + 1)}>
                          <div className="fs-screen-main-panel"><div className="fs-screen-panel-line wide" /><div className="fs-screen-panel-line" /><div className="fs-screen-bars"><i /><i /><i /><i /><i /></div></div>
                          <div className="fs-screen-side-panel"><span /><span /><span /></div>
                        </div>
                      </div>)}
                    </div>
                    <div className="fs-screen-bottom"><span>● SYSTEM READY</span><span>01 — 03</span></div>
                  </div>
                </div>
                <div className="fs-laptop-base">
                  <div className="fs-laptop-keyboard">{[0,1,2,3].map((row) => <div className="fs-key-row" key={row}>{Array.from({length:row===3?9:13}).map((_,key)=><i key={key}/>)}</div>)}</div>
                  <div className="fs-laptop-trackpad" /><div className="fs-laptop-notch" />
                </div>
              </div>
              <div className="fs-stage-caption"><span className="fs-live-dot" /> {SCENES[scene].label}</div><div className="fs-stage-index">0{scene+1}<span> / 03</span></div>
            </div>
            <div className="fs-scene-progress" aria-label={"Tampilan animasi " + (scene+1) + " dari 3"}>{SCENES.map((item,index)=><span key={item.label} className={scene===index?"is-active":""}/>)}</div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">{FEATURES.map((feature)=><div key={feature.label} className="fs-feature-card flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"><div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><feature.icon className="h-5 w-5 text-primary"/></div><span className="text-xs sm:text-sm font-medium">{feature.label}</span></div>)}</div>
      </div>
    </section>
  );
}
