import { useEffect, useRef } from "react"
import ALAN_PHOTO from "../assets/alan_photo.js"

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.lp *, .lp *::before, .lp *::after { box-sizing:border-box; margin:0; padding:0; }
.lp {
  --navy:#0C162A; --navy-mid:#0F1D37; --navy-lite:#162440;
  --gold:#CEA14F; --gold-lt:#EBE1B3; --gold-dim:rgba(206,161,79,.18);
  --silver:#D2D3D5; --white:#FFFFFF; --muted:#8a9bb8; --border:#dde2ec;
  font-family:'DM Sans',system-ui,sans-serif;
  background:var(--navy); color:var(--white);
  overflow-x:hidden; -webkit-font-smoothing:antialiased;
}
.lp::before {
  content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
  opacity:.028;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
@keyframes lp-fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes lp-fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes lp-shimmer  { 0%,100%{opacity:.6} 50%{opacity:1} }
@keyframes lp-pulseGold{0%,100%{box-shadow:0 0 0 0 rgba(206,161,79,.5)}60%{box-shadow:0 0 0 14px rgba(206,161,79,0)}}
@keyframes lp-notifSlide{from{opacity:0;transform:translateX(120%)}to{opacity:1;transform:translateX(0)}}
@keyframes lp-notifOut  {from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(120%)}}
@keyframes lp-ticker    {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes lp-rotateRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes lp-barGrow   {from{width:0}to{width:var(--w)}}

.lp .reveal{opacity:0;transform:translateY(32px);transition:opacity .7s ease,transform .7s ease}
.lp .reveal.visible{opacity:1;transform:translateY(0)}

/* HEADER */
.lp-header{
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 48px;
  background:rgba(12,22,42,.9);backdrop-filter:blur(16px);
  border-bottom:1px solid rgba(206,161,79,.15);
  animation:lp-fadeIn .6s ease forwards;
}
.lp-logo-wrap{display:flex;align-items:center;gap:14px}
.lp-logo-name{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--white);letter-spacing:.02em}
.lp-logo-sub{font-size:9px;color:var(--gold);text-transform:uppercase;letter-spacing:.18em;font-weight:600}
.lp-header-cta{
  background:linear-gradient(135deg,var(--gold),var(--gold-lt));
  color:var(--navy);border:none;border-radius:50px;
  padding:11px 28px;font-size:13px;font-weight:700;
  cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.04em;
  transition:all .2s;box-shadow:0 4px 20px rgba(206,161,79,.3);
}
.lp-header-cta:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(206,161,79,.45)}

/* TICKER */
.lp-ticker-wrap{
  background:linear-gradient(90deg,var(--navy-mid),var(--navy-lite),var(--navy-mid));
  border-bottom:1px solid rgba(206,161,79,.12);
  overflow:hidden;height:36px;display:flex;align-items:center;
  margin-top:69px;
}
.lp-ticker-track{display:flex;animation:lp-ticker 28s linear infinite;white-space:nowrap}
.lp-ticker-item{display:inline-flex;align-items:center;gap:8px;padding:0 32px;font-size:11px;color:var(--muted);font-weight:500;letter-spacing:.05em}
.lp-ticker-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);flex-shrink:0}

