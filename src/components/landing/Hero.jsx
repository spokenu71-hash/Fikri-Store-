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
                        <div className={"fs-screen-visual fs-screen-art fs-screen-art-" + (index + 1)}>
                          {index === 0 && <svg viewBox="0 0 620 190" role="img" aria-label="Dashboard workspace" preserveAspectRatio="xMidYMid meet">
                            <rect width="620" height="190" rx="12" fill="#101b16"/><rect x="12" y="12" width="54" height="166" rx="7" fill="#26382b"/><circle cx="39" cy="31" r="10" fill="#d4ff00"/>
                            <path d="M28 61h22M28 76h22M28 91h22M28 106h22M28 121h22" stroke="#91a18d" strokeWidth="5" strokeLinecap="round"/>
                            <text x="83" y="30" fill="#d4ff00" fontSize="10" fontWeight="700">WORKSPACE OVERVIEW</text><text x="83" y="52" fill="#f3f5ed" fontSize="19" fontWeight="700">Good morning, Fikri</text>
                            <rect x="83" y="67" width="100" height="39" rx="6" fill="#26372b"/><rect x="195" y="67" width="100" height="39" rx="6" fill="#26372b"/><rect x="307" y="67" width="94" height="39" rx="6" fill="#26372b"/>
                            <text x="94" y="82" fill="#aab7a4" fontSize="7">PROJECTS</text><text x="94" y="97" fill="#fff" fontSize="13">12</text><text x="206" y="82" fill="#aab7a4" fontSize="7">TASKS</text><text x="206" y="97" fill="#fff" fontSize="13">08</text><text x="318" y="82" fill="#aab7a4" fontSize="7">PROGRESS</text><text x="318" y="97" fill="#fff" fontSize="13">94%</text>
                            <rect x="83" y="116" width="318" height="62" rx="7" fill="#1c2b21"/><text x="95" y="130" fill="#aab7a4" fontSize="7">WEEKLY ACTIVITY</text>
                            <path d="M100 165l25 -15 25 8 25 -23 25 11 25 -27 25 13 25 -31 25 15 25 -22 25 10" fill="none" stroke="#d4ff00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="413" y="67" width="194" height="111" rx="7" fill="#26372b"/><text x="427" y="84" fill="#fff" fontSize="9">UP NEXT</text>
                            <path d="M431 101h4m8 0h132M431 119h4m8 0h108M431 137h4m8 0h125M431 155h4m8 0h91" stroke="#91a18d" strokeWidth="5" strokeLinecap="round"/>
                          </svg>}
                          {index === 1 && <svg viewBox="0 0 620 190" role="img" aria-label="Study space with lesson video and notes" preserveAspectRatio="xMidYMid meet">
                            <rect width="620" height="190" rx="12" fill="#10232c"/><text x="18" y="25" fill="#8bd4df" fontSize="10" fontWeight="700">STUDY SPACE / COURSE 04</text>
                            <rect x="18" y="39" width="330" height="137" rx="9" fill="#245064"/><rect x="30" y="51" width="306" height="113" rx="6" fill="#183847"/>
                            <path d="M30 133L95 91L145 119L208 67L270 105L336 78V164H30Z" fill="#2c7180"/><circle cx="184" cy="105" r="23" fill="#d4ff00"/><path d="M178 92l19 13-19 13z" fill="#19343b"/>
                            <text x="368" y="49" fill="#fff" fontSize="13" fontWeight="700">Catatan kuliah</text><text x="368" y="64" fill="#91b4b7" fontSize="8">MODUL 04 · 24 MENIT</text>
                            <rect x="365" y="76" width="242" height="100" rx="8" fill="#f0eee4"/><rect x="381" y="91" width="118" height="7" rx="3" fill="#2b515c"/>
                            <path d="M381 108h205M381 120h205M381 132h173M381 144h193M381 156h142" stroke="#aebdb8" strokeWidth="4" strokeLinecap="round"/>
                            <rect x="529" y="89" width="61" height="72" rx="5" fill="#dfc18a"/><path d="M539 104h41M539 114h35M539 124h38M539 134h27" stroke="#8c704d" strokeWidth="3" strokeLinecap="round"/>
                          </svg>}
                          {index === 2 && <svg viewBox="0 0 620 190" role="img" aria-label="Creative design canvas and color palette" preserveAspectRatio="xMidYMid meet">
                            <rect width="620" height="190" rx="12" fill="#211e2b"/><rect x="13" y="13" width="594" height="164" rx="8" fill="#302b3a"/><rect x="24" y="24" width="38" height="142" rx="5" fill="#201d28"/>
                            <path d="M36 38h14M36 58h14M36 78h14M36 98h14M36 118h14M36 138h14" stroke="#91899d" strokeWidth="7" strokeLinecap="round"/><text x="79" y="42" fill="#d8d1e2" fontSize="9" fontWeight="700">CREATIVE CANVAS / ARTBOARD 01</text>
                            <rect x="80" y="53" width="390" height="103" rx="5" fill="#eee8dc"/><rect x="94" y="65" width="362" height="79" rx="3" fill="#e8d5b6"/>
                            <path d="M94 132L164 78L223 119L294 68L367 120L456 82V144H94Z" fill="#526f7b"/><circle cx="353" cy="91" r="25" fill="#e77e5f"/><path d="M94 125Q169 91 232 134T366 126T456 119V144H94Z" fill="#d5a45d"/>
                            <path d="M244 144Q269 98 295 106Q323 113 333 144" fill="#313c48"/><circle cx="282" cy="101" r="12" fill="#d4ff00"/>
                            <rect x="481" y="53" width="111" height="103" rx="6" fill="#24212d"/><text x="494" y="69" fill="#c9c2d2" fontSize="8">COLOR PALETTE</text>
                            <circle cx="503" cy="91" r="7" fill="#e77e5f"/><circle cx="520" cy="91" r="7" fill="#d4ff00"/><circle cx="537" cy="91" r="7" fill="#526f7b"/><circle cx="554" cy="91" r="7" fill="#d5a45d"/><circle cx="571" cy="91" r="7" fill="#eee8dc"/>
                            <rect x="494" y="112" width="82" height="5" rx="2" fill="#6f6879"/><rect x="494" y="124" width="62" height="5" rx="2" fill="#6f6879"/>
                          </svg>}
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
