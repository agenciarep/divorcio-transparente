import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Google Fonts ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f0f2f5; }

    .fade-in { animation: fadeIn 0.4s ease forwards; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

    .slide-up { animation: slideUp 0.35s ease forwards; }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

    .pulse-gold { animation: pulseGold 2s ease-in-out infinite; }
    @keyframes pulseGold {
      0%,100% { box-shadow: 0 0 0 0 rgba(206,161,79,0.4); }
      50%      { box-shadow: 0 0 0 8px rgba(206,161,79,0); }
    }

    .ai-typing span {
      display: inline-block;
      animation: blink 1.2s infinite;
    }
    .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
    .ai-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%,80%,100% { opacity:0.2; } 40% { opacity:1; } }

    input:focus, select:focus, textarea:focus {
      outline: none !important;
      border-color: #CEA14F !important;
      box-shadow: 0 0 0 3px rgba(206,161,79,0.15) !important;
    }

    button:active { transform: scale(0.97); }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #f0f2f5; }
    ::-webkit-scrollbar-thumb { background: #CEA14F; border-radius: 4px; }
  `}</style>
);

/* ─── Utils ─────────────────────────────────────────────────────────────────── */
const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v || 0);
const parseCur = (v) => Number(String(v).replace(/\D/g, "")) / 100;
const uid = () => Math.random().toString(36).substr(2, 9);

/* ─── Cores ─────────────────────────────────────────────────────────────────── */
const C = {
  navy:    "#0C162A",
  navyMid: "#0F1D37",
  gold:    "#CEA14F",
  goldLight:"#EBE1B3",
  silver:  "#D2D3D5",
  white:   "#FFFFFF",
  bg:      "#F4F5F8",
  bgCard:  "#FFFFFF",
  text:    "#1a2340",
  textSub: "#5a6b8a",
  textMuted:"#8a9bb8",
  border:  "#dde2ec",
  red:     "#e53e3e",
  redBg:   "#fff5f5",
  green:   "#25D366",
};

/* ─── AI Guide Messages per step ────────────────────────────────────────────── */
const AI_GUIDE = {
  0: [
    "Olá! Eu sou o assistente jurídico do Dr. Alan. 👋",
    "Vou te guiar em cada etapa desta simulação de partilha de bens.",
    "Tudo que você preencher fica apenas no seu dispositivo — nenhuma informação vai para servidores externos.",
    "Quando estiver pronto, clique em **Iniciar Simulação**.",
  ],
  1: [
    "Agora preciso entender o **regime de bens** do seu casamento.",
    "Essa informação está na sua **certidão de casamento**.",
    "Se você casou após 1977 e não assinou nenhum pacto no cartório, o regime automático é a **Comunhão Parcial**.",
    "Selecione uma das opções abaixo e avançaremos automaticamente. ✅",
  ],
  2: [
    "Ótimo! Agora vamos listar os **bens do casal**.",
    "Adicione todos os bens: imóveis, veículos, investimentos, FGTS, empresas...",
    "Para cada bem, informe se foi adquirido durante o casamento — isso é essencial para o cálculo correto.",
    "Se algum bem for financiado, terei campos extras para calcular a proporção paga na união. 📋",
  ],
  3: [
    "Agora vamos registrar as **dívidas do casal**.",
    "Inclua financiamentos, empréstimos e outros passivos que existiam durante a união.",
    "As dívidas serão descontadas do patrimônio líquido no resultado final.",
    "Não tem dívidas? Sem problema — clique em **Próximo** para continuar. ➡️",
  ],
  4: [
    "Esta etapa calcula a **pensão alimentícia** usando o critério do Binômio.",
    "Na aba **Necessidades**, liste todos os gastos mensais dos filhos (escola, saúde, lazer...).",
    "Na aba **Rendas**, informe a renda de quem paga e de quem receberá a pensão.",
    "O cálculo é automático e respeitará o limite de 30% da renda do pagador. ⚖️",
  ],
  5: [
    "Aqui está o **resultado completo** da sua simulação! 🎉",
    "O gráfico mostra a divisão estimada do patrimônio entre você e o cônjuge.",
    "Lembre-se: este é um cenário estimado. Um advogado pode identificar bens ocultos e garantir seus direitos.",
    "Clique em **Falar com Dr. Alan** para receber uma análise personalizada via WhatsApp. 💬",
  ],
};

/* ─── AI Bubble Component ───────────────────────────────────────────────────── */
function AIGuide({ step }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [visible, setVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const msgs = AI_GUIDE[step] || [];

  useEffect(() => {
    setMsgIdx(0);
    setTyping(true);
    setVisible(true);
    setMinimized(false);
  }, [step]);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), 900);
    return () => clearTimeout(t);
  }, [typing, msgIdx]);

  const next = () => {
    if (msgIdx < msgs.length - 1) {
      setMsgIdx(i => i + 1);
      setTyping(true);
    } else {
      setMinimized(true);
    }
  };

  if (!visible) return null;

  return (
    <div className="fade-in" style={{ marginBottom: 24 }}>
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: C.navyMid, border: `1px solid ${C.gold}`,
            borderRadius: 50, padding: "8px 16px", cursor: "pointer",
            color: C.goldLight, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span style={{ fontSize: 16 }}>🤖</span>
          Ver dica do assistente
        </button>
      ) : (
        <div style={{
          background: C.navyMid,
          border: `1px solid rgba(206,161,79,0.35)`,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 4px 20px rgba(12,22,42,0.18)",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px",
            background: "linear-gradient(90deg, #0C162A, #0F1D37)",
            borderBottom: "1px solid rgba(206,161,79,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #CEA14F, #EBE1B3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>🤖</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.goldLight, fontFamily: "'DM Sans', sans-serif" }}>
                  Assistente Jurídico
                </div>
                <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                  Alan Mac Dowell Velloso · OAB/GO 4573
                </div>
              </div>
              <div style={{
                marginLeft: 4, width: 8, height: 8, borderRadius: "50%",
                background: "#4ade80", boxShadow: "0 0 6px #4ade80",
              }} />
            </div>
            <button onClick={() => setMinimized(true)} style={{
              background: "none", border: "none", color: C.textMuted,
              cursor: "pointer", fontSize: 18, lineHeight: 1,
            }}>−</button>
          </div>

          {/* Message */}
          <div style={{ padding: "16px 20px 14px" }}>
            {typing ? (
              <div className="ai-typing" style={{ display: "flex", gap: 4, alignItems: "center", height: 22 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold, display: "inline-block" }} />
              </div>
            ) : (
              <p className="fade-in" style={{
                fontSize: 14, lineHeight: 1.75, color: "#c8d4e8",
                fontFamily: "'DM Sans', sans-serif",
              }}
                dangerouslySetInnerHTML={{
                  __html: msgs[msgIdx]?.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.goldLight}">$1</strong>`) || ""
                }}
              />
            )}
          </div>

          {/* Progress + Button */}
          <div style={{
            padding: "10px 20px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", gap: 5 }}>
              {msgs.map((_, i) => (
                <div key={i} style={{
                  width: i === msgIdx ? 18 : 6, height: 6, borderRadius: 3,
                  background: i === msgIdx ? C.gold : "rgba(206,161,79,0.25)",
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
            {!typing && (
              <button onClick={next} style={{
                background: msgIdx < msgs.length - 1
                  ? "rgba(206,161,79,0.15)"
                  : "linear-gradient(135deg, #CEA14F, #EBE1B3)",
                border: `1px solid ${C.gold}`,
                borderRadius: 8, padding: "6px 16px",
                color: msgIdx < msgs.length - 1 ? C.goldLight : C.navy,
                fontWeight: 700, fontSize: 12, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {msgIdx < msgs.length - 1 ? "Próxima dica →" : "Entendi ✓"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Logo SVG ──────────────────────────────────────────────────────────────── */
const Logo = ({ size = 36, darkBg = true }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 80 60" fill="none">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#CEA14F" />
        <stop offset="100%" stopColor="#EBE1B3" />
      </linearGradient>
    </defs>
    <path d="M4 56 L4 8 L40 44 L76 8 L76 56" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M16 56 L16 24 L40 48 L64 24 L64 56" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55" />
  </svg>
);

/* ─── Progress Steps ────────────────────────────────────────────────────────── */
const STEP_LABELS = ["Início", "Regime", "Bens", "Dívidas", "Pensão", "Seus Dados", "Resultado"];

function ProgressSteps({ step, labels }) {
  const lbls = labels || STEP_LABELS;
  return (
    <div style={{ padding: "12px 0 0" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {lbls.map((lbl, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < lbls.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: i < step
                  ? "linear-gradient(135deg,#CEA14F,#EBE1B3)"
                  : i === step ? C.navyMid : "#e8eaf0",
                border: i === step ? `2px solid ${C.gold}` : "2px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800,
                color: i < step ? C.navy : i === step ? C.gold : C.textMuted,
                transition: "all 0.4s",
                boxShadow: i === step ? `0 0 0 4px rgba(206,161,79,0.15)` : "none",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 9, marginTop: 3, fontWeight: i === step ? 700 : 400,
                color: i === step ? C.gold : i < step ? C.textSub : C.textMuted,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
              }}>
                {lbl}
              </span>
            </div>
            {i < lbls.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "-12px 4px 0",
                background: i < step
                  ? "linear-gradient(90deg,#CEA14F,#EBE1B3)"
                  : "#e8eaf0",
                transition: "background 0.4s",
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared UI ─────────────────────────────────────────────────────────────── */
const Label = ({ children }) => (
  <label style={{
    display: "block", fontSize: 12, fontWeight: 600, color: C.textSub,
    letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
  }}>{children}</label>
);

const Field = ({ label, note, children }) => (
  <div style={{ marginBottom: 18 }}>
    {label && <Label>{label}</Label>}
    {children}
    {note && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>{note}</p>}
  </div>
);

const inputStyle = {
  width: "100%", padding: "13px 16px",
  background: C.white, border: `1.5px solid ${C.border}`,
  borderRadius: 10, color: C.text, fontSize: 15,
  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
};

const TextInput = ({ value, onChange, onBlur, placeholder, type = "text" }) => (
  <input
    type={type} value={value} onChange={onChange} onBlur={onBlur}
    placeholder={placeholder}
    style={inputStyle}
  />
);

const PrimaryBtn = ({ children, onClick, disabled, full }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? "#e8eaf0" : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
    color: disabled ? C.textMuted : C.navy,
    border: "none", borderRadius: 12, padding: "14px 32px",
    fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    width: full ? "100%" : "auto",
    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
    boxShadow: disabled ? "none" : "0 4px 16px rgba(206,161,79,0.35)",
    transition: "all 0.2s",
  }}>
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    background: "none", border: `1.5px solid ${C.border}`,
    borderRadius: 12, padding: "13px 24px",
    fontSize: 14, color: C.textSub, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    transition: "all 0.2s",
  }}>
    {children}
  </button>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.bgCard, border: `1.5px solid ${C.border}`,
    borderRadius: 16, padding: 24, marginBottom: 16,
    boxShadow: "0 2px 12px rgba(12,22,42,0.06)",
    ...style,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 26, fontWeight: 700, color: C.navy,
      marginBottom: 6, letterSpacing: "-0.01em",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      {icon && <span style={{ fontSize: 24 }}>{icon}</span>}{title}
    </h2>
    {sub && <p style={{ fontSize: 14, color: C.textSub, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>{sub}</p>}
  </div>
);

/* ─── Tooltip Glossary ──────────────────────────────────────────────────────── */
const GLOSSARY = {
  "Meação": "A metade do patrimônio comum. É o direito que cada cônjuge tem sobre os bens adquiridos durante a união.",
  "Binômio": "Necessidade de quem recebe × Possibilidade de quem paga. Critério legal para fixar a pensão.",
  "Patrimônio Líquido": "Valor real dos bens após descontar as dívidas.",
  "Bens Partilháveis": "Bens que entram na divisão — geralmente os adquiridos onerosamente durante a união.",
};
const GT = ({ term, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ borderBottom: `1.5px dashed ${C.gold}`, color: C.gold, cursor: "help", fontWeight: 600 }}>
        {children || term}
      </span>
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: 0,
          background: C.navy, border: `1px solid ${C.gold}`,
          borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#c8d4e8",
          width: 230, zIndex: 100, lineHeight: 1.6,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <strong style={{ color: C.goldLight }}>{term}:</strong> {GLOSSARY[term]}
        </span>
      )}
    </span>
  );
};

/* ─── Pie Chart ─────────────────────────────────────────────────────────────── */
const PieChart = ({ me, spouse }) => {
  const total = me + spouse;
  if (total === 0) return (
    <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
      Adicione bens para visualizar a partilha
    </div>
  );
  const pct = (me / total) * 100;
  const r = 64, cx = 80, cy = 80, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <defs>
          <linearGradient id="pieG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#CEA14F" /><stop offset="100%" stopColor="#EBE1B3" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e8eaf0" strokeWidth={22} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#pieG)" strokeWidth={22}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
        <circle cx={cx} cy={cy} r={46} fill="white" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={C.gold} fontSize={22} fontWeight={800} fontFamily="'DM Sans', sans-serif">{pct.toFixed(0)}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={C.textSub} fontSize={10} fontFamily="'DM Sans', sans-serif">sua parte</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 150 }}>
        <div style={{ padding: "14px 16px", background: "linear-gradient(135deg,rgba(206,161,79,0.08),rgba(235,225,179,0.04))", border: `1.5px solid rgba(206,161,79,0.25)`, borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>Sua Parte Estimada</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, fontFamily: "'Playfair Display', serif", marginTop: 4 }}>{fmt(me)}</div>
        </div>
        <div style={{ padding: "14px 16px", background: "#f8f9fc", border: `1.5px solid ${C.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 11, color: C.textSub, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>Parte do Cônjuge</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, fontFamily: "'Playfair Display', serif", marginTop: 4 }}>{fmt(spouse)}</div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   STEPS
══════════════════════════════════════════════════════════════════════════════ */

/* ── Step 0: Welcome ─────────────────────────────────────────────────────────── */
function WelcomeStep({ onNext, updateState }) {
  return (
    <div className="fade-in">
      <AIGuide step={0} />

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 88, height: 88, borderRadius: "50%", margin: "0 auto 20px",
          background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 32px rgba(12,22,42,0.25), 0 0 0 6px rgba(206,161,79,0.12)`,
        }}>
          <span style={{ fontSize: 42 }}>⚖️</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 30, fontWeight: 800, color: C.navy,
          marginBottom: 10, letterSpacing: "-0.02em",
        }}>
          Simulador de Partilha
        </h1>
        <p style={{ fontSize: 15, color: C.textSub, maxWidth: 380, margin: "0 auto", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
          Entenda seus direitos antes de tomar decisões importantes — visual, claro e baseado no Código Civil Brasileiro.
        </p>
      </div>

      <Card style={{ borderLeft: `4px solid ${C.gold}` }}>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🛡️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Aviso Legal
            </div>
            <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
              Esta ferramenta é uma <strong style={{ color: C.navy }}>simulação educativa</strong>. Os resultados são estimativas e não substituem a consulta com um advogado especializado. Cada caso tem particularidades.
            </p>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <PrimaryBtn onClick={() => { updateState({ termsAccepted: true }); onNext(); }}>
          ⚖️ &nbsp; Iniciar Simulação Gratuita
        </PrimaryBtn>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
          <span>🔒 Dados só no seu dispositivo</span>
          <span>✓ 100% gratuito</span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Regime ──────────────────────────────────────────────────────────── */
const REGIMES = [
  { id: "PARCIAL", icon: "⚖️", label: "Comunhão Parcial de Bens", sub: "O padrão no Brasil — divide somente o que foi conquistado durante a união." },
  { id: "UNIVERSAL", icon: "🤝", label: "Comunhão Universal de Bens", sub: "Tudo é de ambos — inclusive bens anteriores ao casamento." },
  { id: "SEPARACAO", icon: "🔒", label: "Separação Total de Bens", sub: "O que é meu é meu, o que é seu é seu. Nada se comunica." },
];

function RegimeStep({ state, updateState, onNext, onBack }) {
  return (
    <div className="fade-in">
      <AIGuide step={1} />
      <SectionTitle icon="📋" title="Regime de Bens" sub="Selecione o regime do seu casamento. Geralmente está na certidão de casamento." />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {REGIMES.map(r => {
          const sel = state.regime === r.id;
          return (
            <button key={r.id} onClick={() => { updateState({ regime: r.id }); setTimeout(onNext, 220); }}
              style={{
                background: sel ? `linear-gradient(135deg, rgba(206,161,79,0.06), rgba(235,225,179,0.02))` : C.white,
                border: `2px solid ${sel ? C.gold : C.border}`,
                borderRadius: 14, padding: "18px 20px",
                textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 16,
                transition: "all 0.2s",
                boxShadow: sel ? `0 4px 20px rgba(206,161,79,0.15)` : "0 1px 4px rgba(12,22,42,0.06)",
              }}>
              <span style={{ fontSize: 30 }}>{r.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: sel ? C.gold : C.navy, fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: C.textSub, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{r.sub}</div>
              </div>
              {sel && <span style={{ color: C.gold, fontSize: 22, marginLeft: "auto" }}>✓</span>}
            </button>
          );
        })}
      </div>

      <div style={{ background: "#fffbf0", border: `1.5px solid rgba(206,161,79,0.3)`, borderRadius: 12, padding: "14px 16px", fontSize: 13, color: C.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
        💡 <strong>Dica:</strong> Se casaram após 1977 sem assinar pacto no cartório → <GT term="Bens Partilháveis">Comunhão Parcial</GT>
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        <GhostBtn onClick={onBack}>← Voltar e corrigir</GhostBtn>
      </div>
    </div>
  );
}

/* ── Step 2: Assets ──────────────────────────────────────────────────────────── */
const ASSET_TYPES = [
  { id: "REAL_ESTATE", label: "Imóvel", icon: "🏠" },
  { id: "VEHICLE", label: "Veículo", icon: "🚗" },
  { id: "INVESTMENT", label: "Investimento", icon: "📈" },
  { id: "FGTS", label: "FGTS", icon: "🏦" },
  { id: "COMPANY", label: "Empresa", icon: "💼" },
  { id: "OTHER", label: "Outro", icon: "💎" },
];

function AssetsStep({ state, updateState, onNext, onBack }) {
  const [asset, setAsset] = useState({ type: "REAL_ESTATE", name: "", value: 0, acquiredDuringMarriage: true, isInheritanceOrDonation: false, isFinanced: false, totalInstallments: 0, paidInstallmentsDuringMarriage: 0, ownerIfSeparate: "ME" });
  const [inputVal, setInputVal] = useState("");

  const add = () => {
    if (!asset.name || !asset.value) return;
    updateState({ assets: [...state.assets, { ...asset, id: uid() }] });
    setAsset({ type: "REAL_ESTATE", name: "", value: 0, acquiredDuringMarriage: true, isInheritanceOrDonation: false, isFinanced: false, totalInstallments: 0, paidInstallmentsDuringMarriage: 0, ownerIfSeparate: "ME" });
    setInputVal("");
  };

  const showOwner = state.regime === "SEPARACAO" ||
    (state.regime === "PARCIAL" && !asset.acquiredDuringMarriage) ||
    (state.regime === "PARCIAL" && asset.isInheritanceOrDonation);

  return (
    <div className="fade-in">
      <AIGuide step={2} />
      <SectionTitle icon="🏠" title="Inventário de Bens" sub="Adicione todos os bens para um cálculo preciso da partilha." />

      <Card>
        {/* Tipo */}
        <Field label="Tipo de Bem">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {ASSET_TYPES.map(t => (
              <button key={t.id} onClick={() => setAsset({ ...asset, type: t.id })}
                style={{
                  padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${asset.type === t.id ? C.gold : C.border}`,
                  background: asset.type === t.id ? "rgba(206,161,79,0.07)" : C.white,
                  color: asset.type === t.id ? C.gold : C.textSub,
                  fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Nome / Descrição">
          <TextInput value={asset.name} onChange={e => setAsset({ ...asset, name: e.target.value })} placeholder="Ex: Apartamento Centro, Gol 2020..." />
        </Field>

        <Field label={asset.type === "FGTS" ? "Saldo acumulado na união" : "Valor de Mercado Atual"}>
          <TextInput value={inputVal}
            onChange={e => { setInputVal(e.target.value); setAsset({ ...asset, value: parseCur(e.target.value) }); }}
            onBlur={() => setInputVal(fmt(asset.value))} placeholder="R$ 0,00" />
        </Field>

        {asset.type !== "FGTS" && (
          <div style={{ background: "#f8f9fc", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
            {state.regime === "PARCIAL" && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>Adquirido <strong>durante</strong> a união?</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Sim", "Não"].map((v, i) => (
                    <button key={v} onClick={() => setAsset({ ...asset, acquiredDuringMarriage: i === 0 })}
                      style={{ padding: "6px 18px", borderRadius: 8, border: `1.5px solid ${asset.acquiredDuringMarriage === (i === 0) ? C.gold : C.border}`, background: asset.acquiredDuringMarriage === (i === 0) ? "rgba(206,161,79,0.1)" : C.white, color: C.text, fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {state.regime === "PARCIAL" && asset.acquiredDuringMarriage && (
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.text, cursor: "pointer", marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>
                <input type="checkbox" checked={asset.isInheritanceOrDonation} onChange={e => setAsset({ ...asset, isInheritanceOrDonation: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: C.gold }} />
                É herança ou doação? (não entra na partilha)
              </label>
            )}

            {(asset.type === "REAL_ESTATE" || asset.type === "VEHICLE") && (
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.text, cursor: "pointer", marginBottom: asset.isFinanced ? 14 : 0, fontFamily: "'DM Sans', sans-serif" }}>
                  <input type="checkbox" checked={asset.isFinanced} onChange={e => setAsset({ ...asset, isFinanced: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: C.gold }} />
                  <strong>Bem financiado?</strong>
                </label>
                {asset.isFinanced && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingLeft: 26 }}>
                    <div>
                      <Label>Total de Parcelas</Label>
                      <input type="number" value={asset.totalInstallments || ""} placeholder="Ex: 360"
                        onChange={e => setAsset({ ...asset, totalInstallments: Number(e.target.value) })}
                        style={{ ...inputStyle, fontSize: 14 }} />
                    </div>
                    <div>
                      <Label>Pagas na União</Label>
                      <input type="number" value={asset.paidInstallmentsDuringMarriage || ""} placeholder="Ex: 60"
                        onChange={e => setAsset({ ...asset, paidInstallmentsDuringMarriage: Number(e.target.value) })}
                        style={{ ...inputStyle, fontSize: 14 }} />
                    </div>
                    <p style={{ gridColumn: "span 2", fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                      *A partilha incide apenas sobre a proporção paga durante o casamento.
                    </p>
                  </div>
                )}
              </div>
            )}

            {showOwner && (
              <div style={{ marginTop: 12 }}>
                <Label>Quem é o proprietário?</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["ME", "Eu (só meu)"], ["SPOUSE", "Cônjuge"]].map(([v, lbl]) => (
                    <button key={v} onClick={() => setAsset({ ...asset, ownerIfSeparate: v })}
                      style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${asset.ownerIfSeparate === v ? C.gold : C.border}`, background: asset.ownerIfSeparate === v ? "rgba(206,161,79,0.08)" : C.white, color: C.text, fontSize: 13, cursor: "pointer", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <PrimaryBtn onClick={add} disabled={!asset.name || !asset.value} full>
          + Adicionar Bem
        </PrimaryBtn>
      </Card>

      {state.assets.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textSub, fontFamily: "'DM Sans', sans-serif", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Bens adicionados ({state.assets.length})
          </div>
          {state.assets.map(a => {
            const t = ASSET_TYPES.find(x => x.id === a.type);
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 8, boxShadow: "0 1px 4px rgba(12,22,42,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{t?.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: "'DM Sans', sans-serif" }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                      {a.isFinanced ? `Financiado · ${a.paidInstallmentsDuringMarriage}/${a.totalInstallments} parcelas` : a.acquiredDuringMarriage ? "Bem comum" : "Bem particular"}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif" }}>{fmt(a.value)}</div>
                  <button onClick={() => updateState({ assets: state.assets.filter(x => x.id !== a.id) })}
                    style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                    ✕ Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {state.assets.length === 0 && (
        <div style={{ textAlign: "center", padding: "28px", border: `2px dashed ${C.border}`, borderRadius: 14, color: C.textMuted, fontSize: 13, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
          Nenhum bem adicionado ainda
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <GhostBtn onClick={onBack}>← Voltar e corrigir</GhostBtn>
        <PrimaryBtn onClick={onNext}>Próximo →</PrimaryBtn>
      </div>
    </div>
  );
}

/* ── Step 3: Debts ───────────────────────────────────────────────────────────── */
function DebtsStep({ state, updateState, onNext, onBack }) {
  const [debt, setDebt] = useState({ name: "", value: 0 });
  const [inputVal, setInputVal] = useState("");
  const noDebts = state.debts.length === 0;

  const add = () => {
    if (!debt.name || !debt.value) return;
    updateState({ debts: [...state.debts, { ...debt, id: uid(), isShared: true }] });
    setDebt({ name: "", value: 0 }); setInputVal("");
  };

  return (
    <div className="fade-in">
      <AIGuide step={3} />
      <SectionTitle icon="💳" title="Dívidas e Passivos" sub="Registre financiamentos e empréstimos do casal. Se não houver dívidas, avance para a próxima etapa." />

      <Card>
        <Field label="Descrição da Dívida">
          <TextInput value={debt.name} onChange={e => setDebt({ ...debt, name: e.target.value })} placeholder="Ex: Financiamento do carro, Empréstimo pessoal..." />
        </Field>
        <Field label="Valor Restante">
          <TextInput value={inputVal}
            onChange={e => { setInputVal(e.target.value); setDebt({ ...debt, value: parseCur(e.target.value) }); }}
            onBlur={() => setInputVal(fmt(debt.value))} placeholder="R$ 0,00" />
        </Field>
        <button onClick={add} disabled={!debt.name || !debt.value} style={{
          width: "100%", padding: "13px", borderRadius: 12,
          border: `1.5px solid ${!debt.name || !debt.value ? C.border : "rgba(229,62,62,0.35)"}`,
          background: !debt.name || !debt.value ? "#f8f9fc" : "rgba(229,62,62,0.05)",
          color: !debt.name || !debt.value ? C.textMuted : C.red,
          cursor: !debt.name || !debt.value ? "not-allowed" : "pointer",
          fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
        }}>
          + Adicionar Dívida
        </button>
      </Card>

      {state.debts.map(d => (
        <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff5f5", border: `1.5px solid rgba(229,62,62,0.2)`, borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>💳</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{d.name}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: C.red, fontWeight: 800, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>-{fmt(d.value)}</div>
            <button onClick={() => updateState({ debts: state.debts.filter(x => x.id !== d.id) })} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 11, fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>✕ Remover</button>
          </div>
        </div>
      ))}

      {/* CTA verde quando não há dívidas */}
      {noDebts && (
        <div className="fade-in" style={{
          background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
          border: "2px solid #86efac",
          borderRadius: 16, padding: "22px 24px", marginBottom: 20,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#166534", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
            Nenhuma dívida — ótimo!
          </div>
          <div style={{ fontSize: 13, color: "#4ade80", color: "#15803d", fontFamily: "'DM Sans', sans-serif", marginBottom: 18, lineHeight: 1.5 }}>
            Se o casal não possui dívidas em comum, você pode avançar direto para a próxima etapa.
          </div>
          <button onClick={onNext} style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff", border: "none", borderRadius: 50,
            padding: "14px 36px", fontSize: 15, fontWeight: 800,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 16px rgba(34,197,94,0.35)",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            Não temos dívidas — Avançar →
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <GhostBtn onClick={onBack}>← Voltar e corrigir</GhostBtn>
        {!noDebts && <PrimaryBtn onClick={onNext}>Próximo →</PrimaryBtn>}
      </div>
    </div>
  );
}

/* ─── Occupation income estimator data ──────────────────────────────────────── */
const OCCUPATIONS = [
  { label: "Selecione a profissão...", value: null },
  { label: "👨‍⚕️ Médico(a)", min: 8000, max: 30000 },
  { label: "⚖️ Advogado(a)", min: 4000, max: 20000 },
  { label: "🦷 Dentista", min: 5000, max: 18000 },
  { label: "🏗️ Engenheiro(a)", min: 5000, max: 18000 },
  { label: "💊 Farmacêutico(a)", min: 3500, max: 8000 },
  { label: "🧑‍💼 Administrador(a)", min: 3000, max: 10000 },
  { label: "📊 Contador(a)", min: 3000, max: 10000 },
  { label: "💻 Analista de TI", min: 4000, max: 15000 },
  { label: "🎓 Professor(a) Universitário", min: 3500, max: 9000 },
  { label: "📚 Professor(a) Básico/Médio", min: 2000, max: 5000 },
  { label: "🚓 Policial / Militar", min: 3000, max: 8000 },
  { label: "🔧 Técnico(a) / Operário(a)", min: 1800, max: 5000 },
  { label: "🛒 Comerciante / Autônomo(a)", min: 1500, max: 8000 },
  { label: "🏪 Servidor(a) Público(a)", min: 2500, max: 12000 },
  { label: "🚗 Motorista / Entregador(a)", min: 1500, max: 4000 },
  { label: "🏠 Doméstico(a) / Diarista", min: 1000, max: 2500 },
  { label: "📱 Influencer / Freelancer", min: 1000, max: 20000 },
  { label: "🌾 Rural / Agricultor(a)", min: 1200, max: 6000 },
  { label: "Outra profissão", min: 1500, max: 5000 },
];

/* ─── Income Estimator Widget ────────────────────────────────────────────────── */
function IncomeEstimator({ label, value, onChange, note }) {
  const [mode, setMode] = useState("manual"); // "manual" | "wizard"
  const [occupation, setOccupation] = useState(null);
  const [workload, setWorkload] = useState("full"); // full | part | extra
  const [inputVal, setInputVal] = useState(value ? fmt(value) : "");
  const [suggested, setSuggested] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  const workloadMultiplier = { full: 1, part: 0.6, extra: 1.4 };

  const calcSuggestion = (occ, wl) => {
    if (!occ) return null;
    const mid = (occ.min + occ.max) / 2;
    return Math.round(mid * workloadMultiplier[wl] / 100) * 100;
  };

  const applyEstimate = () => {
    const val = calcSuggestion(occupation, workload);
    if (!val) return;
    onChange(val);
    setInputVal(fmt(val));
    setSuggested(val);
    setShowWizard(false);
    setMode("manual");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <Label>{label}</Label>
        <button onClick={() => setShowWizard(!showWizard)} style={{
          background: showWizard ? C.navyMid : "rgba(206,161,79,0.1)",
          border: `1px solid ${C.gold}`,
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11, color: showWizard ? C.goldLight : C.gold,
          cursor: "pointer", fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          display: "flex", alignItems: "center", gap: 5,
          transition: "all 0.2s",
        }}>
          🤖 {showWizard ? "Fechar estimativa" : "Estimar pela IA"}
        </button>
      </div>

      {/* Wizard IA */}
      {showWizard && (
        <div className="slide-up" style={{
          background: "linear-gradient(135deg, #0C162A, #0F1D37)",
          border: `1.5px solid rgba(206,161,79,0.3)`,
          borderRadius: 14, padding: "18px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#CEA14F,#EBE1B3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            <div style={{ fontSize: 13, color: "#c8d4e8", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              Me diga a <strong style={{ color: C.goldLight }}>profissão</strong> e a <strong style={{ color: C.goldLight }}>jornada</strong> para eu estimar a renda automaticamente.
            </div>
          </div>

          {/* Profissão */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 5, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Profissão
            </label>
            <select value={occupation?.label || ""}
              onChange={e => {
                const occ = OCCUPATIONS.find(o => o.label === e.target.value) || null;
                setOccupation(occ?.value === null ? null : occ);
              }}
              style={{ ...inputStyle, background: "#0a1628", color: "#fff", border: "1px solid #2a3f5f" }}>
              {OCCUPATIONS.map(o => (
                <option key={o.label} value={o.label}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Jornada */}
          {occupation && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 8, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Jornada de trabalho
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["part", "⏱️", "Meio período"], ["full", "🕐", "Integral"], ["extra", "🚀", "Mais de 1 emprego"]].map(([v, icon, lbl]) => (
                  <button key={v} onClick={() => setWorkload(v)} style={{
                    padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                    border: `1.5px solid ${workload === v ? C.gold : "#2a3f5f"}`,
                    background: workload === v ? "rgba(206,161,79,0.15)" : "rgba(15,29,55,0.5)",
                    color: workload === v ? C.goldLight : "#8aa0bc",
                    fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>{lbl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {occupation && (
            <div style={{ background: "rgba(206,161,79,0.1)", border: "1px solid rgba(206,161,79,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>
                Estimativa para <strong style={{ color: C.goldLight }}>{occupation.label.replace(/^[^\s]+ /, "")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: "#8aa0bc", fontFamily: "'DM Sans', sans-serif" }}>
                  Faixa: {fmt(occupation.min * workloadMultiplier[workload])} – {fmt(occupation.max * workloadMultiplier[workload])}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif" }}>
                  ≈ {fmt(calcSuggestion(occupation, workload))}
                </div>
              </div>
            </div>
          )}

          <button onClick={applyEstimate} disabled={!occupation} style={{
            width: "100%", padding: "12px",
            background: occupation ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : "#1e3050",
            border: "none", borderRadius: 10, color: occupation ? C.navy : "#4a6080",
            fontWeight: 800, fontSize: 14, cursor: occupation ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ✓ Usar esta estimativa
          </button>
        </div>
      )}

      {/* Input manual */}
      <div style={{ position: "relative" }}>
        <TextInput value={inputVal}
          onChange={e => { setInputVal(e.target.value); onChange(parseCur(e.target.value)); setSuggested(null); }}
          onBlur={() => setInputVal(fmt(value))}
          placeholder="R$ 0,00" />
        {suggested && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: C.gold, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, pointerEvents: "none" }}>
            🤖 Estimado
          </div>
        )}
      </div>
      {note && <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>{note}</p>}
    </div>
  );
}

/* ── Step 4: Alimony ─────────────────────────────────────────────────────────── */
function AlimonyStep({ state, updateState, onNext, onBack }) {
  const [tab, setTab] = useState("NEEDS");
  const [expName, setExpName] = useState("");
  const [expVal, setExpVal] = useState(0);
  const [expInput, setExpInput] = useState("");

  const addExp = () => {
    if (!expName || !expVal) return;
    updateState({ alimony: { ...state.alimony, expenses: [...state.alimony.expenses, { id: uid(), category: expName, value: expVal }] } });
    setExpName(""); setExpVal(0); setExpInput("");
  };
  const totalNeed = state.alimony.expenses.reduce((a, c) => a + c.value, 0);
  const totalIncome = (state.alimony.payerIncome || 0) + (state.alimony.receiverIncome || 0);

  // Gastos sugeridos por categoria
  const EXPENSE_SUGGESTIONS = ["🏫 Escola", "🍽️ Alimentação", "🏥 Plano de Saúde", "💊 Medicamentos", "📚 Material Escolar", "👕 Vestuário", "🎮 Lazer", "🚌 Transporte", "🏠 Moradia (proporcional)"];

  return (
    <div className="fade-in">
      <AIGuide step={4} />
      <SectionTitle icon="👶" title="Pensão Alimentícia" sub={<>Baseada no critério do <GT term="Binômio">Binômio</GT>: Necessidade × Possibilidade.</>} />

      {/* Tabs */}
      <div style={{ display: "flex", background: "#f0f2f5", borderRadius: 12, padding: 4, marginBottom: 20 }}>
        {[["NEEDS", "👶 Necessidades dos Filhos"], ["POSS", "💼 Rendas dos Pais"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: "11px", borderRadius: 9, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 13, transition: "all 0.2s",
            fontFamily: "'DM Sans', sans-serif",
            background: tab === id ? C.white : "transparent",
            color: tab === id ? C.navy : C.textSub,
            boxShadow: tab === id ? "0 2px 8px rgba(12,22,42,0.08)" : "none",
          }}>{lbl}</button>
        ))}
      </div>

      {tab === "NEEDS" && (
        <div className="slide-up">
          <div style={{ background: "#fffbf0", border: `1.5px solid rgba(206,161,79,0.2)`, borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: C.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            📌 Liste os gastos mensais com os filhos. Use as sugestões abaixo ou adicione manualmente.
          </div>

          {/* Sugestões rápidas */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Categorias comuns (clique para pré-preencher)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {EXPENSE_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setExpName(s.replace(/^[^\s]+ /, ""))} style={{
                  padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.border}`,
                  background: C.white, color: C.textSub, fontSize: 12,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  transition: "all 0.15s",
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Adicionar gasto */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input placeholder="Categoria (ex: Escola)" value={expName} onChange={e => setExpName(e.target.value)}
              style={{ flex: 1, ...inputStyle, fontSize: 14 }} />
            <input placeholder="R$ 0,00" value={expInput}
              onChange={e => { setExpInput(e.target.value); setExpVal(parseCur(e.target.value)); }}
              onBlur={() => setExpInput(fmt(expVal))}
              style={{ width: 130, ...inputStyle, fontSize: 14 }} />
            <button onClick={addExp} disabled={!expName || !expVal} style={{
              padding: "0 18px", border: "none", borderRadius: 10,
              background: expName && expVal ? `linear-gradient(135deg,${C.gold},${C.goldLight})` : "#e8eaf0",
              color: expName && expVal ? C.navy : C.textMuted,
              fontWeight: 800, cursor: expName && expVal ? "pointer" : "not-allowed",
              fontSize: 20, flexShrink: 0,
            }}>+</button>
          </div>

          {state.alimony.expenses.map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: C.navy, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                <span>👶</span> {e.category}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", fontSize: 15 }}>{fmt(e.value)}</span>
                <button onClick={() => updateState({ alimony: { ...state.alimony, expenses: state.alimony.expenses.filter(x => x.id !== e.id) } })}
                  style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            </div>
          ))}

          {state.alimony.expenses.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", border: `2px dashed ${C.border}`, borderRadius: 12, color: C.textMuted, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              Nenhum gasto adicionado ainda
            </div>
          )}

          {totalNeed > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderTop: `1.5px solid ${C.border}`, marginTop: 10, background: "#f8f9fc", borderRadius: 10 }}>
              <span style={{ fontSize: 13, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>Total de necessidades mensais</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: C.navy, fontFamily: "'Playfair Display', serif" }}>{fmt(totalNeed)}</span>
            </div>
          )}

          {/* Botão para ir para aba de rendas */}
          {totalNeed > 0 && (
            <button onClick={() => setTab("POSS")} style={{
              width: "100%", marginTop: 12, padding: "13px",
              background: `linear-gradient(135deg,${C.gold},${C.goldLight})`,
              border: "none", borderRadius: 12,
              color: C.navy, fontWeight: 800, fontSize: 14,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 12px rgba(206,161,79,0.3)",
            }}>
              Preencher rendas dos pais →
            </button>
          )}
        </div>
      )}

      {tab === "POSS" && (
        <div className="slide-up">
          <div style={{ background: "#fffbf0", border: `1.5px solid rgba(206,161,79,0.2)`, borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontSize: 13, color: C.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            🤖 <strong>Dica:</strong> Se não souber a renda exata, use o botão <strong style={{ color: C.gold }}>"Estimar pela IA"</strong> — basta selecionar a profissão e a jornada de trabalho.
          </div>

          <IncomeEstimator
            label="Renda de quem PAGARÁ a pensão"
            value={state.alimony.payerIncome}
            onChange={v => updateState({ alimony: { ...state.alimony, payerIncome: v } })}
            note="Salário, pró-labore, aluguéis, benefícios, etc."
          />

          <IncomeEstimator
            label="Renda de quem RECEBERÁ (guardião)"
            value={state.alimony.receiverIncome}
            onChange={v => updateState({ alimony: { ...state.alimony, receiverIncome: v } })}
            note="Quem ficará com a guarda dos filhos."
          />

          <div style={{ marginBottom: 20 }}>
            <Label>O pagador tem outros filhos?</Label>
            <select value={state.alimony.payerOtherChildren}
              onChange={e => updateState({ alimony: { ...state.alimony, payerOtherChildren: Number(e.target.value) } })}
              style={{ ...inputStyle }}>
              <option value={0}>Não</option>
              <option value={1}>Sim, 1 filho</option>
              <option value={2}>Sim, 2 filhos</option>
              <option value={3}>Sim, 3 ou mais</option>
            </select>
            <p style={{ fontSize: 11, color: C.textMuted, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>
              Outros filhos podem reduzir a capacidade contributiva do pagador em juízo.
            </p>
          </div>

          {/* Preview em tempo real */}
          {totalNeed > 0 && totalIncome > 0 && (
            <div style={{ background: "linear-gradient(135deg, rgba(206,161,79,0.08), rgba(235,225,179,0.04))", border: `1.5px solid rgba(206,161,79,0.3)`, borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                🤖 Prévia do cálculo
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>
                  Valor estimado da pensão
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif" }}>
                  {fmt(Math.min(totalNeed * (state.alimony.payerIncome / totalIncome), state.alimony.payerIncome * 0.30))}
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 400 }}>/mês</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <GhostBtn onClick={onBack}>← Voltar e corrigir</GhostBtn>
        <PrimaryBtn onClick={onNext}>Ver Resultado Completo →</PrimaryBtn>
      </div>
    </div>
  );
}

/* ── calcDashboardNumbers (shared helper) ────────────────────────────────────── */
function calcDashboardNumbers(state) {
  let totalAssets = 0, me = 0, spouse = 0;
  state.assets.forEach(a => {
    totalAssets += a.value;
    let sv = a.value;
    if (a.isFinanced && a.totalInstallments && a.paidInstallmentsDuringMarriage)
      sv = a.value * (a.paidInstallmentsDuringMarriage / a.totalInstallments);
    if (state.regime === "SEPARACAO") {
      if (a.ownerIfSeparate === "ME") me += a.value;
      else if (a.ownerIfSeparate === "SPOUSE") spouse += a.value;
      else { me += a.value / 2; spouse += a.value / 2; }
    } else if (state.regime === "UNIVERSAL") {
      me += a.value / 2; spouse += a.value / 2;
    } else {
      if (a.type === "FGTS") { me += sv / 2; spouse += sv / 2; }
      else if (a.acquiredDuringMarriage) {
        if (a.isInheritanceOrDonation) { if (a.ownerIfSeparate === "ME") me += a.value; else spouse += a.value; }
        else if (a.isFinanced) {
          const priv = a.value - sv;
          if (a.ownerIfSeparate === "ME") { me += sv / 2 + priv; spouse += sv / 2; }
          else { spouse += sv / 2 + priv; me += sv / 2; }
        } else { me += a.value / 2; spouse += a.value / 2; }
      } else { if (a.ownerIfSeparate === "ME") me += a.value; else spouse += a.value; }
    }
  });
  const totalDebts = state.debts.reduce((a, d) => a + d.value, 0);
  const totalNeeds = state.alimony.expenses.reduce((a, c) => a + c.value, 0);
  const payerIncome = state.alimony.payerIncome || 0;
  const receiverIncome = state.alimony.receiverIncome || 0;
  const totalIncome = payerIncome + receiverIncome;
  let suggestedAlimony = 0;
  if (totalNeeds > 0 && totalIncome > 0)
    suggestedAlimony = Math.min(totalNeeds * (payerIncome / totalIncome), payerIncome * 0.30);
  return { me, spouse, totalAssets, totalDebts, totalNeeds, payerIncome, receiverIncome, totalIncome, suggestedAlimony };
}

/* ══════════════════════════════════════════════════════════════════════════════
   LEAD CAPTURE GATE — Step 5 (injected before dashboard)
══════════════════════════════════════════════════════════════════════════════ */

/* ── Lead Storage (localStorage) ────────────────────────────────────────────── */
const LEADS_KEY = "dt-leads-v1";

function saveLeadToStorage(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
    const idx = existing.findIndex(l => l.phone === lead.phone);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...lead, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift(lead);
    }
    localStorage.setItem(LEADS_KEY, JSON.stringify(existing));
    return true;
  } catch { return false; }
}

function calcLeadScore(state, totalAssets, totalDebts, suggestedAlimony) {
  let score = 0;
  const liquido = totalAssets - totalDebts;
  if (liquido > 500000) score += 40;
  else if (liquido > 200000) score += 30;
  else if (liquido > 50000) score += 20;
  else score += 5;
  if (state.assets.some(a => a.type === "REAL_ESTATE")) score += 15;
  if (state.assets.some(a => a.type === "COMPANY")) score += 15;
  if (state.assets.some(a => a.isFinanced)) score += 8;
  if (suggestedAlimony > 2000) score += 12;
  else if (suggestedAlimony > 500) score += 6;
  if (state.debts.length > 0) score += 5;
  if (state.assets.length >= 4) score += 5;
  return Math.min(score, 100);
}

function scoreLabel(score) {
  if (score >= 75) return { label: "🔥 Quente", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" };
  if (score >= 45) return { label: "⚡ Morno",  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" };
  return                  { label: "❄️ Frio",   color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" };
}

/* ── Step 5: Lead Capture Gate ───────────────────────────────────────────────── */
function LeadCaptureStep({ state, updateState, onNext, onBack }) {
  const [name,  setName]  = useState(state.leadName  || "");
  const [phone, setPhone] = useState(state.leadPhone || "");
  const [email, setEmail] = useState(state.leadEmail || "");
  const [err,   setErr]   = useState("");

  const handle = () => {
    if (!name.trim() || !phone.trim()) { setErr("Por favor preencha nome e WhatsApp."); return; }
    updateState({ leadName: name.trim(), leadPhone: phone.trim(), leadEmail: email.trim() });
    onNext();
  };

  return (
    <div className="fade-in">
      {/* Hero gate card */}
      <div style={{
        background: `linear-gradient(145deg, ${C.navy}, ${C.navyMid})`,
        borderRadius: 20, padding: "32px 28px", textAlign: "center",
        marginBottom: 24, border: `1px solid rgba(206,161,79,0.25)`,
        boxShadow: "0 8px 40px rgba(12,22,42,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg,#CEA14F,#EBE1B3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
            boxShadow: "0 0 0 8px rgba(206,161,79,0.15)",
          }}>📊</div>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 8, letterSpacing: "-0.01em" }}>
          Seu relatório está pronto!
        </h2>
        <p style={{ fontSize: 14, color: "#8aa0bc", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", maxWidth: 340, margin: "0 auto" }}>
          Para visualizar a análise completa de partilha e pensão, informe seus dados abaixo. É rápido e gratuito.
        </p>
      </div>

      {/* Form card */}
      <div style={{ background: C.white, borderRadius: 18, padding: "28px 24px", border: `1.5px solid ${C.border}`, boxShadow: "0 2px 16px rgba(12,22,42,0.07)", marginBottom: 16 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#CEA14F,#EBE1B3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
          <p style={{ fontSize: 13, color: C.textSub, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
            Oi! Sou o assistente do <strong style={{ color: C.navy }}>Dr. Alan</strong>. Seus dados ficam apenas neste dispositivo e são usados para personalizar sua análise.
          </p>
        </div>

        <Field label="Seu nome completo *">
          <TextInput value={name} onChange={e => { setName(e.target.value); setErr(""); }} placeholder="Como posso te chamar?" />
        </Field>
        <Field label="WhatsApp *" note="Usado pelo Dr. Alan para enviar sua análise personalizada.">
          <TextInput value={phone} onChange={e => { setPhone(e.target.value); setErr(""); }} placeholder="(62) 90000-0000" />
        </Field>
        <Field label="E-mail (opcional)">
          <TextInput value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
        </Field>

        {err && (
          <div style={{ background: "#fff5f5", border: "1.5px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.red, fontFamily: "'DM Sans', sans-serif" }}>
            ⚠️ {err}
          </div>
        )}

        <PrimaryBtn onClick={handle} full>
          Ver Meu Resultado Completo →
        </PrimaryBtn>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
          {["🔒 Dados seguros", "✓ 100% gratuito", "📵 Sem spam"].map(t => (
            <span key={t} style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          ← Voltar e corrigir dados
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   CRM PANEL
══════════════════════════════════════════════════════════════════════════════ */

const CRM_USERS = [
  { user: "alan",      pass: "Alan@2024",    name: "Dr. Alan"      },
  { user: "comercial", pass: "Comercial@1",  name: "Equipe Comercial" },
  { user: "admin",     pass: "Admin@Dowell", name: "Administrador" },
];

const STATUS_OPTIONS = [
  { id: "novo",         label: "Novo",            color: "#2563eb", bg: "#eff6ff" },
  { id: "contatado",    label: "Contatado",        color: "#7c3aed", bg: "#f5f3ff" },
  { id: "negociando",   label: "Em Negociação",    color: "#d97706", bg: "#fffbeb" },
  { id: "convertido",   label: "Convertido ✓",     color: "#16a34a", bg: "#f0fdf4" },
  { id: "perdido",      label: "Perdido",          color: "#dc2626", bg: "#fef2f2" },
];

function CRMPanel({ onExit }) {
  const [authed,   setAuthed]   = useState(false);
  const [authUser, setAuthUser] = useState("");
  const [authUser2,setAuthUser2]= useState("");
  const [authPass, setAuthPass] = useState("");
  const [authErr,  setAuthErr]  = useState("");
  const [leads,    setLeads]    = useState([]);
  const [filter,   setFilter]   = useState("todos");
  const [search,   setSearch]   = useState("");
  const [sortBy,   setSortBy]   = useState("date");
  const [selected, setSelected] = useState(null); // lead detail modal

  // load leads on auth
  const doLogin = () => {
    const found = CRM_USERS.find(u => u.user === authUser2.trim().toLowerCase() && u.pass === authPass);
    if (found) { setAuthed(true); setAuthUser(found.name); loadLeads(); setAuthErr(""); }
    else setAuthErr("Usuário ou senha incorretos.");
  };

  const loadLeads = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
      setLeads(raw);
    } catch { setLeads([]); }
  };

  const updateStatus = (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const deleteLead = (id) => {
    if (!window.confirm("Remover este lead?")) return;
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    setSelected(null);
  };

  const exportCSV = () => {
    const header = ["Nome","Telefone","Email","Data","Regime","Patrimônio Total","Parte Cliente","Parte Cônjuge","Dívidas","Pensão Sugerida","Score","Status"];
    const rows = leads.map(l => [
      l.name, l.phone, l.email || "",
      new Date(l.createdAt).toLocaleString("pt-BR"),
      l.regime || "", fmt(l.totalAssets), fmt(l.meShare), fmt(l.spouseShare),
      fmt(l.totalDebts), fmt(l.suggestedAlimony),
      l.score || 0, l.status || "novo"
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `Leads_DivorcioTransparente_${new Date().toLocaleDateString("pt-BR").replace(/\//g,"-")}.csv`;
    a.click();
  };

  // filtered + sorted
  const filtered = leads
    .filter(l => filter === "todos" || (l.status || "novo") === filter)
    .filter(l => !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.phone?.includes(search))
    .sort((a, b) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      if (sortBy === "value") return (b.totalAssets || 0) - (a.totalAssets || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = {
    total:      leads.length,
    novos:      leads.filter(l => !l.status || l.status === "novo").length,
    convertidos:leads.filter(l => l.status === "convertido").length,
    quentes:    leads.filter(l => (l.score || 0) >= 75).length,
    patrimonio: leads.reduce((s, l) => s + (l.totalAssets || 0), 0),
  };

  /* ── Login screen ── */
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fade-in" style={{ background: C.white, borderRadius: 20, padding: "36px 32px", maxWidth: 400, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Logo size={40} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: C.navy, marginTop: 12, marginBottom: 4 }}>Painel CRM</h2>
          <p style={{ fontSize: 12, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>Alan Mac Dowell Velloso · Uso Interno</p>
        </div>
        <Field label="Usuário">
          <TextInput value={authUser2} onChange={e => setAuthUser2(e.target.value)} placeholder="seu usuário" />
        </Field>
        <Field label="Senha">
          <input type="password" value={authPass}
            onChange={e => setAuthPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doLogin()}
            placeholder="••••••••"
            style={{ ...inputStyle }} />
        </Field>
        {authErr && <div style={{ color: C.red, fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>⚠️ {authErr}</div>}
        <PrimaryBtn onClick={doLogin} full>Entrar no Painel →</PrimaryBtn>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onExit} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
            ← Voltar ao simulador
          </button>
        </div>
      </div>
    </div>
  );

  /* ── CRM Dashboard ── */
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f7", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .lead-row:hover { background: #f8f9ff !important; cursor: pointer; }
        .status-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
      `}</style>

      {/* CRM Header */}
      <div style={{ background: C.navy, borderBottom: "2px solid rgba(206,161,79,0.3)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Logo size={28} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.white, fontFamily: "'Playfair Display', serif" }}>Painel de Leads</div>
              <div style={{ fontSize: 10, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>Divórcio Transparente · {authUser}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={exportCSV} style={{ padding: "8px 16px", background: "rgba(206,161,79,0.15)", border: "1px solid rgba(206,161,79,0.4)", borderRadius: 8, color: C.goldLight, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              📥 Exportar CSV
            </button>
            <button onClick={loadLeads} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#8aa0bc", fontSize: 12, cursor: "pointer" }}>
              🔄
            </button>
            <button onClick={onExit} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#8aa0bc", fontSize: 12, cursor: "pointer" }}>
              ✕ Sair
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { icon: "👥", label: "Total de Leads",   value: stats.total,                    color: C.navy  },
            { icon: "🆕", label: "Novos",            value: stats.novos,                    color: "#2563eb" },
            { icon: "🔥", label: "Leads Quentes",    value: stats.quentes,                  color: "#dc2626" },
            { icon: "✅", label: "Convertidos",      value: stats.convertidos,              color: "#16a34a" },
            { icon: "💰", label: "Patrimônio Total", value: fmt(stats.patrimonio),          color: C.gold, small: true },
          ].map(k => (
            <div key={k.label} style={{ background: C.white, borderRadius: 14, padding: "16px 18px", border: `1.5px solid ${C.border}`, boxShadow: "0 2px 8px rgba(12,22,42,0.05)" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: k.small ? 14 : 22, fontWeight: 800, color: k.color, fontFamily: "'Playfair Display', serif", marginBottom: 2 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou telefone..."
              style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["todos","Todos"], ...STATUS_OPTIONS.map(s => [s.id, s.label])].map(([id, lbl]) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${filter === id ? C.gold : C.border}`,
                background: filter === id ? "rgba(206,161,79,0.1)" : C.white,
                color: filter === id ? C.gold : C.textSub,
                fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{lbl}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.white, color: C.text, fontSize: 13, cursor: "pointer" }}>
            <option value="date">Mais recentes</option>
            <option value="score">Maior score</option>
            <option value="value">Maior patrimônio</option>
          </select>
        </div>

        {/* Leads Table */}
        <div style={{ background: C.white, borderRadius: 16, border: `1.5px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(12,22,42,0.06)" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1.2fr 1.2fr 1fr 1.2fr", padding: "12px 20px", background: C.navy, gap: 8 }}>
            {["Cliente","Telefone","Score","Patrimônio","Pensão/mês","Data","Status"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: C.textMuted, fontSize: 14 }}>
              {leads.length === 0 ? "Nenhum lead capturado ainda. Quando alguém fizer a simulação, aparecerá aqui! 🎯" : "Nenhum lead encontrado com esses filtros."}
            </div>
          )}

          {filtered.map((lead, i) => {
            const sc = lead.score || 0;
            const sl = scoreLabel(sc);
            const st = STATUS_OPTIONS.find(s => s.id === (lead.status || "novo")) || STATUS_OPTIONS[0];
            return (
              <div key={lead.id} className="lead-row"
                onClick={() => setSelected(lead)}
                style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1.2fr 1.2fr 1fr 1.2fr", padding: "14px 20px", gap: 8, borderTop: i > 0 ? `1px solid ${C.border}` : "none", alignItems: "center", background: C.white, transition: "background 0.15s" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{lead.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{lead.email || "—"}</div>
                </div>
                <div style={{ fontSize: 13, color: C.text }}>{lead.phone}</div>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, background: sl.bg, border: `1px solid ${sl.border || sl.color}` }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: sl.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: sl.color }}>{sc}</span>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: "'Playfair Display', serif" }}>{fmt(lead.totalAssets || 0)}</div>
                <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{fmt(lead.suggestedAlimony || 0)}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("pt-BR") : "—"}</div>
                <div>
                  <span className="status-badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selected && (
        <div onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(12,22,42,0.65)", backdropFilter: "blur(6px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="fade-in" style={{ background: C.white, borderRadius: 20, maxWidth: 540, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
            {/* Modal header */}
            <div style={{ background: C.navy, padding: "20px 24px", borderRadius: "20px 20px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.white, fontFamily: "'Playfair Display', serif", marginBottom: 3 }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: C.gold }}>{selected.phone} {selected.email ? `· ${selected.email}` : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Score badge */}
                <div style={{ padding: "4px 12px", borderRadius: 20, background: scoreLabel(selected.score||0).bg, border: `1.5px solid ${scoreLabel(selected.score||0).color}` }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: scoreLabel(selected.score||0).color }}>{scoreLabel(selected.score||0).label} · {selected.score}</span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 10px", color: C.white, cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Summary grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  ["Regime",           selected.regime || "—"],
                  ["Data/Hora",        selected.createdAt ? new Date(selected.createdAt).toLocaleString("pt-BR") : "—"],
                  ["Total de Bens",    fmt(selected.totalAssets)],
                  ["Parte do Cliente", fmt(selected.meShare)],
                  ["Parte do Cônjuge", fmt(selected.spouseShare)],
                  ["Dívidas",          fmt(selected.totalDebts)],
                  ["Patrimônio Líq.",  fmt((selected.totalAssets||0)-(selected.totalDebts||0))],
                  ["Pensão Sugerida",  fmt(selected.suggestedAlimony)],
                ].map(([lbl, val]) => (
                  <div key={lbl} style={{ background: "#f8f9fc", borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{lbl}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, fontFamily: "'Playfair Display', serif" }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Assets list */}
              {selected.assets?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Bens declarados</div>
                  {selected.assets.map(a => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: C.text }}>{a.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{fmt(a.value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status update */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Atualizar status do lead</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s.id} onClick={() => updateStatus(selected.id, s.id)} style={{
                      padding: "8px 14px", borderRadius: 20,
                      border: `2px solid ${(selected.status||"novo") === s.id ? s.color : C.border}`,
                      background: (selected.status||"novo") === s.id ? s.bg : C.white,
                      color: (selected.status||"novo") === s.id ? s.color : C.textSub,
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>{s.label}</button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`https://wa.me/55${selected.phone?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                  style={{ flex: 1, padding: "12px", background: "#25D366", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 13, textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  📱 Abrir WhatsApp
                </a>
                <button onClick={() => deleteLead(selected.id)} style={{ padding: "12px 16px", background: "#fff5f5", border: "1.5px solid #fca5a5", borderRadius: 12, color: C.red, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  🗑️ Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── PDF Generator ───────────────────────────────────────────────────────────── */
function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf.jsPDF);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function generateBrandedPDF({ form, state, me, spouse, totalAssets, totalDebts, totalNeeds, suggestedAlimony, payerIncome, receiverIncome, REGIME_LABEL }) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297;
  const ml = 20, mr = 20, cw = W - ml - mr;
  const NAVY   = [12, 22, 42];
  const NAVYM  = [15, 29, 55];
  const GOLD   = [206, 161, 79];
  const GOLDL  = [235, 225, 179];
  const SILVER = [210, 211, 213];
  const WHITE  = [255, 255, 255];
  const GRAY   = [245, 246, 248];
  const TEXTD  = [26, 35, 64];
  const TEXTS  = [90, 107, 138];

  // ── helpers ──────────────────────────────────────────────────────────────────
  const setFill  = (rgb) => doc.setFillColor(...rgb);
  const setDraw  = (rgb) => doc.setDrawColor(...rgb);
  const setTxt   = (rgb) => doc.setTextColor(...rgb);
  const setFont  = (sz, style = "normal") => { doc.setFontSize(sz); doc.setFont("helvetica", style); };
  const rect     = (x, y, w, h, fill, r = 0) => { setFill(fill); doc.roundedRect(x, y, w, h, r, r, "F"); };
  const line     = (x1, y1, x2, y2, rgb, lw = 0.3) => { setDraw(rgb); doc.setLineWidth(lw); doc.line(x1, y1, x2, y2); };
  const txt      = (t, x, y, align = "left") => doc.text(String(t), x, y, { align });

  // ── COVER PAGE ───────────────────────────────────────────────────────────────
  // Navy background full page
  rect(0, 0, W, H, NAVY);

  // Gold top accent bar
  rect(0, 0, W, 3, GOLD);

  // Gold bottom accent bar
  rect(0, H - 3, W, 3, GOLD);

  // Subtle diagonal gold watermark strip
  doc.setGState && doc.setGState(doc.GState({ opacity: 0.04 }));
  for (let i = -10; i < 30; i++) {
    rect(i * 12, 0, 6, H, GOLDL);
  }
  doc.setGState && doc.setGState(doc.GState({ opacity: 1 }));

  // Logo "M" monogram drawn with lines (gold)
  const lx = W / 2, ly = 60;
  doc.setLineWidth(2);
  setDraw(GOLD);
  // Outer M
  doc.line(lx - 12, ly + 10, lx - 12, ly - 10);
  doc.line(lx - 12, ly - 10, lx, ly + 2);
  doc.line(lx, ly + 2, lx + 12, ly - 10);
  doc.line(lx + 12, ly - 10, lx + 12, ly + 10);
  // Inner lines (lighter)
  doc.setLineWidth(1);
  setDraw(GOLDL);
  doc.line(lx - 6, ly + 10, lx - 6, ly - 2);
  doc.line(lx - 6, ly - 2, lx, ly + 6);
  doc.line(lx, ly + 6, lx + 6, ly - 2);
  doc.line(lx + 6, ly - 2, lx + 6, ly + 10);

  // Gold divider line under logo
  line(ml + 30, ly + 20, W - mr - 30, ly + 20, GOLD, 0.5);

  // Title
  setFont(22, "bold"); setTxt(GOLDL);
  txt("ALAN MAC DOWELL VELLOSO", W / 2, ly + 33, "center");

  setFont(9, "normal"); setTxt(GOLD);
  txt("SOCIEDADE INDIVIDUAL DE ADVOCACIA  |  OAB/GO 4573", W / 2, ly + 41, "center");

  // Gold divider
  line(ml + 30, ly + 47, W - mr - 30, ly + 47, GOLD, 0.3);

  // Report title
  setFont(14, "bold"); setTxt(WHITE);
  txt("RELATORIO DE SIMULACAO PATRIMONIAL", W / 2, ly + 63, "center");

  setFont(9, "normal"); setTxt(SILVER);
  txt("Divorcio Transparente  |  Documento Confidencial", W / 2, ly + 72, "center");

  // Client info box
  const bx = ml + 10, by = ly + 85, bw = cw - 20, bh = 48;
  rect(bx, by, bw, bh, NAVYM, 3);
  // Gold left border accent
  rect(bx, by, 2, bh, GOLD, 0);

  setFont(8, "normal"); setTxt(GOLD);
  txt("DADOS DO CLIENTE", bx + 10, by + 10);
  line(bx + 10, by + 13, bx + bw - 10, by + 13, GOLD, 0.3);

  setFont(11, "bold"); setTxt(WHITE);
  txt(form.name || "Nao informado", bx + 10, by + 23);

  setFont(8, "normal"); setTxt(SILVER);
  txt(`Telefone: ${form.phone || "—"}`, bx + 10, by + 32);
  txt(`E-mail: ${form.email || "—"}`, bx + 10, by + 39);
  txt(`Data: ${new Date().toLocaleDateString("pt-BR")}   Hora: ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`, bx + bw - 10, by + 32, "right");
  txt(`Regime: ${REGIME_LABEL[state.regime] || "—"}`, bx + bw - 10, by + 39, "right");

  // Confidential badge
  rect(W / 2 - 22, H - 25, 44, 10, [30, 50, 90], 5);
  setFont(7, "bold"); setTxt(GOLD);
  txt("USO INTERNO — COMERCIAL", W / 2, H - 18, "center");

  // ── PAGE 2: PATRIMONY ────────────────────────────────────────────────────────
  doc.addPage();
  rect(0, 0, W, H, GRAY);
  rect(0, 0, W, 18, NAVY);
  rect(0, 0, W, 2, GOLD);

  // Header page 2
  setFont(8, "bold"); setTxt(GOLD);
  txt("ALAN MAC DOWELL VELLOSO  |  OAB/GO 4573", ml, 12);
  setFont(7, "normal"); setTxt(SILVER);
  txt(`${form.name}  |  ${new Date().toLocaleDateString("pt-BR")}`, W - mr, 12, "right");

  let y = 30;

  // Section title
  rect(ml, y, cw, 10, NAVY, 2);
  rect(ml, y, 3, 10, GOLD, 0);
  setFont(10, "bold"); setTxt(GOLD);
  txt("PARTILHA DE BENS", ml + 8, y + 7);
  setFont(7, "normal"); setTxt(SILVER);
  txt(`Regime: ${REGIME_LABEL[state.regime]}`, W - mr, y + 7, "right");
  y += 16;

  // Summary cards row
  const cards = [
    { label: "Total de Ativos", value: fmt(totalAssets), color: NAVY },
    { label: "Sua Parte Estimada", value: fmt(me), color: [12, 100, 60] },
    { label: "Parte do Conjuge", value: fmt(spouse), color: [80, 80, 100] },
    { label: "Patrimonio Liquido", value: fmt(totalAssets - totalDebts), color: [140, 90, 10] },
  ];
  const cardW = (cw - 6) / 4;
  cards.forEach((card, i) => {
    const cx2 = ml + i * (cardW + 2);
    rect(cx2, y, cardW, 22, WHITE, 2);
    // top accent
    rect(cx2, y, cardW, 2, GOLD, 0);
    setFont(7, "normal"); setTxt(TEXTS);
    txt(card.label, cx2 + cardW / 2, y + 9, "center");
    setFont(9, "bold"); setTxt(TEXTD);
    txt(card.value, cx2 + cardW / 2, y + 18, "center");
  });
  y += 28;

  // Bar chart — visual split
  if (totalAssets > 0) {
    const barY = y, barH = 8, barW = cw;
    const myPct = me / (me + spouse || 1);
    rect(ml, barY, barW, barH, SILVER, 4);
    rect(ml, barY, barW * myPct, barH, GOLD, 4);
    setFont(7, "bold"); setTxt(NAVY);
    txt(`Sua parte: ${(myPct * 100).toFixed(1)}%`, ml + 4, barY + 5.5);
    setFont(7, "bold"); setTxt(WHITE);
    txt(`Conjuge: ${((1 - myPct) * 100).toFixed(1)}%`, ml + barW - 4, barY + 5.5, "right");
    y += 14;
  }

  // Assets table
  if (state.assets.length > 0) {
    // table header
    rect(ml, y, cw, 8, NAVY, 1);
    setFont(7, "bold"); setTxt(GOLD);
    txt("BEM", ml + 4, y + 5.5);
    txt("TIPO", ml + 80, y + 5.5);
    txt("VALOR", ml + 118, y + 5.5);
    txt("STATUS", ml + 145, y + 5.5);
    txt("PARTILHAVEL", W - mr, y + 5.5, "right");
    y += 9;

    const TYPE_LABELS = { REAL_ESTATE: "Imovel", VEHICLE: "Veiculo", INVESTMENT: "Investimento", FGTS: "FGTS", COMPANY: "Empresa", OTHER: "Outro" };
    state.assets.forEach((a, idx) => {
      if (y > H - 40) { doc.addPage(); rect(0,0,W,H,GRAY); rect(0,0,W,18,NAVY); rect(0,0,W,2,GOLD); y = 30; }
      rect(ml, y, cw, 8, idx % 2 === 0 ? WHITE : [240, 242, 246], 0);
      setFont(7, "normal"); setTxt(TEXTD);
      txt(a.name.substring(0, 28), ml + 4, y + 5.5);
      txt(TYPE_LABELS[a.type] || a.type, ml + 80, y + 5.5);
      setFont(7, "bold"); setTxt(NAVY);
      txt(fmt(a.value), ml + 118, y + 5.5);
      setFont(7, "normal"); setTxt(TEXTS);
      const status = a.isFinanced ? "Financiado" : a.acquiredDuringMarriage ? "Comum" : "Particular";
      txt(status, ml + 145, y + 5.5);
      setFont(7, "bold"); setTxt([12, 100, 60]);
      const partilhavel = a.acquiredDuringMarriage && !a.isInheritanceOrDonation ? "Sim" : "Nao";
      txt(partilhavel, W - mr, y + 5.5, "right");
      y += 8;
    });
    y += 6;
  }

  // Debts
  if (state.debts.length > 0) {
    if (y > H - 60) { doc.addPage(); rect(0,0,W,H,GRAY); rect(0,0,W,18,NAVY); rect(0,0,W,2,GOLD); y = 30; }
    rect(ml, y, cw, 10, [180, 30, 30], 2);
    rect(ml, y, 3, 10, GOLD, 0);
    setFont(10, "bold"); setTxt(WHITE);
    txt("PASSIVOS E DIVIDAS", ml + 8, y + 7);
    y += 14;

    rect(ml, y, cw, 8, [200, 50, 50], 0);
    setFont(7, "bold"); setTxt(WHITE);
    txt("DESCRICAO", ml + 4, y + 5.5);
    txt("VALOR", W - mr, y + 5.5, "right");
    y += 8;

    state.debts.forEach((d, idx) => {
      rect(ml, y, cw, 8, idx % 2 === 0 ? WHITE : [255, 245, 245], 0);
      setFont(7, "normal"); setTxt(TEXTD);
      txt(d.name, ml + 4, y + 5.5);
      setFont(7, "bold"); setTxt([180, 30, 30]);
      txt(`- ${fmt(d.value)}`, W - mr, y + 5.5, "right");
      y += 8;
    });

    rect(ml, y, cw, 10, [240, 230, 230], 0);
    setFont(8, "bold"); setTxt([180, 30, 30]);
    txt("TOTAL DE DIVIDAS", ml + 4, y + 7);
    txt(`- ${fmt(totalDebts)}`, W - mr, y + 7, "right");
    y += 16;
  }

  // ── PAGE 3: ALIMONY ──────────────────────────────────────────────────────────
  if (totalNeeds > 0 || payerIncome > 0) {
    doc.addPage();
    rect(0, 0, W, H, GRAY);
    rect(0, 0, W, 18, NAVY);
    rect(0, 0, W, 2, GOLD);

    setFont(8, "bold"); setTxt(GOLD);
    txt("ALAN MAC DOWELL VELLOSO  |  OAB/GO 4573", ml, 12);
    setFont(7, "normal"); setTxt(SILVER);
    txt(`${form.name}  |  ${new Date().toLocaleDateString("pt-BR")}`, W - mr, 12, "right");

    y = 30;

    rect(ml, y, cw, 10, NAVY, 2);
    rect(ml, y, 3, 10, GOLD, 0);
    setFont(10, "bold"); setTxt(GOLD);
    txt("SIMULACAO DE PENSAO ALIMENTICIA", ml + 8, y + 7);
    y += 16;

    // Income cards
    const incCards = [
      { label: "Renda do Pagador", value: fmt(payerIncome) },
      { label: "Renda do Guardiao", value: fmt(receiverIncome) },
      { label: "Renda Total", value: fmt(payerIncome + receiverIncome) },
    ];
    const iCardW = (cw - 4) / 3;
    incCards.forEach((c, i) => {
      const cx2 = ml + i * (iCardW + 2);
      rect(cx2, y, iCardW, 20, WHITE, 2);
      rect(cx2, y, iCardW, 2, NAVY, 0);
      setFont(7, "normal"); setTxt(TEXTS);
      txt(c.label, cx2 + iCardW / 2, y + 9, "center");
      setFont(9, "bold"); setTxt(TEXTD);
      txt(c.value, cx2 + iCardW / 2, y + 17, "center");
    });
    y += 27;

    // Expenses table
    if (state.alimony.expenses.length > 0) {
      rect(ml, y, cw, 8, [30, 60, 30], 1);
      setFont(7, "bold"); setTxt(GOLDL);
      txt("NECESSIDADES DOS FILHOS", ml + 4, y + 5.5);
      txt("VALOR MENSAL", W - mr, y + 5.5, "right");
      y += 8;

      state.alimony.expenses.forEach((e, idx) => {
        rect(ml, y, cw, 8, idx % 2 === 0 ? WHITE : GRAY, 0);
        setFont(7, "normal"); setTxt(TEXTD);
        txt(e.category, ml + 4, y + 5.5);
        setFont(7, "bold"); setTxt([30, 100, 60]);
        txt(fmt(e.value), W - mr, y + 5.5, "right");
        y += 8;
      });

      rect(ml, y, cw, 10, [220, 240, 220], 0);
      setFont(8, "bold"); setTxt([30, 100, 30]);
      txt("TOTAL DE NECESSIDADES MENSAIS", ml + 4, y + 7);
      txt(fmt(totalNeeds), W - mr, y + 7, "right");
      y += 16;
    }

    // Alimony result box (gold highlight)
    if (suggestedAlimony > 0) {
      rect(ml, y, cw, 36, NAVY, 3);
      rect(ml, y, cw, 2, GOLD, 0);
      rect(ml, y + 34, cw, 2, GOLD, 0);

      setFont(8, "normal"); setTxt(SILVER);
      txt("VALOR ESTIMADO PELO CRITERIO DO BINOMIO", W / 2, y + 10, "center");

      setFont(20, "bold"); setTxt(GOLD);
      txt(fmt(suggestedAlimony), W / 2, y + 24, "center");

      setFont(7, "normal"); setTxt(SILVER);
      txt(`Por mes  |  Limitado a 30% da renda do pagador`, W / 2, y + 31, "center");
      y += 42;

      // Proportionality detail
      const ratio = payerIncome / (payerIncome + receiverIncome || 1);
      rect(ml, y, cw, 20, WHITE, 2);
      setFont(7, "normal"); setTxt(TEXTS);
      txt("Metodologia: Necessidade x (Renda Pagador / Renda Total)", ml + 4, y + 7);
      txt(`= ${fmt(totalNeeds)} x ${(ratio * 100).toFixed(1)}%  =  ${fmt(totalNeeds * ratio)}`, ml + 4, y + 13);
      setFont(7, "bold"); setTxt(NAVY);
      txt(`Valor final aplicado: ${fmt(suggestedAlimony)}  (cap de 30% da renda do pagador)`, ml + 4, y + 18);
      y += 26;
    }
  }

  // ── LAST PAGE: LEGAL NOTICE ──────────────────────────────────────────────────
  doc.addPage();
  rect(0, 0, W, H, NAVY);
  rect(0, 0, W, 2, GOLD);
  rect(0, H - 2, W, 2, GOLD);

  // Logo repeat
  const lx2 = W / 2, ly2 = 55;
  doc.setLineWidth(1.5); setDraw(GOLD);
  doc.line(lx2 - 10, ly2 + 8, lx2 - 10, ly2 - 8);
  doc.line(lx2 - 10, ly2 - 8, lx2, ly2 + 2);
  doc.line(lx2, ly2 + 2, lx2 + 10, ly2 - 8);
  doc.line(lx2 + 10, ly2 - 8, lx2 + 10, ly2 + 8);

  line(ml + 35, ly2 + 18, W - mr - 35, ly2 + 18, GOLD, 0.4);

  setFont(13, "bold"); setTxt(GOLDL);
  txt("AVISO LEGAL", W / 2, ly2 + 30, "center");

  const disclaimer = [
    "Este documento e uma simulacao educativa gerada pelo sistema Divorcio Transparente.",
    "Os calculos apresentados sao estimativas baseadas na legislacao geral do Codigo Civil Brasileiro",
    "e nao constituem aconselhamento juridico formal.",
    "",
    "Cada caso possui particularidades que podem alterar significativamente o resultado final.",
    "Bens ocultos, provas documentais, acordos pre-nupciais e decisoes judiciais especificas",
    "podem modificar os valores estimados.",
    "",
    "Este relatorio e de uso interno e destina-se exclusivamente a equipe comercial do escritorio",
    "Alan Mac Dowell Velloso para fins de atendimento e qualificacao de clientes.",
    "",
    "Para uma analise juridica completa, consulte o Dr. Alan Mac Dowell Velloso.",
  ];

  setFont(9, "normal"); setTxt(SILVER);
  let dy = ly2 + 44;
  disclaimer.forEach(line2 => {
    if (line2 === "") { dy += 4; return; }
    txt(line2, W / 2, dy, "center");
    dy += 7;
  });

  // Bottom contact block
  rect(ml + 20, dy + 10, cw - 40, 30, [20, 35, 65], 3);
  rect(ml + 20, dy + 10, cw - 40, 2, GOLD, 0);
  setFont(8, "bold"); setTxt(GOLD);
  txt("ALAN MAC DOWELL VELLOSO", W / 2, dy + 20, "center");
  setFont(7, "normal"); setTxt(SILVER);
  txt("Sociedade Individual de Advocacia  |  OAB/GO 4573", W / 2, dy + 27, "center");
  txt("(62) 99634-9626  |  Goiania - GO", W / 2, dy + 33, "center");

  // Page numbers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    if (i > 1) {
      setFont(7, "normal");
      setTxt(i === totalPages ? GOLD : SILVER);
      txt(`Pagina ${i} de ${totalPages}`, W / 2, H - 8, "center");
    }
  }

  return doc;
}

/* ── Step 6: Dashboard ───────────────────────────────────────────────────────── */
function DashboardStep({ state, onReset }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: state.leadName || "", phone: state.leadPhone || "", email: state.leadEmail || "" });
  const [sending, setSending] = useState(false);

  const { me, spouse, totalAssets, totalDebts, totalNeeds, payerIncome, receiverIncome, totalIncome, suggestedAlimony } = calcDashboardNumbers(state);

  const REGIME_LABEL = { PARCIAL: "Comunhao Parcial", UNIVERSAL: "Comunhao Universal", SEPARACAO: "Separacao Total" };
  const REGIME_LABEL_PT = { PARCIAL: "Comunhão Parcial", UNIVERSAL: "Comunhão Universal", SEPARACAO: "Separação Total" };
  const pdfData = { form, state, me, spouse, totalAssets, totalDebts, totalNeeds, suggestedAlimony, payerIncome, receiverIncome, REGIME_LABEL };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { alert("Preencha nome e telefone."); return; }
    setSending(true);
    try {
      // 1. Generate & download branded PDF
      const doc = await generateBrandedPDF(pdfData);
      const safeName = form.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      doc.save(`Simulacao_${safeName}_${new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")}.pdf`);

      // 2. Small delay then open WhatsApp
      await new Promise(r => setTimeout(r, 1200));
      const msg = `Olá! Gostaria de falar com o Dr. Alan Mac Dowell Velloso.\n\n` +
        `Meu nome é *${form.name}*\nTelefone: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ""}\n\n` +
        `Acabei de realizar uma simulação no app *Divórcio Transparente* e enviei o relatório em PDF.\n\n` +
        `📊 *Resumo Patrimonial*\n` +
        `• Regime: ${REGIME_LABEL_PT[state.regime]}\n` +
        `• Total de Bens: ${fmt(totalAssets)}\n` +
        `• Minha Parte Estimada: ${fmt(me)}\n` +
        `• Parte do Cônjuge: ${fmt(spouse)}\n` +
        `• Dívidas: ${fmt(totalDebts)}\n\n` +
        `👶 *Pensão Alimentícia*\n` +
        `• Necessidades: ${fmt(totalNeeds)}\n` +
        `• Valor Sugerido: ${fmt(suggestedAlimony)}\n\n` +
        `Gostaria de agendar uma consulta.`;
      window.open(`https://wa.me/5562996349626?text=${encodeURIComponent(msg)}`, "_blank");
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar PDF. Tente novamente.");
    }
    setSending(false);
    setModalOpen(false);
  };

  return (
    <div className="fade-in">
      <AIGuide step={5} />

      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: "-0.02em" }}>
          Seu Cenário Estimado
        </h2>
        <p style={{ fontSize: 13, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>
          Análise baseada no Código Civil Brasileiro · Regime: <strong style={{ color: C.gold }}>{REGIME_LABEL_PT[state.regime]}</strong>
        </p>
      </div>

      {/* Partilha Card */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 20 }}>⚖️</span>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.navy, fontFamily: "'Playfair Display', serif" }}>Partilha de Bens</h3>
        </div>
        <PieChart me={me} spouse={spouse} />
        <div style={{ borderTop: `1.5px solid ${C.border}`, marginTop: 20, paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["Total de Ativos", fmt(totalAssets), C.navy],
            totalDebts > 0 ? ["Dívidas", `-${fmt(totalDebts)}`, C.red] : null,
            ["Patrimônio Líquido", fmt(totalAssets - totalDebts), C.gold],
          ].filter(Boolean).map(([lbl, val, color]) => (
            <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>{lbl}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "'Playfair Display', serif" }}>{val}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Pensão Card */}
      {totalNeeds > 0 && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>👶</span>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.navy, fontFamily: "'Playfair Display', serif" }}>Estimativa de Pensão</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[["Necessidade Mensal", fmt(totalNeeds)], ["Renda Total (Pais)", fmt(totalIncome)]].map(([lbl, val]) => (
              <div key={lbl} style={{ background: "#f8f9fc", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, fontFamily: "'Playfair Display', serif" }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(206,161,79,0.08), rgba(235,225,179,0.04))", border: `1.5px solid rgba(206,161,79,0.3)`, borderRadius: 14, padding: "22px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Valor Sugerido pelo Binômio</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.gold, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>{fmt(suggestedAlimony)}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>Limitado a 30% da renda do pagador</div>
          </div>
        </Card>
      )}

      {/* CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`,
        borderRadius: 20, padding: "32px 28px", textAlign: "center",
        boxShadow: "0 8px 40px rgba(12,22,42,0.2)",
        marginBottom: 16, border: `1px solid rgba(206,161,79,0.2)`,
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Logo size={48} />
        </div>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
          Alan Mac Dowell Velloso · OAB/GO 4573
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: C.white, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
          Valide com um especialista
        </h3>
        <p style={{ fontSize: 13, color: "#8aa0bc", lineHeight: 1.7, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px", fontFamily: "'DM Sans', sans-serif" }}>
          Esta simulação é o primeiro passo. Um advogado especializado pode identificar bens ocultos e garantir seus direitos em juízo.
        </p>
        <button className="pulse-gold" onClick={() => setModalOpen(true)} style={{
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
          color: C.navy, border: "none", borderRadius: 50, padding: "15px 40px",
          fontSize: 15, fontWeight: 800, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
        }}>
          💬 Falar com Dr. Alan
        </button>
        <div style={{ fontSize: 11, color: "#3a5070", marginTop: 14, fontFamily: "'DM Sans', sans-serif" }}>Sociedade Individual de Advocacia</div>
      </div>

      {/* Aviso Legal */}
      <div style={{ background: "#fffbf0", border: `1.5px solid rgba(206,161,79,0.2)`, borderRadius: 12, padding: "16px", display: "flex", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
          <strong style={{ color: C.text }}>AVISO LEGAL:</strong> Estimativa matemática baseada no Código Civil. O Direito de Família admite variações por provas específicas. Não substitui aconselhamento jurídico.
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onReset} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
          🔄 Refazer Simulação
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(12,22,42,0.7)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="slide-up" style={{ background: C.white, borderRadius: 20, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(12,22,42,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 26, marginBottom: 6 }}>💬</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Falar com Dr. Alan</h3>
                <p style={{ fontSize: 12, color: C.textSub, fontFamily: "'DM Sans', sans-serif" }}>Seus dados + resumo da simulação serão enviados via WhatsApp.</p>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 22 }}>✕</button>
            </div>

            {/* PDF preview info box */}
            <div style={{ background: "linear-gradient(135deg,rgba(12,22,42,0.05),rgba(206,161,79,0.06))", border:`1.5px solid rgba(206,161,79,0.25)`, borderRadius:12, padding:"14px 16px", marginBottom:18, display:"flex", gap:12, alignItems:"flex-start" }}>
              <span style={{ fontSize:24, flexShrink:0 }}>📄</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.navy, fontFamily:"'DM Sans', sans-serif", marginBottom:3 }}>Relatório PDF Completo</div>
                <div style={{ fontSize:11, color:C.textSub, fontFamily:"'DM Sans', sans-serif", lineHeight:1.6 }}>
                  Um PDF com a marca do escritório será gerado automaticamente com todos os dados da simulação — partilha de bens, dívidas e pensão alimentícia.
                </div>
              </div>
            </div>

            <Field label="Seu Nome *"><TextInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" /></Field>
            <Field label="Telefone WhatsApp *"><TextInput value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(62) 00000-0000" /></Field>
            <Field label="E-mail (opcional)"><TextInput value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" /></Field>

            <button onClick={handleSubmit} disabled={sending} style={{
              width: "100%", padding: "15px", border: "none", borderRadius: 12,
              background: sending ? "#e8eaf0" : "linear-gradient(135deg,#0C162A,#0F1D37)",
              color: sending ? C.textMuted : C.white,
              fontWeight: 800, fontSize: 15, cursor: sending ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: sending ? "none" : "0 4px 20px rgba(12,22,42,0.3)",
              marginBottom: 10,
            }}>
              {sending ? (
                <>⏳ Gerando PDF...</>
              ) : (
                <><span style={{ fontSize:18 }}>📄</span> Gerar PDF e Enviar pelo WhatsApp</>
              )}
            </button>
            <p style={{ fontSize: 11, color: C.textMuted, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
              O PDF será baixado automaticamente e o WhatsApp abrirá com um resumo da simulação.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════════ */
const INITIAL = {
  regime: null, marriageDate: "", assets: [], debts: [],
  alimony: { payerIncome: 0, receiverIncome: 0, payerOtherChildren: 0, expenses: [] },
  termsAccepted: false,
  leadName: "", leadPhone: "", leadEmail: "",
};

// Steps: Welcome → Regime → Assets → Debts → Alimony → LeadCapture → Dashboard
const STEPS = [WelcomeStep, RegimeStep, AssetsStep, DebtsStep, AlimonyStep, LeadCaptureStep, DashboardStep];
const STEP_LABELS_NAV = ["Início", "Regime", "Bens", "Dívidas", "Pensão", "Seus Dados", "Resultado"];

export default function Simulator({ onBackToLanding }) {
  const [state, setState] = useState(() => {
    try { const s = localStorage.getItem("dt2-state"); return s ? JSON.parse(s) : INITIAL; } catch { return INITIAL; }
  });
  const [step, setStep] = useState(() => {
    try { const s = localStorage.getItem("dt2-step"); return s ? Number(s) : 0; } catch { return 0; }
  });
  const [showCRM, setShowCRM] = useState(false);

  useEffect(() => { try { localStorage.setItem("dt2-state", JSON.stringify(state)); } catch {} }, [state]);
  useEffect(() => { try { localStorage.setItem("dt2-step", step.toString()); } catch {} }, [step]);

  const updateState = useCallback((u) => setState(prev => ({ ...prev, ...u })), []);

  const onNext = () => {
    // When advancing FROM LeadCapture (step 5) → save lead before showing dashboard
    if (step === 5 && state.leadName && state.leadPhone) {
      // calc scores to save
      const { me, spouse, totalAssets, totalDebts, suggestedAlimony } = calcDashboardNumbers(state);
      const score = calcLeadScore(state, totalAssets, totalDebts, suggestedAlimony);
      const REGIME_LABEL = { PARCIAL: "Comunhão Parcial", UNIVERSAL: "Comunhão Universal", SEPARACAO: "Separação Total" };
      const lead = {
        id: uid(),
        name: state.leadName, phone: state.leadPhone, email: state.leadEmail,
        regime: REGIME_LABEL[state.regime] || state.regime,
        totalAssets, meShare: me, spouseShare: spouse, totalDebts, suggestedAlimony,
        assets: state.assets, debts: state.debts,
        score, status: "novo",
        createdAt: new Date().toISOString(),
      };
      saveLeadToStorage(lead);
      // WhatsApp notification to escritório
      const msg = `🔔 *Novo Lead — Divórcio Transparente*\n\n👤 *${state.leadName}*\n📱 ${state.leadPhone}${state.leadEmail ? `\n📧 ${state.leadEmail}` : ""}\n\n📊 *Resumo*\n• Regime: ${REGIME_LABEL[state.regime]}\n• Patrimônio: ${fmt(totalAssets)}\n• Parte do Cliente: ${fmt(me)}\n• Dívidas: ${fmt(totalDebts)}\n• Pensão Sugerida: ${fmt(suggestedAlimony)}\n• Score: ${score}/100 ${score >= 75 ? "🔥" : score >= 45 ? "⚡" : "❄️"}\n\n_Lead salvo no painel CRM._`;
      setTimeout(() => window.open(`https://wa.me/5562996349626?text=${encodeURIComponent(msg)}`, "_blank"), 400);
    }
    if (step < STEPS.length - 1) { setStep(s => s + 1); window.scrollTo(0, 0); }
  };

  const onBack = () => { if (step > 0) { setStep(s => s - 1); window.scrollTo(0, 0); } };
  const onReset = () => {
    localStorage.removeItem("dt2-state"); localStorage.removeItem("dt2-step");
    setState(INITIAL); setStep(0);
  };

  if (showCRM) return <CRMPanel onExit={() => setShowCRM(false)} />;

  const CurrentStep = STEPS[step];
  const totalLeads = (() => { try { return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]").length; } catch { return 0; } })();

  return (
    <>
      <FontLoader />
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* Header */}
        <header style={{
          background: C.navyMid,
          borderBottom: `1px solid rgba(206,161,79,0.2)`,
          position: "sticky", top: 0, zIndex: 50,
          boxShadow: "0 2px 20px rgba(12,22,42,0.25)",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: step > 0 && step < STEPS.length - 1 ? 14 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Logo size={34} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.white, fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}>
                    Divórcio Transparente
                  </div>
                  <div style={{ fontSize: 10, color: C.gold, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Alan Mac Dowell Velloso · OAB/GO 4573
                  </div>
                </div>
              </div>
              {/* CRM button — subtle, top right */}
              <button onClick={() => setShowCRM(true)} style={{
                background: "rgba(206,161,79,0.08)", border: "1px solid rgba(206,161,79,0.25)",
                borderRadius: 20, padding: "6px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 7,
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 14 }}>📋</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.goldLight, fontFamily: "'DM Sans', sans-serif" }}>CRM</span>
                {totalLeads > 0 && (
                  <span style={{ background: C.gold, color: C.navy, borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 800 }}>
                    {totalLeads}
                  </span>
                )}
              </button>
            </div>
            {step > 0 && step < STEPS.length - 1 && <ProgressSteps step={step} labels={STEP_LABELS_NAV} />}
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "28px 20px 80px" }}>
          <CurrentStep state={state} updateState={updateState} onNext={onNext} onBack={onBack} onReset={onReset} />
        </main>

        {/* Footer */}
        <footer style={{ background: C.navyMid, borderTop: `1px solid rgba(206,161,79,0.15)`, padding: "20px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Logo size={28} />
          </div>
          <p style={{ fontSize: 11, color: "#4a6080", fontFamily: "'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} Alan Mac Dowell Velloso · Sociedade Individual de Advocacia · OAB/GO 4573
          </p>
        </footer>
      </div>
    </>
  );
}