/* HERO */
.lp-hero{
  position:relative;min-height:92vh;
  display:flex;align-items:center;justify-content:center;
  padding:80px 24px 60px;overflow:hidden;
}
.lp-hero::before{
  content:'';position:absolute;width:700px;height:700px;
  background:radial-gradient(ellipse,rgba(206,161,79,.09) 0%,transparent 70%);
  top:-100px;left:50%;transform:translateX(-50%);pointer-events:none;
}
.lp-hero::after{
  content:'';position:absolute;width:1px;height:60%;
  background:linear-gradient(to bottom,transparent,rgba(206,161,79,.3),transparent);
  right:15%;top:20%;pointer-events:none;
}
.lp-hero-inner{position:relative;z-index:2;max-width:780px;margin:0 auto;text-align:center}
.lp-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(206,161,79,.1);border:1px solid rgba(206,161,79,.3);
  border-radius:50px;padding:7px 18px;margin-bottom:28px;
  font-size:11px;font-weight:700;color:var(--gold-lt);
  letter-spacing:.1em;text-transform:uppercase;
  animation:lp-fadeUp .6s .1s ease both;
}
.lp-hero-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(38px,7vw,72px);font-weight:700;line-height:1.08;
  color:var(--white);letter-spacing:-.02em;margin-bottom:22px;
  animation:lp-fadeUp .7s .2s ease both;
}
.lp-hero-title em{font-style:italic;color:var(--gold)}
.lp-hero-sub{
  font-size:clamp(15px,2.2vw,19px);color:var(--muted);
  line-height:1.75;max-width:560px;margin:0 auto 36px;
  animation:lp-fadeUp .7s .35s ease both;
}
.lp-hero-sub strong{color:var(--silver);font-weight:600}
.lp-cta-wrap{animation:lp-fadeUp .7s .5s ease both}
.lp-cta-primary{
  display:inline-flex;align-items:center;gap:10px;
  background:linear-gradient(135deg,var(--gold),var(--gold-lt));
  color:var(--navy);border:none;border-radius:50px;
  padding:18px 44px;font-size:16px;font-weight:800;
  cursor:pointer;font-family:'DM Sans',sans-serif;letter-spacing:.03em;
  animation:lp-pulseGold 2.5s 1.5s infinite;
  transition:transform .2s,box-shadow .2s;
  box-shadow:0 8px 32px rgba(206,161,79,.4);
}
.lp-cta-primary:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(206,161,79,.55)}
.lp-cta-primary .arrow{font-size:20px;transition:transform .2s}
.lp-cta-primary:hover .arrow{transform:translateX(4px)}
.lp-cta-note{margin-top:14px;font-size:12px;color:var(--muted);display:flex;justify-content:center;gap:20px;flex-wrap:wrap}
.lp-cta-note span::before{content:'✓ ';color:var(--gold);font-weight:700}
.lp-hero-trust{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:52px;animation:lp-fadeUp .7s .7s ease both}
.lp-trust-badge{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 16px;font-size:12px;color:var(--silver);font-weight:500}
.lp-trust-badge .icon{font-size:18px}

/* NOTIFICATION */
.lp-notif-container{position:fixed;bottom:28px;left:28px;z-index:90;pointer-events:none}
.lp-notif{
  display:flex;align-items:center;gap:10px;
  background:rgba(15,29,55,.96);border:1px solid rgba(206,161,79,.3);
  border-radius:12px;padding:10px 16px;
  font-size:12px;color:var(--silver);
  box-shadow:0 8px 32px rgba(0,0,0,.4);
  max-width:260px;width:260px;
  animation:lp-notifSlide .5s ease forwards;
}
.lp-notif.hide{animation:lp-notifOut .4s ease forwards}
.lp-notif-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0;box-shadow:0 0 6px #4ade80}
.lp-notif strong{color:var(--white);font-weight:700}

/* NUMBERS */
.lp-numbers{
  background:linear-gradient(135deg,rgba(206,161,79,.06),transparent);
  border-top:1px solid rgba(206,161,79,.12);border-bottom:1px solid rgba(206,161,79,.12);
  padding:60px 24px;
}
.lp-numbers-inner{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.lp-num-card{text-align:center;padding:28px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:16px}
.lp-num-card .n{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,52px);font-weight:700;background:linear-gradient(135deg,var(--gold),var(--gold-lt));-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.1;margin-bottom:8px}
.lp-num-card .lbl{font-size:12px;color:var(--muted);font-weight:500;letter-spacing:.05em;text-transform:uppercase}

/* STEPS */
.lp-how{padding:100px 24px;background:var(--navy)}
.lp-section-label{text-align:center;font-size:11px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.2em;margin-bottom:16px}
.lp-section-title{text-align:center;font-family:'Cormorant Garamond',serif;font-size:clamp(32px,5vw,52px);font-weight:700;color:var(--white);line-height:1.15;letter-spacing:-.02em;margin-bottom:60px}
.lp-section-title em{font-style:italic;color:var(--gold)}
.lp-steps-grid{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.lp-step-card{position:relative;padding:32px 28px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:20px;overflow:hidden;transition:border-color .3s,transform .3s}
.lp-step-card:hover{border-color:rgba(206,161,79,.4);transform:translateY(-4px)}
.lp-step-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .3s}
.lp-step-card:hover::before{opacity:1}
.lp-step-num{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-lt));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--navy);margin-bottom:20px}
.lp-step-icon{font-size:28px;margin-bottom:12px}
.lp-step-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--white);margin-bottom:10px}
.lp-step-desc{font-size:14px;color:var(--muted);line-height:1.7}

