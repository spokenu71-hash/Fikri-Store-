import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Truck, ShieldCheck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/products";
import "./SceneControls.css";

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
  const [isScenePaused, setScenePaused] = useState(false);
  const stageRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;

    const syncPlayback = () => {
      window.clearInterval(timer);
      if (!motionPreference.matches && !isScenePaused && !document.hidden) {
        timer = window.setInterval(() => {
          setScene((current) => (current + 1) % SCENES.length);
        }, 4600);
      }
    };

    syncPlayback();
    motionPreference.addEventListener?.("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      window.clearInterval(timer);
      motionPreference.removeEventListener?.("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, [isScenePaused]);
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
    <section id="hero" className="fs-hero fs-laptop-hero relative pt-24 sm:pt-28 pb-5 sm:pb-16 overflow-hidden">
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
          <div
            className="fs-laptop-stage-wrap"
            onPointerEnter={() => setScenePaused(true)}
            onPointerLeave={() => setScenePaused(false)}
            onFocusCapture={() => setScenePaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setScenePaused(false);
            }}
          >
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
                          {index === 0 && <svg viewBox="0 0 760 270" role="img" aria-label="Dashboard workspace dengan grafik performa, proyek, dan aktivitas" preserveAspectRatio="xMidYMid slice">
                            <defs>
                              <linearGradient id="dashBg" x2="1" y2="1"><stop stopColor="#263b2b"/><stop offset="1" stopColor="#09130f"/></linearGradient>
                              <linearGradient id="dashCard" x2="0" y2="1"><stop stopColor="#304a35"/><stop offset="1" stopColor="#17271d"/></linearGradient>
                              <linearGradient id="dashLine" x2="1"><stop stopColor="#d4ff00"/><stop offset="1" stopColor="#55d6a0"/></linearGradient>
                              <filter id="dashGlow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                            </defs>
                            <rect width="760" height="270" rx="16" fill="url(#dashBg)"/>
                            <circle cx="650" cy="40" r="110" fill="#b9ff00" opacity=".055"/><circle cx="650" cy="40" r="70" fill="#b9ff00" opacity=".035"/>
                            <rect x="14" y="14" width="76" height="242" rx="11" fill="#101d16" stroke="#d4ff00" strokeOpacity=".14"/>
                            <rect x="27" y="28" width="49" height="39" rx="10" fill="#d4ff00"/><path d="M40 49l8-9 8 6 8-11" fill="none" stroke="#142318" strokeWidth="3" strokeLinecap="round"/>
                            <g fill="#829889"><rect x="30" y="88" width="9" height="9" rx="2"/><rect x="30" y="122" width="9" height="9" rx="2"/><rect x="30" y="156" width="9" height="9" rx="2"/><rect x="30" y="190" width="9" height="9" rx="2"/></g>
                            <g fill="#d5e2d5" fontSize="10" fontFamily="Arial,sans-serif"><text x="46" y="97">Home</text><text x="46" y="131">Tasks</text><text x="46" y="165">Team</text><text x="46" y="199">Files</text></g>
                            <text x="112" y="34" fill="#caff59" fontSize="10" fontWeight="700" letterSpacing="2">YOUR WORKSPACE  /  OVERVIEW</text>
                            <text x="112" y="65" fill="#f5f8ef" fontSize="25" fontWeight="700">Make today count.</text>
                            <text x="112" y="84" fill="#9caf9e" fontSize="11">A clear view of everything moving forward.</text>
                            <rect x="112" y="103" width="185" height="67" rx="10" fill="url(#dashCard)" stroke="#d4ff00" strokeOpacity=".22"/>
                            <text x="128" y="124" fill="#a6b8a7" fontSize="9" letterSpacing="1">PROJECTS COMPLETED</text><text x="128" y="153" fill="#fff" fontSize="27" fontWeight="700">24</text><text x="174" y="151" fill="#baff43" fontSize="10">↗ 18% this month</text>
                            <rect x="309" y="103" width="185" height="67" rx="10" fill="url(#dashCard)" stroke="#ffffff" strokeOpacity=".1"/>
                            <text x="325" y="124" fill="#a6b8a7" fontSize="9" letterSpacing="1">FOCUS HOURS</text><text x="325" y="153" fill="#fff" fontSize="27" fontWeight="700">32.5</text><text x="398" y="151" fill="#8bd8b1" fontSize="10">This week</text>
                            <rect x="506" y="103" width="238" height="153" rx="10" fill="url(#dashCard)" stroke="#ffffff" strokeOpacity=".1"/>
                            <text x="524" y="125" fill="#f0f6eb" fontSize="11" fontWeight="700">Weekly performance</text><text x="524" y="140" fill="#8fa394" fontSize="8">PRODUCTIVITY SCORE</text>
                            <path d="M525 222H725M525 192H725M525 162H725" stroke="#d8e5d5" strokeOpacity=".1" strokeDasharray="3 5"/>
                            <path d="M528 211 C550 200 559 207 575 183 S605 190 622 169 S653 174 669 157 S700 164 722 145" fill="none" stroke="url(#dashLine)" strokeWidth="4" strokeLinecap="round" filter="url(#dashGlow)"/>
                            <path d="M528 211 C550 200 559 207 575 183 S605 190 622 169 S653 174 669 157 S700 164 722 145V236H528Z" fill="#baff43" opacity=".09"/>
                            <circle cx="722" cy="145" r="5" fill="#d4ff00" stroke="#f4ffd1" strokeWidth="2"/>
                            <rect x="112" y="183" width="382" height="73" rx="10" fill="#14251b" stroke="#ffffff" strokeOpacity=".1"/>
                            <text x="128" y="204" fill="#f2f6ed" fontSize="10" fontWeight="700">Recent activity</text>
                            <circle cx="133" cy="224" r="5" fill="#d4ff00"/><text x="146" y="228" fill="#aebdaf" fontSize="9">Website redesign approved</text>
                            <circle cx="304" cy="224" r="5" fill="#69d5ae"/><text x="317" y="228" fill="#aebdaf" fontSize="9">New task assigned</text>
                            <circle cx="133" cy="243" r="5" fill="#8f9cff"/><text x="146" y="247" fill="#aebdaf" fontSize="9">Weekly report is ready</text>
                          </svg>}
                          {index === 1 && <svg viewBox="0 0 760 270" role="img" aria-label="Ruang belajar digital dengan video pembelajaran, catatan, dan progres materi" preserveAspectRatio="xMidYMid slice">
                            <defs>
                              <linearGradient id="studyBg" x2="1" y2="1"><stop stopColor="#173d4a"/><stop offset="1" stopColor="#101a2b"/></linearGradient>
                              <linearGradient id="studySky" x2="0" y2="1"><stop stopColor="#7dc6dc"/><stop offset=".55" stopColor="#527f9b"/><stop offset="1" stopColor="#243e55"/></linearGradient>
                              <linearGradient id="studyAccent" x2="1"><stop stopColor="#d4ff00"/><stop offset="1" stopColor="#64e2b2"/></linearGradient>
                            </defs>
                            <rect width="760" height="270" rx="16" fill="url(#studyBg)"/>
                            <circle cx="650" cy="24" r="115" fill="#6fd6d2" opacity=".07"/>
                            <text x="24" y="30" fill="#9be3d5" fontSize="10" fontWeight="700" letterSpacing="2">STUDY SPACE  /  LEARNING PATH</text>
                            <text x="24" y="58" fill="#f5fbf8" fontSize="24" fontWeight="700">Learn something great.</text>
                            <text x="24" y="77" fill="#a4c0c4" fontSize="10">Small steps. Big progress.</text>
                            <rect x="24" y="94" width="430" height="151" rx="12" fill="#0e2634" stroke="#8bd9d4" strokeOpacity=".25"/>
                            <rect x="34" y="104" width="410" height="131" rx="8" fill="url(#studySky)"/>
                            <circle cx="362" cy="132" r="27" fill="#fff3cf" opacity=".9"/>
                            <path d="M34 199L114 145L165 177L239 117L315 177L378 139L444 185V235H34Z" fill="#315c70"/>
                            <path d="M34 210L121 175L185 202L259 154L331 198L394 167L444 198V235H34Z" fill="#21475a"/>
                            <path d="M184 177l55-60 35 39-25-8-13 13-13-5-18 21z" fill="#e5f0e9" opacity=".9"/>
                            <path d="M239 117l18 20-16-5-13 8z" fill="#fff"/>
                            <rect x="34" y="214" width="410" height="21" rx="0 0 8 8" fill="#071b27" opacity=".7"/>
                            <circle cx="52" cy="224" r="5" fill="#d4ff00"/><rect x="64" y="221" width="270" height="5" rx="3" fill="#91b0b4" opacity=".45"/><rect x="64" y="221" width="146" height="5" rx="3" fill="url(#studyAccent)"/><text x="390" y="228" fill="#e4f2e8" fontSize="8">08:24 / 24:00</text>
                            <rect x="470" y="94" width="266" height="151" rx="12" fill="#f1f0e7"/>
                            <text x="490" y="119" fill="#24424a" fontSize="10" fontWeight="700" letterSpacing="1">YOUR NOTES</text>
                            <text x="490" y="144" fill="#18343e" fontSize="15" fontWeight="700">Design thinking</text>
                            <text x="490" y="160" fill="#6c8583" fontSize="9">Module 04 · Key takeaways</text>
                            <rect x="490" y="174" width="12" height="12" rx="3" fill="#4d9c7e"/><path d="M493 180l3 3 5-7" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                            <text x="510" y="184" fill="#38565a" fontSize="9">Understand the problem</text>
                            <rect x="490" y="194" width="12" height="12" rx="3" fill="#4d9c7e"/><path d="M493 200l3 3 5-7" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                            <text x="510" y="204" fill="#38565a" fontSize="9">Explore new perspectives</text>
                            <rect x="490" y="216" width="226" height="6" rx="3" fill="#d2ded6"/><rect x="490" y="216" width="154" height="6" rx="3" fill="#4d9c7e"/>
                          </svg>}
                          {index === 2 && <svg viewBox="0 0 760 270" role="img" aria-label="Creative design studio dengan artboard ilustrasi, tools, dan palet warna" preserveAspectRatio="xMidYMid slice">
                            <defs>
                              <linearGradient id="creativeBg" x2="1" y2="1"><stop stopColor="#30253c"/><stop offset="1" stopColor="#111522"/></linearGradient>
                              <linearGradient id="canvasBg" x2="1" y2="1"><stop stopColor="#f4d5a6"/><stop offset=".55" stopColor="#e98b70"/><stop offset="1" stopColor="#8d5a78"/></linearGradient>
                              <linearGradient id="sunset" x2="0" y2="1"><stop stopColor="#ffd77b"/><stop offset="1" stopColor="#ef8c68"/></linearGradient>
                            </defs>
                            <rect width="760" height="270" rx="16" fill="url(#creativeBg)"/>
                            <circle cx="690" cy="35" r="120" fill="#e77ec2" opacity=".07"/>
                            <text x="22" y="30" fill="#e9b8ff" fontSize="10" fontWeight="700" letterSpacing="2">CREATIVE CANVAS  /  ARTBOARD 01</text>
                            <text x="22" y="58" fill="#fff6f1" fontSize="24" fontWeight="700">Make it unmistakably yours.</text>
                            <rect x="22" y="78" width="50" height="166" rx="9" fill="#171824" stroke="#ffffff" strokeOpacity=".12"/>
                            <g fill="#c9bed4"><rect x="40" y="96" width="14" height="14" rx="3"/><circle cx="47" cy="133" r="7"/><path d="M39 158h16v12H39z"/><path d="M39 190l8-8 8 8-8 8z"/><rect x="40" y="215" width="14" height="10" rx="3"/></g>
                            <rect x="86" y="78" width="440" height="166" rx="10" fill="#171824" stroke="#ffffff" strokeOpacity=".12"/>
                            <rect x="97" y="89" width="418" height="144" rx="5" fill="url(#canvasBg)"/>
                            <circle cx="405" cy="130" r="49" fill="url(#sunset)"/>
                            <path d="M97 193L183 127L240 168L321 108L385 169L458 129L515 173V233H97Z" fill="#526e82"/>
                            <path d="M97 207L184 168L243 191L325 145L387 191L460 160L515 191V233H97Z" fill="#34475e"/>
                            <path d="M97 215Q171 181 245 216T390 205T515 211V233H97Z" fill="#23384c"/>
                            <path d="M254 233Q272 185 302 177Q333 171 354 233" fill="#182b3c"/>
                            <path d="M278 196q23-31 48 0" fill="none" stroke="#d4ff00" strokeWidth="4" strokeLinecap="round"/>
                            <circle cx="302" cy="177" r="8" fill="#d4ff00"/>
                            <rect x="540" y="78" width="196" height="166" rx="10" fill="#201d2b" stroke="#ffffff" strokeOpacity=".12"/>
                            <text x="558" y="101" fill="#e7dbea" fontSize="10" fontWeight="700" letterSpacing="1">COLOR STORY</text>
                            <g stroke="#fff" strokeOpacity=".28" strokeWidth="1"><circle cx="575" cy="132" r="12" fill="#f2b66d"/><circle cx="610" cy="132" r="12" fill="#ed8068"/><circle cx="645" cy="132" r="12" fill="#536f85"/><circle cx="680" cy="132" r="12" fill="#d4ff00"/><circle cx="715" cy="132" r="12" fill="#f1e8d7"/></g>
                            <text x="558" y="172" fill="#a99db4" fontSize="8">LAYERS</text>
                            <rect x="558" y="183" width="160" height="17" rx="4" fill="#383244"/><circle cx="569" cy="191" r="3" fill="#d4ff00"/><rect x="580" y="189" width="78" height="4" rx="2" fill="#c8bbd0"/>
                            <rect x="558" y="205" width="160" height="17" rx="4" fill="#302b3c"/><circle cx="569" cy="213" r="3" fill="#e98b70"/><rect x="580" y="211" width="58" height="4" rx="2" fill="#9c91a8"/>
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
            <div className="fs-scene-progress" role="group" aria-label="Pilih tampilan aktivitas laptop">
              {SCENES.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={`Tampilkan ${item.title}`}
                  aria-pressed={scene === index}
                  className={scene === index ? "is-active" : ""}
                  onClick={() => setScene(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">{FEATURES.map((feature)=><div key={feature.label} className="fs-feature-card flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"><div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><feature.icon className="h-5 w-5 text-primary"/></div><span className="text-xs sm:text-sm font-medium">{feature.label}</span></div>)}</div>
      </div>
    </section>
  );
}