/* FOR WHOM */
.lp-forwhom{padding:100px 24px;background:linear-gradient(180deg,var(--navy-mid) 0%,var(--navy) 100%)}
.lp-profiles-grid{max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-profile-card{padding:28px 24px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:18px;transition:all .3s}
.lp-profile-card:hover{background:rgba(206,161,79,.05);border-color:rgba(206,161,79,.3)}
.lp-profile-emoji{font-size:36px;margin-bottom:14px}
.lp-profile-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--white);margin-bottom:8px}
.lp-profile-desc{font-size:13px;color:var(--muted);line-height:1.7}
.lp-profile-tag{display:inline-block;margin-top:14px;background:var(--gold-dim);border:1px solid rgba(206,161,79,.3);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;color:var(--gold-lt);letter-spacing:.05em}

/* COMPARISON */
.lp-comparison{padding:100px 24px;background:var(--navy)}
.lp-comparison-inner{max-width:820px;margin:0 auto}
.lp-comparison-title{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,4vw,42px);font-weight:700;color:var(--white);margin-bottom:8px;line-height:1.2}
.lp-comparison-sub{font-size:15px;color:var(--muted);margin-bottom:48px;line-height:1.65}
.lp-comparison-sub strong{color:var(--gold-lt)}
.lp-bars-list{display:flex;flex-direction:column;gap:18px;margin-bottom:40px}
.lp-bar-label{display:flex;justify-content:space-between;margin-bottom:6px}
.lp-bar-label .name{font-size:13px;color:var(--silver);font-weight:500}
.lp-bar-label .val{font-size:13px;color:var(--gold);font-weight:700;font-family:'Cormorant Garamond',serif}
.lp-bar-track{height:10px;background:rgba(255,255,255,.06);border-radius:10px;overflow:hidden}
.lp-bar-fill{height:100%;border-radius:10px;background:linear-gradient(90deg,var(--gold),var(--gold-lt));width:0;transition:width 1.2s cubic-bezier(.4,0,.2,1)}
.lp-bar-fill.animate{width:var(--w)}
.lp-callout-box{background:linear-gradient(135deg,rgba(206,161,79,.1),rgba(235,225,179,.04));border:1.5px solid rgba(206,161,79,.3);border-radius:16px;padding:28px 32px;display:flex;gap:20px;align-items:flex-start}
.lp-callout-icon{font-size:28px;flex-shrink:0}
.lp-callout-text{font-size:14px;color:var(--muted);line-height:1.75}
.lp-callout-text strong{color:var(--gold-lt)}

/* TESTIMONIALS */
.lp-testimonials{padding:100px 24px;background:var(--navy-mid)}
.lp-testi-grid{max-width:960px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-testi-card{padding:28px 24px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:18px;position:relative}
.lp-testi-card::before{content:'"';position:absolute;top:16px;left:22px;font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:700;color:rgba(206,161,79,.15);line-height:1;pointer-events:none}
.lp-stars{color:var(--gold);font-size:14px;margin-bottom:14px;letter-spacing:2px}
.lp-testi-text{font-size:14px;color:var(--silver);line-height:1.75;margin-bottom:20px;font-style:italic}
.lp-testi-author{display:flex;align-items:center;gap:10px}
.lp-testi-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--navy-lite),var(--navy-mid));border:2px solid rgba(206,161,79,.3);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.lp-testi-name{font-size:13px;font-weight:700;color:var(--white)}
.lp-testi-detail{font-size:11px;color:var(--muted)}

/* ATTORNEY */
.lp-attorney{padding:100px 24px;background:var(--navy)}
.lp-attorney-inner{max-width:820px;margin:0 auto;display:grid;grid-template-columns:1fr 1.6fr;gap:60px;align-items:center}
.lp-attorney-visual{display:flex;flex-direction:column;align-items:center;gap:20px}
.lp-attorney-ring{width:200px;height:200px;border-radius:50%;position:relative;flex-shrink:0;overflow:hidden}
.lp-attorney-ring::before{content:'';position:absolute;inset:-3px;border-radius:50%;border:2px solid transparent;background:linear-gradient(135deg,var(--gold),var(--gold-lt),transparent,var(--gold)) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:destination-out;animation:lp-rotateRing 6s linear infinite;z-index:2;pointer-events:none}
.lp-attorney-placeholder{width:200px;height:200px;border-radius:50%;background:linear-gradient(145deg,var(--navy-lite),var(--navy-mid));border:2px solid rgba(206,161,79,.2);display:flex;align-items:center;justify-content:center;font-size:72px;overflow:hidden}
.lp-attorney-photo{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.lp-oab-badge{background:var(--gold-dim);border:1px solid rgba(206,161,79,.35);border-radius:50px;padding:8px 18px;font-size:11px;font-weight:700;color:var(--gold-lt);letter-spacing:.1em;text-transform:uppercase}
.lp-attorney-credentials{font-size:12px;color:var(--gold);letter-spacing:.15em;text-transform:uppercase;font-weight:600;margin-bottom:8px}
.lp-attorney-title{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,44px);font-weight:700;color:var(--white);line-height:1.15;margin-bottom:6px}
.lp-attorney-title em{font-style:italic;color:var(--gold)}
.lp-attorney-bio{font-size:14px;color:var(--muted);line-height:1.8;margin-bottom:28px}
.lp-credential-list{display:flex;flex-direction:column;gap:10px}
.lp-credential-item{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--silver)}
.lp-credential-item::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0}

/* URGENCY */
.lp-urgency{padding:80px 24px;background:linear-gradient(135deg,var(--navy-mid),var(--navy-lite));border-top:1px solid rgba(206,161,79,.15);border-bottom:1px solid rgba(206,161,79,.15);text-align:center}
.lp-urgency-title{font-family:'Cormorant Garamond',serif;font-size:clamp(30px,5vw,52px);font-weight:700;color:var(--white);line-height:1.15;letter-spacing:-.02em;margin-bottom:16px}
.lp-urgency-title em{font-style:italic;color:var(--gold)}
.lp-urgency-sub{font-size:16px;color:var(--muted);max-width:520px;margin:0 auto 36px;line-height:1.7}
.lp-urgency-sub strong{color:var(--silver)}

/* FAQ */
.lp-faq{padding:80px 24px;background:var(--navy-mid)}
.lp-faq-inner{max-width:660px;margin:0 auto}
.lp-faq-item{border-bottom:1px solid rgba(255,255,255,.07)}
.lp-faq-q{width:100%;text-align:left;padding:20px 0;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:15px;font-weight:600;color:var(--white);font-family:'DM Sans',sans-serif}
.lp-faq-q .icon{font-size:20px;transition:transform .3s;flex-shrink:0;color:var(--gold)}
.lp-faq-q.open .icon{transform:rotate(45deg)}
.lp-faq-a{font-size:14px;color:var(--muted);line-height:1.8;max-height:0;overflow:hidden;transition:max-height .4s ease,padding .3s}
.lp-faq-a.open{max-height:400px;padding-bottom:20px}

/* FINAL CTA */
.lp-final-cta{padding:120px 24px;background:var(--navy);text-align:center;position:relative;overflow:hidden}
.lp-final-cta::before{content:'';position:absolute;width:800px;height:800px;background:radial-gradient(ellipse,rgba(206,161,79,.07) 0%,transparent 65%);bottom:-200px;left:50%;transform:translateX(-50%);pointer-events:none}
.lp-final-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,6vw,64px);font-weight:700;color:var(--white);line-height:1.1;letter-spacing:-.03em;margin-bottom:18px;position:relative;z-index:1}
.lp-final-title em{color:var(--gold);font-style:italic}
.lp-final-sub{font-size:17px;color:var(--muted);max-width:480px;margin:0 auto 40px;line-height:1.75;position:relative;z-index:1}

/* FOOTER */
.lp-footer{background:rgba(8,14,26,.95);border-top:1px solid rgba(206,161,79,.12);padding:40px 24px 32px;text-align:center}
.lp-footer-text{font-size:12px;color:var(--muted);line-height:1.8}
.lp-footer-text a{color:var(--gold);text-decoration:none}
.lp-footer-divider{border:none;border-top:1px solid rgba(255,255,255,.06);margin:20px auto;max-width:400px}

@media(max-width:768px){
  .lp-header{padding:14px 20px}
  .lp-numbers-inner{grid-template-columns:repeat(2,1fr)}
  .lp-steps-grid,.lp-profiles-grid,.lp-testi-grid{grid-template-columns:1fr}
  .lp-attorney-inner{grid-template-columns:1fr;text-align:center}
  .lp-attorney-visual{margin:0 auto}
  .lp-credential-item{justify-content:center}
  .lp-hero{padding:100px 20px 60px}
  .lp-notif-container{display:none}
  .lp-cta-note{gap:10px}
}
@media(max-width:480px){
  .lp-header-cta{display:none}
  .lp-numbers-inner{grid-template-columns:1fr 1fr}
}
`

const LOGO_SVG = (
  <svg width="36" height="28" viewBox="0 0 80 60" fill="none">
    <defs>
      <linearGradient id="lplg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#CEA14F"/>
        <stop offset="100%" stopColor="#EBE1B3"/>
      </linearGradient>
    </defs>
    <path d="M4 56L4 8L40 44L76 8L76 56" stroke="url(#lplg)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 56L16 24L40 48L64 24L64 56" stroke="url(#lplg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".55"/>
  </svg>
)

const TICKERS = [
  "Simulação 100% gratuita","Baseado no Código Civil Brasileiro",
  "Resultado em menos de 3 minutos","Desenvolvida pelo Adv. Alan Mac Dowell",
  "OAB/GO 4573 · Sociedade Individual de Advocacia","Patrimônio protegido com assessoria especializada",
]

const NOTIFS = [
  { name:"Carlos M.",   city:"Goiânia",   msg:"acabou de descobrir sua meação" },
  { name:"Patrícia S.", city:"Anápolis",  msg:"simulou partilha de R$ 680 mil" },
  { name:"Roberto A.",  city:"Brasília",  msg:"recebeu o relatório em PDF" },
  { name:"Juliana F.",  city:"Goiânia",   msg:"calculou a pensão alimentícia" },
  { name:"Marcos L.",   city:"Aparecida", msg:"iniciou a simulação gratuita" },
  { name:"Ana C.",      city:"Goiânia",   msg:"falou com o Dr. Alan" },
]

export default function LandingPage({ onStart }) {
  const notifRef = useRef(null)
  const notifIdx = useRef(0)

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".lp .reveal")
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Bar chart animation
  useEffect(() => {
    const section = document.getElementById("lp-bars")
    if (!section) return
    const barIO = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => document.querySelectorAll(".lp-bar-fill").forEach(b => b.classList.add("animate")), 200)
        barIO.unobserve(section)
      }
    }, { threshold: 0.3 })
    barIO.observe(section)
    return () => barIO.disconnect()
  }, [])

  // Social proof notifications
  useEffect(() => {
    const showNotif = () => {
      const container = notifRef.current
      if (!container) return
      const n = NOTIFS[notifIdx.current % NOTIFS.length]
      notifIdx.current++
      const el = document.createElement("div")
      el.className = "lp-notif"
      el.innerHTML = `<div class="lp-notif-dot"></div><div><strong>${n.name}</strong> de ${n.city}<br><span style="opacity:.8">${n.msg}</span></div>`
      container.appendChild(el)
      setTimeout(() => {
        el.classList.add("hide")
        setTimeout(() => el.remove(), 500)
      }, 4200)
    }
    const t1 = setTimeout(() => { showNotif(); }, 4000)
    const t2 = setInterval(showNotif, 7000)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [])

  const toggleFaq = (e) => {
    const btn = e.currentTarget
    const answer = btn.nextElementSibling
    const isOpen = answer.classList.contains("open")
    document.querySelectorAll(".lp-faq-a").forEach(a => a.classList.remove("open"))
    document.querySelectorAll(".lp-faq-q").forEach(q => q.classList.remove("open"))
    if (!isOpen) { answer.classList.add("open"); btn.classList.add("open") }
  }

  const faqs = [
    ["A simulação tem valor jurídico?","Não. A simulação é uma ferramenta educativa baseada em critérios gerais do Código Civil. Ela não substitui uma consulta jurídica formal. Porém, ela te dá uma base sólida para entender sua posição antes de negociar ou contratar um advogado."],
    ["O que acontece com meus dados após a simulação?","Ao concluir a simulação, seus dados de contato (nome, telefone e e-mail) são recebidos pelo escritório Alan Mac Dowell Velloso para que nossa equipe possa entrar em contato e oferecer o assessoramento jurídico adequado ao seu caso. As informações patrimoniais da simulação ficam armazenadas apenas no seu dispositivo."],
    ["Funciona para qualquer regime de bens?","Sim. O simulador contempla os três regimes mais comuns no Brasil: Comunhão Parcial de Bens (o padrão), Comunhão Universal de Bens e Separação Total de Bens. Cada regime tem regras específicas de cálculo aplicadas automaticamente."],
    ["E se eu tiver empresa? É possível simular?","Sim. O simulador tem uma categoria específica para empresas e cotas societárias. A partilha de negócios envolve regras específicas dependendo do regime e de quando a empresa foi constituída — todos esses fatores são considerados no cálculo."],
  ]

  return (
    <div className="lp">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="lp-header">
        <div className="lp-logo-wrap">
          {LOGO_SVG}
          <div>
            <div className="lp-logo-name">Alan Mac Dowell Velloso</div>
            <div className="lp-logo-sub">Divórcio Transparente · OAB/GO 4573</div>
          </div>
        </div>
        <button className="lp-header-cta" onClick={onStart}>Simulação Gratuita →</button>
      </header>

      {/* TICKER */}
      <div className="lp-ticker-wrap">
        <div className="lp-ticker-track">
          {[...TICKERS,...TICKERS].map((t,i) => (
            <span key={i} className="lp-ticker-item">
              <span className="lp-ticker-dot"/>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-badge">⚖️ &nbsp;Ferramenta Jurídica Profissional · Valor Consultivo</div>
          <h1 className="lp-hero-title">
            Tire todas as suas dúvidas sobre<br/>
            <em>divórcio, pensão</em><br/>
            <em>e bens compartilhados</em>
          </h1>
          <p className="lp-hero-sub">
            Toda a simulação é baseada no <strong>Código Civil Brasileiro</strong> e desenvolvida pelo <strong>Adv. Alan Mac Dowell</strong> — entenda seus direitos antes de tomar qualquer decisão.
          </p>
          <div className="lp-cta-wrap">
            <button className="lp-cta-primary" onClick={onStart}>
              Iniciar minha simulação gratuita
              <span className="arrow">→</span>
            </button>
            <div className="lp-cta-note">
              <span>Gratuito</span>
              <span>Sem cadastro prévio</span>
              <span>Resultado imediato</span>
              <span>100% confidencial</span>
            </div>
          </div>
          <div className="lp-hero-trust">
            {[["⚖️","Código Civil Brasileiro"],["📄","Relatório em PDF"],["🎯","Patrimônio alto? Somos especialistas"],["👨‍⚖️","Desenvolvida pelo Adv. Alan Mac Dowell"]].map(([icon,txt]) => (
              <div key={txt} className="lp-trust-badge"><span className="icon">{icon}</span>{txt}</div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="lp-numbers reveal">
        <div className="lp-numbers-inner">
          {[["1.847+","Simulações realizadas"],["3 min","Tempo médio de preenchimento"],["R$ 2,4M","Patrimônio médio simulado"],["98%","Clientes satisfeitos com a análise"]].map(([n,l]) => (
            <div key={l} className="lp-num-card"><div className="n">{n}</div><div className="lbl">{l}</div></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how reveal">
        <div className="lp-section-label">Como funciona</div>
        <h2 className="lp-section-title">3 passos. <em>Clareza total.</em></h2>
        <div className="lp-steps-grid">
          {[
            ["📋","1","Informe seus bens","Imóveis, veículos, investimentos, FGTS e empresas. Nossa IA identifica automaticamente o que é partilhável no seu regime."],
            ["⚖️","2","Calcule a pensão","Use o estimador de renda com IA — basta informar a profissão. Calculamos pelo critério do Binômio, como o juiz faria."],
            ["📊","3","Receba seu relatório","Um PDF completo com a identidade do escritório é gerado automaticamente. O Dr. Alan recebe e entra em contato para validar."],
          ].map(([icon,num,title,desc]) => (
            <div key={num} className="lp-step-card">
              <div className="lp-step-icon">{icon}</div>
              <div className="lp-step-num">{num}</div>
              <div className="lp-step-title">{title}</div>
              <div className="lp-step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="lp-forwhom reveal">
        <div className="lp-section-label">Para quem é</div>
        <h2 className="lp-section-title">Feito para quem tem <em>patrimônio a proteger</em></h2>
        <div className="lp-profiles-grid">
          {[
            ["🏢","Empresários e sócios","Cotas de empresa entram na partilha? Depende do regime. Nossa simulação calcula o impacto exato no seu negócio.","Empresa · Sociedade"],
            ["🏠","Proprietários de imóveis","Múltiplos imóveis, financiados ou herdados? Calculamos com precisão a proporção paga durante a união.","Imóveis · FGTS · Financiamentos"],
            ["📈","Investidores e profissionais","Carteira de investimentos, previdência privada e pró-labore têm regras específicas na partilha. Saiba exatamente sua posição.","Investimentos · Previdência"],
          ].map(([icon,title,desc,tag]) => (
            <div key={title} className="lp-profile-card">
              <div className="lp-profile-emoji">{icon}</div>
              <div className="lp-profile-title">{title}</div>
              <div className="lp-profile-desc">{desc}</div>
              <div className="lp-profile-tag">{tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="lp-comparison reveal">
        <div className="lp-comparison-inner">
          <div className="lp-section-label">Por que isso importa</div>
          <h2 className="lp-comparison-title">O que está em jogo no seu divórcio</h2>
          <p className="lp-comparison-sub">Na maioria dos casos com <strong>patrimônio acima de R$ 500 mil</strong>, a diferença entre um divórcio bem assessorado e um mal conduzido pode ultrapassar <strong>centenas de milhares de reais</strong>.</p>
          <div className="lp-bars-list" id="lp-bars">
            {[
              ["🏠 Imóvel financiado de R$ 600 mil (120 parcelas, 48 pagas na união)","R$ 240.000 partilháveis","40%"],
              ["💼 Cotas de empresa avaliadas em R$ 800 mil (Comunhão Parcial)","R$ 400.000 em risco","66%"],
              ["📈 Investimentos R$ 300 mil (pré e pós casamento misturados)","Até R$ 180.000 disputáveis","60%"],
              ["👶 Pensão mal calculada — diferença acumulada em 10 anos","R$ 96.000+ de diferença","80%"],
            ].map(([name,val,w]) => (
              <div key={name} className="lp-bar-row">
                <div className="lp-bar-label"><span className="name">{name}</span><span className="val">{val}</span></div>
                <div className="lp-bar-track"><div className="lp-bar-fill" style={{"--w":w}}/></div>
              </div>
            ))}
          </div>
          <div className="lp-callout-box">
            <div className="lp-callout-icon">⚠️</div>
            <div className="lp-callout-text"><strong>Sem assessoria adequada, você pode abrir mão do que é seu.</strong> Nossa simulação mostra o cenário real antes de qualquer negociação — para que você chegue à mesa informado.</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-testimonials reveal">
        <div className="lp-section-label">Depoimentos</div>
        <h2 className="lp-section-title">O que dizem nossos <em>clientes</em></h2>
        <div className="lp-testi-grid">
          {[
            ["👨‍💼","Marcos R.","Empresário · Goiânia/GO","Fiz a simulação antes de contratar qualquer advogado. Quando cheguei ao escritório do Dr. Alan já sabia exatamente o que tinha direito. Economizei tempo e protegi R$ 280 mil em bens."],
            ["👩‍⚕️","Carla M.","Médica · Anápolis/GO","Não sabia que o financiamento do apartamento entrava parcialmente na partilha. O simulador me alertou sobre isso e o Dr. Alan garantiu que meus direitos foram respeitados."],
            ["👩‍💼","Fernanda L.","Advogada · Brasília/DF","Processo rápido, claro e sem surpresas. A simulação mostrou um cenário que meu ex-marido nem imaginava existir. O relatório foi essencial nas negociações."],
          ].map(([avatar,name,detail,text]) => (
            <div key={name} className="lp-testi-card">
              <div className="lp-stars">★★★★★</div>
              <p className="lp-testi-text">"{text}"</p>
              <div className="lp-testi-author">
                <div className="lp-testi-avatar">{avatar}</div>
                <div><div className="lp-testi-name">{name}</div><div className="lp-testi-detail">{detail}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ATTORNEY */}
      <section className="lp-attorney reveal">
        <div className="lp-attorney-inner">
          <div className="lp-attorney-visual">
            <div className="lp-attorney-ring">
                <img src={ALAN_PHOTO} alt="Dr. Alan Mac Dowell Velloso" className="lp-attorney-photo" />
            </div>
            <div className="lp-oab-badge">OAB/GO 4573</div>
          </div>
          <div>
            <div className="lp-attorney-credentials">Dr. Alan Mac Dowell Velloso</div>
            <h2 className="lp-attorney-title">Especialista em <em>Direito de Família e Sucessões</em></h2>
            <p className="lp-attorney-bio">Com anos de atuação em casos de alta complexidade patrimonial, o Dr. Alan combina rigor jurídico com tecnologia para garantir que seus clientes nunca cheguem despreparados a uma negociação ou audiência.</p>
            <div className="lp-credential-list">
              {["Especialista em Direito de Família e Sucessões","Sociedade Individual de Advocacia · Goiânia/GO"].map(c => (
                <div key={c} className="lp-credential-item">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* URGENCY */}
      <section className="lp-urgency reveal">
        <h2 className="lp-urgency-title">Cada dia sem informação<br/><em>é um dia jogando contra você</em></h2>
        <p className="lp-urgency-sub">Decisões tomadas sem conhecer seus direitos podem ser <strong>irreversíveis</strong>. A simulação leva 3 minutos e é completamente gratuita.</p>
        <button className="lp-cta-primary" onClick={onStart}>
          Quero conhecer meus direitos agora <span className="arrow">→</span>
        </button>
      </section>

      {/* FAQ */}
      <section className="lp-faq reveal">
        <div className="lp-faq-inner">
          <div className="lp-section-label" style={{textAlign:"center"}}>Perguntas frequentes</div>
          <h2 className="lp-section-title" style={{marginBottom:40}}>Dúvidas <em>comuns</em></h2>
          {faqs.map(([q,a]) => (
            <div key={q} className="lp-faq-item">
              <button className="lp-faq-q" onClick={toggleFaq}>{q}<span className="icon">+</span></button>
              <div className="lp-faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final-cta reveal">
        <h2 className="lp-final-title">Entenda o que é seu.<br/><em>Antes que seja tarde.</em></h2>
        <p className="lp-final-sub">Simulação gratuita, resultado imediato, relatório em PDF. O Dr. Alan analisa pessoalmente e entra em contato.</p>
        <button className="lp-cta-primary" onClick={onStart}>
          Iniciar simulação gratuita agora <span className="arrow">→</span>
        </button>
        <div className="lp-cta-note" style={{marginTop:16}}>
          <span>Gratuito</span><span>3 minutos</span><span>Confidencial</span><span>Relatório PDF</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>{LOGO_SVG}</div>
        <p className="lp-footer-text">
          <strong style={{color:"#D2D3D5"}}>Alan Mac Dowell Velloso</strong> · Sociedade Individual de Advocacia · OAB/GO 4573<br/>
          Goiânia · Goiás · Brasil<br/>
          <a href="https://wa.me/5562996349626">(62) 99634-9626</a>
        </p>
        <hr className="lp-footer-divider"/>
        <p className="lp-footer-text" style={{fontSize:11,color:"#3a5070"}}>
          © {new Date().getFullYear()} Alan Mac Dowell Velloso. Este site é uma ferramenta educativa e não constitui consultoria jurídica. Todos os direitos reservados.
        </p>
      </footer>

      {/* Social proof notifications */}
      <div className="lp-notif-container" ref={notifRef}/>
    </div>
  )
}
