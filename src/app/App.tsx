import { useState, useRef, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Send, ChevronDown, ArrowRight, ArrowUpRight, Search, Download, MessageCircle, ExternalLink } from "lucide-react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG      = "#FFFFFF";
const BG_ALT  = "#F4F9F6";
const BG_MINT = "#E5F2EB";
const BG_SAGE = "#D0E8DC";
const BG_PEACH= "#FDF1EC";
const BG_CREAM= "#FBF8F3";
const INK     = "#0F2418";
const INK_OFF = "rgba(15,36,24,0.5)";
const INK_DIM = "rgba(15,36,24,0.1)";
const GREEN   = "#2A8A58";
const GREEN_L = "#5BAF85";
const GREEN_BG= "#EBF7F1";
const CORAL   = "#E8724E";
const CORAL_BG= "#FDF0EB";
const WHITE   = "#FFFFFF";
const F = "'Plus Jakarta Sans', sans-serif";

const LOGO_URL = "https://healthyliving.abudhabi/wp-content/uploads/2025/12/cropped-logo.png";
const IMG_HERO   = "https://healthyliving.abudhabi/wp-content/uploads/2025/12/hero-bg-3.png";
const IMG_RUNNER = "https://healthyliving.abudhabi/wp-content/uploads/2026/02/5a782eeafcf85327081d87e6ee59047151b61e1e-scaled.webp";
const IMG_CORNICHE= "https://healthyliving.abudhabi/wp-content/uploads/2026/01/71e4cdd5655c3ac5168eeaff712547e11ad47713-scaled.jpg";
const IMG_CYCLE  = "https://healthyliving.abudhabi/wp-content/uploads/2026/02/afb751d9096c09d101812427248a3c5340037434-scaled.png";
const IMG_FOOD   = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080";
const IMG_COMMUNITY="https://healthyliving.abudhabi/wp-content/uploads/2026/02/27dda52f2969b946975ce111bfb031613cbe8edb-scaled.png";
const IMG_RECT1  = "https://healthyliving.abudhabi/wp-content/uploads/2026/01/aa7288a0c292398217e795232242fa978ad26eaf-scaled.png";
const IMG_RECT2  = "https://healthyliving.abudhabi/wp-content/uploads/2026/01/7e3e61831ee2e5b591df6da40cabca58b07ee196-scaled.png";


// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "1"|"2";
const PhaseCtx = createContext<Phase>("1");
type Page  = "home"|"approach"|"updates"|"about"|"schools"|"research"|"tools"|"mealplans"|"workout"|"wellness"|"collaborate"|"scanner"|"rewards"|"communities"|"partners"|"press"|"faq"|"ai"|"lab";
type NavItem = { id:string; label:string; sub?:{id:string;label:string}[] };

// ─── Nav ──────────────────────────────────────────────────────────────────────
const P1_TOP_LINKS: NavItem[] = [
  { id:"approach", label:"Healthy Living", sub:[
    { id:"approach", label:"Our Approach" },
    { id:"updates",  label:"Updates"      },
    { id:"about",    label:"About Us"     },
  ]},
  { id:"schools",     label:"Schools & Children" },
  { id:"research",    label:"Global & Research"  },
  { id:"collaborate", label:"Collaborate"        },
  { id:"lab",         label:"Wellness Lab"       },
  { id:"more", label:"More", sub:[
    { id:"partners", label:"Partners" },
    { id:"press",    label:"Press"    },
    { id:"faq",      label:"FAQ"      },
    { id:"ai",       label:"Ask AI"   },
  ]},
];

const P2_TOP_LINKS: NavItem[] = [
  { id:"approach", label:"Healthy Living", sub:[
    { id:"approach", label:"Our Approach" },
    { id:"updates",  label:"Updates"      },
    { id:"about",    label:"About Us"     },
  ]},
  { id:"schools",   label:"Schools & Children" },
  { id:"research",  label:"Global & Research"  },
  { id:"tools",     label:"Tools", sub:[
    { id:"mealplans", label:"Meal Plan Generator" },
    { id:"workout",   label:"Workout Planner"     },
    { id:"wellness",  label:"Wellness Check"      },
  ]},
  { id:"collaborate", label:"Collaborate" },
  { id:"more", label:"More", sub:[
    { id:"lab",         label:"Wellness Lab" },
    { id:"rewards",     label:"Rewards"      },
    { id:"communities", label:"Communities"  },
    { id:"scanner",     label:"Scan Label"   },
    { id:"partners",    label:"Partners"     },
    { id:"press",       label:"Press"        },
    { id:"faq",         label:"FAQ"          },
    { id:"ai",          label:"Ask AI"       },
  ]},
];

const P1_ALL_LINKS: NavItem[] = [
  { id:"home",        label:"Home"               },
  { id:"approach",    label:"Our Approach"       },
  { id:"schools",     label:"Schools & Children" },
  { id:"research",    label:"Global & Research"  },
  { id:"collaborate", label:"Collaborate With Us"},
  { id:"lab",         label:"Wellness Lab"       },
  { id:"updates",     label:"Updates"            },
  { id:"about",       label:"About Us"           },
  { id:"partners",    label:"Partners"           },
  { id:"press",       label:"Press"              },
  { id:"faq",         label:"FAQ"                },
  { id:"ai",          label:"Ask AI"             },
];

const P2_ALL_LINKS: NavItem[] = [
  { id:"home",        label:"Home"               },
  { id:"approach",    label:"Our Approach"       },
  { id:"schools",     label:"Schools & Children" },
  { id:"research",    label:"Global & Research"  },
  { id:"tools",       label:"Tools"              },
  { id:"mealplans",   label:"Meal Plan Generator"},
  { id:"workout",     label:"Workout Planner"    },
  { id:"wellness",    label:"Wellness Check"     },
  { id:"collaborate", label:"Collaborate With Us"},
  { id:"lab",         label:"Wellness Lab"       },
  { id:"rewards",     label:"Rewards"            },
  { id:"communities", label:"Communities"        },
  { id:"scanner",     label:"Scan Label"         },
  { id:"updates",     label:"Updates"            },
  { id:"about",       label:"About Us"           },
  { id:"partners",    label:"Partners"           },
  { id:"press",       label:"Press"              },
  { id:"faq",         label:"FAQ"                },
  { id:"ai",          label:"Ask AI"             },
];

const PHASE2_PAGES: Page[] = ["tools","mealplans","workout","wellness","scanner","rewards","communities"];

// ─── Data ─────────────────────────────────────────────────────────────────────
const NEWS = [
  { id:1, title:"Festival of Health 2025 Draws Record Attendance",       date:"10 Jul 2026", tag:"Events"    },
  { id:2, title:"New Nutri-Mark Label Now on 500+ Products",             date:"3 Jul 2026",  tag:"Policy"    },
  { id:3, title:"National Health & Nutrition Survey 2024–2025 Released", date:"28 Jun 2026", tag:"Research"  },
  { id:4, title:"25 Strategic Initiatives Launched Across Abu Dhabi",   date:"15 Jun 2026", tag:"Policy"    },
  { id:5, title:"Degayeg Trail Officially Expanded to 18km",            date:"5 Jun 2026",  tag:"Community" },
  { id:6, title:"OOH Healthy Advertising Policy Goes Into Effect",      date:"1 Jun 2026",  tag:"Policy"    },
];
const RESEARCH_PUBS = [
  { id:1, title:"National Health & Nutrition Survey 2024–2025",           cat:"Population Health", date:"Jun 2026", type:"Report"          },
  { id:2, title:"Physical Activity Levels in Abu Dhabi Schools",          cat:"Children & Schools", date:"Apr 2026", type:"Research Paper"  },
  { id:3, title:"Nutri-Mark Label: Impact Assessment Year 1",            cat:"Nutrition",          date:"Mar 2026", type:"Policy Brief"    },
  { id:4, title:"Degayeg Trail Network: Community Participation Study",  cat:"Physical Activity",  date:"Feb 2026", type:"Case Study"      },
  { id:5, title:"Mental Wellbeing in Urban Environments — Abu Dhabi",    cat:"Mental Wellbeing",   date:"Jan 2026", type:"Report"          },
  { id:6, title:"Healthy Cities Index: Abu Dhabi Benchmarking Report",   cat:"Policy",             date:"Dec 2025", type:"Policy Brief"    },
  { id:7, title:"School Nutrition Programme Outcomes 2024",              cat:"Children & Schools", date:"Nov 2025", type:"Research Paper"  },
  { id:8, title:"Childhood Obesity Prevention: A Systems Approach",      cat:"Children & Schools", date:"Oct 2025", type:"Academic Journal" },
];
const PARTNERS = {
  "Government Entities":[
    { name:"Department of Health – Abu Dhabi", role:"Lead health authority" },
    { name:"Abu Dhabi Media Office",            role:"Communications and outreach" },
    { name:"Abu Dhabi Sports Council",          role:"Active lifestyle programmes" },
    { name:"ADEK",                              role:"School health and nutrition" },
  ],
  "Healthcare":[
    { name:"Cleveland Clinic Abu Dhabi", role:"Clinical expertise" },
    { name:"Mubadala Health",            role:"Prevention-first care" },
    { name:"Burjeel Holdings",           role:"Community health services" },
  ],
  "Private Sector":[
    { name:"Carrefour UAE",      role:"Nutri-Mark stocking" },
    { name:"LuLu Hypermarket",   role:"Healthy food labelling" },
    { name:"adidas Middle East", role:"Active lifestyle campaigns" },
  ],
};
const AI_REPLIES: Record<string,string> = {
  "Tell me about Research":"Our Global & Research hub hosts peer-reviewed publications, policy briefs, and case studies across Nutrition, Physical Activity, Children & Schools, Mental Wellbeing, and more.",
  "Tell me about Schools":"The Schools & Children programme tracks participation, awareness, and healthy behaviours among students and families across Abu Dhabi schools.",
  "Tell me about Tools":"Our lightweight wellness tools include a Meal Plan Generator, Workout Planner, and Wellness Check — all available without an account. For deeper personalization, continue in Sahatna.",
  "Tell me about Collaborate":"We partner with universities, research institutions, schools, healthcare organizations, and community groups. Use our Collaborate With Us form to start the conversation.",
};

const WELLNESS_PLANS = {
  Recovery: {
    desc: "Rest, rehydrate, and let your body recover.",
    items: [
      { icon:"💧", cat:"Hydration",  tip:"Drink 2 more glasses of water before 6 PM." },
      { icon:"🚶", cat:"Movement",   tip:"Take a relaxed 15-minute walk this evening." },
      { icon:"🧘", cat:"Stress",     tip:"Take a 5-minute screen-free break this afternoon." },
      { icon:"🌙", cat:"Tonight",    tip:"Try to get to bed 30 minutes earlier." },
    ],
  },
  "Energy Boost": {
    desc: "Energise your body and sharpen your focus.",
    items: [
      { icon:"☀️", cat:"Morning",    tip:"Step outside for 10 minutes of natural light." },
      { icon:"💧", cat:"Hydration",  tip:"Drink a full glass of water before your next meal." },
      { icon:"🥗", cat:"Nutrition",  tip:"Add protein and healthy fats to your next meal." },
      { icon:"🚶", cat:"Movement",   tip:"A 20-minute brisk walk will reset your energy levels." },
    ],
  },
  Balance: {
    desc: "Maintain momentum and feel your best today.",
    items: [
      { icon:"🧘", cat:"Mindfulness",tip:"Try a 5-minute breathing exercise at midday." },
      { icon:"🥗", cat:"Nutrition",  tip:"Eat a balanced meal with plenty of vegetables." },
      { icon:"💧", cat:"Hydration",  tip:"Aim for 8 glasses of water before tonight." },
      { icon:"🚶", cat:"Movement",   tip:"Take a 20-minute walk — even a short one counts." },
    ],
  },
};

// ─── Sahatna sign-in (global event bus) ──────────────────────────────────────
function openSahatnaSignIn() {
  window.dispatchEvent(new CustomEvent("sahatna:open"));
}

function SahatnaSignInModal({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [done,setDone]=useState(false);
  useEffect(()=>{ if (!open){ setDone(false); setEmail(""); setPass(""); } },[open]);
  return (
    <AnimatePresence>
      {open&&(
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
            className="fixed inset-0 z-[80]" style={{ background:"rgba(15,36,24,0.35)" }}/>
          <motion.div initial={{opacity:0,y:16,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:16,scale:0.97}}
            transition={{duration:0.2}} className="fixed z-[90]"
            style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"min(440px,92vw)" }}>
            <div style={{ background:BG, borderRadius:"1.5rem", overflow:"hidden", boxShadow:"0 24px 80px rgba(15,36,24,0.2)", fontFamily:F }}>
              <div className="px-8 py-5 flex items-center justify-between" style={{ background:BG_MINT, borderBottom:`1px solid ${INK_DIM}` }}>
                <div>
                  <div className="text-xs uppercase tracking-[0.15em] mb-0.5" style={{ color:INK_OFF }}>Abu Dhabi Health Platform</div>
                  <div className="text-sm font-bold" style={{ color:INK }}>Connect to Sahatna</div>
                </div>
                <button onClick={onClose} style={{ color:INK_OFF }}><X size={18} strokeWidth={1.5}/></button>
              </div>
              <div className="px-8 py-8">
                {done?(
                  <div className="text-center py-2">
                    <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background:GREEN_BG }}>
                      <span className="text-2xl">✓</span>
                    </div>
                    <div className="text-base font-bold mb-1" style={{ color:INK }}>Connected to Sahatna</div>
                    <p className="text-sm mb-6" style={{ color:INK_OFF }}>Your health data and preferences are now synced.</p>
                    <button onClick={onClose} className="w-full py-3.5 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>Continue</button>
                  </div>
                ):(
                  <form onSubmit={e=>{e.preventDefault();setDone(true);}} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color:INK_OFF }}>Emirates ID or Email</label>
                      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                        className="w-full px-4 py-3 text-sm focus:outline-none rounded-xl"
                        style={{ background:BG_ALT, border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F }}/>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color:INK_OFF }}>Password</label>
                      <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
                        className="w-full px-4 py-3 text-sm focus:outline-none rounded-xl"
                        style={{ background:BG_ALT, border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F }}/>
                    </div>
                    <button className="w-full py-3.5 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>
                      Sign in with Sahatna
                    </button>
                    <p className="text-center text-xs" style={{ color:INK_OFF }}>
                      No account? <button type="button" className="font-semibold" style={{ color:GREEN }}>Register on Sahatna</button>
                    </p>
                    <p className="text-center text-xs" style={{ color:INK_OFF }}>
                      Your health data is protected under UAE data regulations.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────
function Tag({ children, color="green" }: { children:string; color?:"green"|"coral"|"sage"|"phase2" }) {
  const styles = {
    green:  { background:GREEN_BG, color:GREEN   },
    coral:  { background:CORAL_BG, color:CORAL   },
    sage:   { background:BG_SAGE,  color:INK     },
    phase2: { background:"#EDE8F5", color:"#6B47B8" },
  }[color];
  return (
    <span className="inline-block text-xs uppercase tracking-[0.1em] px-2.5 py-1 rounded-full" style={{ fontFamily:F, ...styles }}>
      {children}
    </span>
  );
}

function PageHeader({ title, subtitle, label, imgSrc, bg, children }: {
  title:string; subtitle?:string; label?:string; imgSrc?:string; bg?:string; children?:React.ReactNode;
}) {
  return (
    <div style={{ background: bg??BG_MINT, fontFamily:F }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <Tag color="green">{label||title}</Tag>
          <h1 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.025em", fontSize:"clamp(2rem,4.5vw,3.2rem)", color:INK, lineHeight:1.05, margin:"1rem 0" }}>{title}</h1>
          {subtitle && <p className="text-base leading-relaxed" style={{ color:INK_OFF }}>{subtitle}</p>}
          {children && <div className="mt-5">{children}</div>}
        </div>
        {imgSrc && (
          <div className="h-52 lg:h-64 rounded-2xl overflow-hidden">
            <img src={imgSrc} alt={title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        )}
      </div>
    </div>
  );
}

function SahatnaBanner({ label, desc }: { label:string; desc?:string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background:BG_MINT, border:`1px solid ${INK_DIM}` }}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold" style={{ color:INK }}>{label}</div>
        {desc && <div className="text-xs mt-0.5 leading-relaxed" style={{ color:INK_OFF }}>{desc}</div>}
      </div>
      <button onClick={openSahatnaSignIn} className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full flex-shrink-0"
        style={{ background:GREEN, color:WHITE }}>
        Connect to Sahatna <ExternalLink size={11}/>
      </button>
    </div>
  );
}

function Phase2Gate({ title, desc, phase }: { title:string; desc:string; phase:Phase }) {
  if (phase==="2") return null;
  return (
    <div className="py-16 flex flex-col items-center text-center px-6" style={{ background:BG_ALT, borderRadius:"1.5rem" }}>
      <Tag color="green">Sahatna Feature</Tag>
      <h3 style={{ fontFamily:F, fontWeight:800, fontSize:"1.4rem", color:INK, margin:"1rem 0 0.5rem" }}>{title}</h3>
      <p className="text-sm mb-6 max-w-sm leading-relaxed" style={{ color:INK_OFF }}>{desc}</p>
      <button onClick={openSahatnaSignIn} className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-full"
        style={{ background:GREEN, color:WHITE }}>
        Connect to Sahatna <ExternalLink size={13}/>
      </button>
    </div>
  );
}

// ─── WellnessCoachCard ───────────────────────────────────────────────────────
type CheckKey = "sleep"|"energy"|"stress";
const COACH_QUESTIONS: {key:CheckKey;label:string;opts:string[]}[] = [
  { key:"sleep",  label:"How did you sleep?",       opts:["Poor","Okay","Great"] },
  { key:"energy", label:"How is your energy?",      opts:["Low","Normal","High"]  },
  { key:"stress", label:"How stressed do you feel?",opts:["Low","Medium","High"]  },
];

function WellnessCoachCard({ setPage }: { setPage:(p:Page)=>void }) {
  const [answers, setAnswers] = useState<Partial<Record<CheckKey,string>>>({});
  const [plan, setPlan] = useState<null|{focus:string;desc:string;items:{icon:string;cat:string;tip:string}[]}>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);

  const canGenerate = COACH_QUESTIONS.every(q => answers[q.key]);

  const generate = () => {
    if (!canGenerate) return;
    setGenerating(true);
    setTimeout(() => {
      const { sleep, energy, stress } = answers as Record<CheckKey,string>;
      let focus: keyof typeof WELLNESS_PLANS = "Balance";
      if (sleep === "Poor" || stress === "High") focus = "Recovery";
      else if (energy === "Low") focus = "Energy Boost";
      setPlan({ focus, ...WELLNESS_PLANS[focus] });
      setCompleted(new Set());
      setGenerating(false);
    }, 900);
  };

  const toggle = (i:number) => {
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const reset = () => { setPlan(null); setAnswers({}); setCompleted(new Set()); };

  return (
    <div style={{ background:BG, fontFamily:F }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-10">
        <div className="rounded-3xl overflow-hidden" style={{ border:`1.5px solid ${INK_DIM}`, background:BG }}>

          {/* Header */}
          <div className="px-8 pt-7 pb-6 flex items-center justify-between"
            style={{ background:`linear-gradient(135deg,${BG_MINT} 0%,${BG_CREAM} 100%)`, borderBottom:`1px solid ${INK_DIM}` }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontFamily:F, fontWeight:800, fontSize:"1.2rem", color:INK, letterSpacing:"-0.01em" }}>
                  Today's Wellness Plan ✨
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:INK_OFF }}>A simple plan based on how you're feeling today.</p>
            </div>
            {plan && (
              <button onClick={reset} className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{ background:BG, color:INK_OFF, border:`1px solid ${INK_DIM}` }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background=BG_MINT}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background=BG}>
                New check-in
              </button>
            )}
          </div>

          {/* Body */}
          <AnimatePresence mode="wait">
            {!plan ? (
              <motion.div key="checkin" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-6}} transition={{duration:0.2}}
                className="px-8 py-8">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {COACH_QUESTIONS.map(q => (
                    <div key={q.key}>
                      <p className="text-xs uppercase tracking-[0.12em] mb-3" style={{ color:INK_OFF }}>{q.label}</p>
                      <div className="flex gap-2">
                        {q.opts.map(opt => {
                          const active = answers[q.key] === opt;
                          return (
                            <button key={opt} onClick={() => setAnswers(a=>({...a,[q.key]:opt}))}
                              className="flex-1 py-2 text-xs font-semibold rounded-full transition-all"
                              style={{
                                background: active ? GREEN : BG_ALT,
                                color: active ? WHITE : INK_OFF,
                                border: `1px solid ${active ? GREEN : INK_DIM}`,
                                fontFamily: F,
                              }}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button onClick={generate} disabled={!canGenerate || generating}
                    className="px-7 py-3.5 text-sm font-bold rounded-full transition-all disabled:opacity-40"
                    style={{ background: canGenerate && !generating ? GREEN : BG_SAGE, color: canGenerate && !generating ? WHITE : INK_OFF, fontFamily:F }}>
                    {generating ? (
                      <span className="flex items-center gap-2">
                        <motion.span animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:"linear"}} className="inline-block">⟳</motion.span>
                        Creating your plan…
                      </span>
                    ) : "Create My Plan"}
                  </button>
                  {!canGenerate && (
                    <span className="text-xs" style={{ color:INK_OFF }}>Answer all 3 questions to continue</span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="plan" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35,ease:[0.25,0,0,1]}}
                className="px-8 py-8">

                {/* Focus label */}
                <div className="flex items-center gap-3 mb-6">
                  <Tag color="green">Today's Focus: {plan.focus}</Tag>
                  <span className="text-xs" style={{ color:INK_OFF }}>{plan.desc}</span>
                </div>

                {/* Goal items */}
                <div className="grid md:grid-cols-2 gap-3 mb-7">
                  {plan.items.map((item, i) => {
                    const done = completed.has(i);
                    return (
                      <motion.button key={i} onClick={() => toggle(i)}
                        whileTap={{ scale:0.97 }}
                        className="flex items-start gap-4 p-4 rounded-2xl text-left w-full transition-colors"
                        style={{
                          background: done ? GREEN_BG : BG_ALT,
                          border: `1.5px solid ${done ? GREEN_L : INK_DIM}`,
                          cursor: "pointer",
                        }}>
                        {/* Circle icon */}
                        <motion.div
                          animate={{ background: done ? GREEN : BG, borderColor: done ? GREEN : INK_DIM }}
                          transition={{ duration:0.2 }}
                          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base"
                          style={{ border:`2px solid ${done ? GREEN : INK_DIM}` }}>
                          <AnimatePresence mode="wait">
                            {done ? (
                              <motion.span key="check" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
                                transition={{duration:0.18,ease:"backOut"}} style={{ color:WHITE, fontSize:"13px", lineHeight:1 }}>✓</motion.span>
                            ) : (
                              <motion.span key="emoji" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
                                transition={{duration:0.15}}>{item.icon}</motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-xs uppercase tracking-[0.1em] mb-0.5" style={{ color: done ? GREEN : INK_OFF }}>{item.cat}</div>
                          <div className="text-sm leading-snug" style={{
                            color: done ? GREEN : INK,
                            opacity: done ? 0.65 : 1,
                            textDecoration: done ? "line-through" : "none",
                            transition: "all 200ms",
                            fontFamily: F,
                          }}>{item.tip}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Progress + Ask AI */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-5" style={{ borderTop:`1px solid ${INK_DIM}` }}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 items-center">
                      {plan.items.map((_,i) => (
                        <motion.div key={i}
                          animate={{ background: completed.has(i) ? GREEN : INK_DIM, scale: completed.has(i) ? 1.25 : 1 }}
                          transition={{ duration:0.25, ease:"backOut" }}
                          style={{ width:8, height:8, borderRadius:4 }}/>
                      ))}
                    </div>
                    <span className="text-xs" style={{ color:INK_OFF }}>
                      Today: <strong style={{ color:INK }}>{completed.size}</strong> of {plan.items.length} goals completed
                    </span>
                  </div>
                  <button onClick={() => setPage("ai")}
                    className="text-xs font-semibold flex items-center gap-1.5 transition-opacity"
                    style={{ color:GREEN, fontFamily:F }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="0.75"}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"}>
                    Ask AI About My Plan <ArrowUpRight size={12}/>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── PhaseToggle ──────────────────────────────────────────────────────────────
function PhaseToggle({ phase, setPhase }: { phase:Phase; setPhase:(p:Phase)=>void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-center h-9 text-xs"
      style={{ background:BG_MINT, borderBottom:`1px solid ${INK_DIM}`, fontFamily:F }}>
      <span className="mr-6 uppercase tracking-[0.18em]" style={{ color:INK_OFF }}>Prototype</span>
      {(["1","2"] as Phase[]).map((p,i)=>(
        <span key={p} className="flex items-center">
          {i>0 && <span className="mx-4" style={{ color:INK_DIM }}>/</span>}
          <button onClick={()=>setPhase(p)} className="uppercase tracking-[0.12em] transition-all"
            style={{ color:phase===p?INK:INK_OFF, fontWeight:phase===p?700:400 }}>
            Phase {p}{p==="1"?" — Initial Launch":" — Full Vision"}
          </button>
        </span>
      ))}
    </div>
  );
}

// ─── SiteNav ─────────────────────────────────────────────────────────────────
function SiteNav({ active, setPage, onDrawer, phase }: {
  active:string; setPage:(p:Page)=>void; onDrawer:()=>void; phase:Phase;
}) {
  const [openDrop,setOpenDrop]=useState<string|null>(null);
  const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const TOP_LINKS = phase==="1" ? P1_TOP_LINKS : P2_TOP_LINKS;
  const left  = TOP_LINKS.slice(0,3);
  const right = TOP_LINKS.slice(3);

  const openMenu  = (id:string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpenDrop(id); };
  const closeMenu = ()          => { closeTimer.current = setTimeout(()=>setOpenDrop(null), 120); };

  const renderLink = (l:NavItem, side:"left"|"right") => {
    const isActive = active===l.id || l.sub?.some(s=>s.id===active);
    return (
      <div key={l.id} className="relative"
        onMouseEnter={()=>l.sub ? openMenu(l.id) : undefined}
        onMouseLeave={closeMenu}>
        <button
          onClick={()=>{ if (l.sub){ openDrop===l.id ? setOpenDrop(null) : openMenu(l.id); } else { setPage(l.id as Page); setOpenDrop(null); }}}
          className="flex items-center gap-1 text-xs uppercase tracking-[0.13em] transition-colors"
          style={{ color:isActive?INK:INK_OFF, fontWeight:isActive?700:400,
            borderBottom:`2px solid ${isActive?GREEN:"transparent"}`, paddingBottom:"2px" }}>
          {l.label}
          {l.sub && <ChevronDown size={10} style={{ opacity:0.5, transform:openDrop===l.id?"rotate(180deg)":"none", transition:"transform .18s" }}/>}
        </button>
        <AnimatePresence>
          {l.sub && openDrop===l.id && (
            <motion.div
              initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.14}}
              className="absolute top-full z-50"
              style={{ [side==="right"?"right":"left"]:0, paddingTop:"6px" }}
              onMouseEnter={()=>openMenu(l.id)}
              onMouseLeave={closeMenu}>
              <div style={{ background:BG, border:`1px solid ${INK_DIM}`, boxShadow:"0 8px 32px rgba(15,36,24,0.12)", minWidth:"210px", borderRadius:"10px", overflow:"hidden" }}>
                {l.sub.map((s,i)=>(
                  <button key={s.id} onClick={()=>{ setPage(s.id as Page); setOpenDrop(null); }}
                    className="block w-full text-left px-4 py-3 text-xs uppercase tracking-[0.12em] transition-colors"
                    style={{ color:active===s.id?GREEN:INK_OFF, borderBottom:i<(l.sub!.length-1)?`1px solid ${INK_DIM}`:"none",
                      background:"transparent", fontWeight:active===s.id?700:400 }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background=BG_ALT}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="transparent"}>
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header className="sticky top-9 z-40" style={{ height:"52px", background:BG, borderBottom:`1px solid ${INK_DIM}`, fontFamily:F }}>
      <div className="h-full flex items-center px-6 lg:px-10">
        {/* Left — grows to fill half */}
        <div className="flex-1 flex items-center gap-6 min-w-0">
          <button onClick={onDrawer} style={{ color:INK_OFF }} className="flex-shrink-0"><Menu size={17} strokeWidth={1.8}/></button>
          <div className="hidden lg:flex items-center gap-5">
            {left.map(l=>renderLink(l,"left"))}
          </div>
        </div>
        {/* Center — logo never displaced */}
        <button onClick={()=>setPage("home")} className="flex-shrink-0 px-4">
          <img src={LOGO_URL} alt="Healthy Living Abu Dhabi" className="h-7 object-contain"/>
        </button>
        {/* Right — grows to fill half */}
        <div className="flex-1 flex items-center justify-end gap-5 min-w-0">
          <div className="hidden lg:flex items-center gap-5">
            {right.map(l=>renderLink(l,"right"))}
          </div>
          <button onClick={()=>setPage("ai")} className="hidden lg:flex items-center gap-1.5 text-xs uppercase tracking-[0.13em] px-4 py-2 rounded-full flex-shrink-0"
            style={{ background:GREEN, color:WHITE, fontWeight:600 }}>
            Ask AI <MessageCircle size={11}/>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── SiteDrawer ───────────────────────────────────────────────────────────────
function SiteDrawer({ open, onClose, active, setPage, phase }: {
  open:boolean; onClose:()=>void; active:string; setPage:(p:Page)=>void; phase:Phase;
}) {
  const ALL_LINKS = phase==="1" ? P1_ALL_LINKS : P2_ALL_LINKS;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
            className="fixed inset-0 z-[55]" style={{ background:"rgba(15,36,24,0.18)" }}/>
          <motion.div initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}}
            transition={{type:"tween",duration:0.3,ease:[0.25,0,0,1]}}
            className="fixed top-0 left-0 bottom-0 z-[60] flex flex-col"
            style={{ width:"min(380px,88vw)", background:BG, borderRight:`1px solid ${INK_DIM}`, fontFamily:F }}>
            <div className="flex items-center justify-between px-8 h-20 flex-shrink-0" style={{ borderBottom:`1px solid ${INK_DIM}` }}>
              <img src={LOGO_URL} alt="Healthy Living" className="h-7 object-contain"/>
              <button onClick={onClose} style={{ color:INK_OFF }}><X size={20} strokeWidth={1.5}/></button>
            </div>
            <nav className="flex-1 overflow-y-auto px-8 py-6">
              {ALL_LINKS.filter(l=>l.id!=="home").map((l,i)=>(
                <motion.button key={l.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:0.04+i*0.03}}
                  onClick={()=>{ setPage(l.id as Page); onClose(); }}
                  className="block w-full text-left py-4"
                  style={{ borderBottom:`1px solid ${INK_DIM}` }}>
                  <span style={{ fontSize:"clamp(1rem,2.5vw,1.4rem)", fontWeight:700, letterSpacing:"-0.01em",
                    color:active===l.id?GREEN:INK, transition:"color 150ms" }}>
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </nav>
            <div className="px-8 py-5 flex-shrink-0" style={{ borderTop:`1px solid ${INK_DIM}`, background:BG_ALT }}>
              <button className="w-full py-3 text-sm font-bold rounded-full flex items-center justify-center gap-2"
                style={{ background:GREEN, color:WHITE }}>
                Open Sahatna <ExternalLink size={13}/>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── SiteFooter ───────────────────────────────────────────────────────────────
function SiteFooter({ setPage }: { setPage:(p:Page)=>void }) {
  const phase = useContext(PhaseCtx);
  const footerCols = phase==="1"
    ? [
        { title:"Explore", links:[["approach","Our Approach"],["schools","Schools & Children"],["research","Global & Research"],["collaborate","Collaborate With Us"]] },
        { title:"Info",    links:[["updates","Updates"],["partners","Partners"],["press","Press"],["faq","FAQ"]] },
      ]
    : [
        { title:"Explore", links:[["approach","Our Approach"],["schools","Schools & Children"],["research","Global & Research"],["collaborate","Collaborate With Us"]] },
        { title:"Tools",   links:[["mealplans","Meal Plan Generator"],["workout","Workout Planner"],["wellness","Wellness Check"],["ai","Ask AI"]] },
        { title:"Info",    links:[["updates","Updates"],["partners","Partners"],["press","Press"],["faq","FAQ"]] },
      ];
  return (
    <footer style={{ background:BG_ALT, borderTop:`1px solid ${INK_DIM}`, fontFamily:F }}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-12 py-16 grid gap-12 ${phase==="1"?"md:grid-cols-3":"md:grid-cols-4"}`}>
        <div>
          <img src={LOGO_URL} alt="Healthy Living" className="h-8 object-contain mb-5"/>
          <p className="text-sm leading-relaxed mb-6" style={{ color:INK_OFF }}>Making healthy living the easy choice for all Abu Dhabi residents.</p>
          <button onClick={openSahatnaSignIn} className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full"
            style={{ background:GREEN, color:WHITE }}>Connect to Sahatna <ExternalLink size={11}/></button>
        </div>
        {footerCols.map(col=>(
          <div key={col.title}>
            <div className="text-xs uppercase tracking-[0.15em] mb-5" style={{ color:INK_OFF }}>{col.title}</div>
            {col.links.map(([id,label])=>(
              <button key={label} onClick={()=>setPage(id as Page)} className="block text-sm mb-3 text-left"
                style={{ color:INK_OFF, transition:"color 150ms" }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color=INK}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color=INK_OFF}>{label}</button>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-8 pt-6 flex flex-wrap gap-4 items-center justify-between"
        style={{ borderTop:`1px solid ${INK_DIM}` }}>
        <span className="text-xs" style={{ color:INK_OFF }}>© 2026 Healthy Living Abu Dhabi. All rights reserved.</span>
        <span className="text-xs uppercase tracking-[0.12em]" style={{ color:INK_OFF }}>Abu Dhabi Government Initiative</span>
      </div>
    </footer>
  );
}

// ─── AIChatBubble ─────────────────────────────────────────────────────────────
function AIChatBubble() {
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState<{role:"user"|"ai";text:string}[]>([{role:"ai",text:"Hello. I'm the Healthy Living assistant. Ask me about research, tools, schools, or how to collaborate."}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const suggestions=["Tell me about Research","Tell me about Schools","Tell me about Tools","Tell me about Collaborate"];
  const send=(text:string)=>{
    if (!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]); setInput(""); setLoading(true);
    const reply=AI_REPLIES[text]??"For personalised guidance, we recommend consulting a healthcare professional or opening Sahatna.";
    setTimeout(()=>{ setMsgs(m=>[...m,{role:"ai",text:reply}]); setLoading(false); },1300);
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:10,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:0.97}}
            className="fixed bottom-16 right-5 z-50 w-80 flex flex-col rounded-2xl overflow-hidden"
            style={{ maxHeight:"400px", background:BG, border:`1px solid ${INK_DIM}`, boxShadow:"0 16px 48px rgba(15,36,24,0.12)" }}>
            <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ background:BG_MINT, borderBottom:`1px solid ${INK_DIM}` }}>
              <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color:INK, fontFamily:F }}>Healthy Living AI</span>
              <button onClick={()=>setOpen(false)} style={{ color:INK_OFF }}><X size={14}/></button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ minHeight:0 }}>
              {msgs.map((m,i)=>(
                <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                  <div className="max-w-[82%] px-3 py-2 text-xs leading-relaxed rounded-xl"
                    style={m.role==="user"?{background:GREEN,color:WHITE}:{background:BG_ALT,color:INK,border:`1px solid ${INK_DIM}`}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="px-3 py-2 text-xs rounded-xl" style={{ background:BG_ALT,color:INK_OFF }}>Thinking…</div></div>}
            </div>
            {msgs.length<=1 && (
              <div className="px-3 pb-3 flex flex-col gap-1.5 flex-shrink-0">
                {suggestions.map(s=>(
                  <button key={s} onClick={()=>send(s)} className="text-left text-xs px-3 py-2 rounded-lg"
                    style={{ border:`1px solid ${INK_DIM}`, color:INK_OFF }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background=BG_ALT}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="transparent"}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0" style={{ borderTop:`1px solid ${INK_DIM}` }}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
                placeholder="Ask anything…" className="flex-1 text-xs bg-transparent focus:outline-none" style={{ color:INK,fontFamily:F }}/>
              <button onClick={()=>send(input)} disabled={!input.trim()} className="w-7 h-7 flex items-center justify-center disabled:opacity-30 rounded-lg"
                style={{ background:GREEN }}><Send size={12} color={WHITE}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={()=>setOpen(o=>!o)} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-full"
        style={{ background:open?BG:GREEN, color:open?INK:WHITE, border:`1px solid ${open?INK_DIM:GREEN}`, fontFamily:F,
          boxShadow:"0 4px 20px rgba(42,138,88,0.25)", transition:"all 200ms" }}>
        {open?<X size={14}/>:<MessageCircle size={14}/>}{!open&&"Ask AI"}
      </button>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════════

function HomePage({ setPage, phase }: { setPage:(p:Page)=>void; phase:Phase }) {
  const audienceCTAs = [
    { icon:"👤", title:"Individuals",   desc:"Explore tools, events and lifestyle guidance.",  cta:"Explore Healthy Living", page:"approach"   },
    { icon:"👨‍👩‍👧", title:"Families",      desc:"Healthy habits and schools programmes.",         cta:"Schools & Children",     page:"schools"    },
    { icon:"🔬", title:"Researchers",   desc:"Publications, data, and collaboration.",          cta:"Explore Research",       page:"research"   },
    { icon:"🤝", title:"Organisations", desc:"Partner, collaborate or contribute.",             cta:"Collaborate With Us",    page:"collaborate"},
  ];
  return (
    <div style={{ fontFamily:F }}>
      {/* HERO */}
      <div style={{ background:`linear-gradient(135deg, ${BG_MINT} 0%, ${BG_ALT} 55%, ${BG_PEACH} 100%)` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-36px-52px)] py-16">
          <div>
            <Tag color="green">Abu Dhabi Government Initiative</Tag>
            <h1 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.03em", fontSize:"clamp(2.4rem,5.5vw,4.8rem)", color:INK, lineHeight:0.98, maxWidth:"16ch", margin:"1.5rem 0" }}>
              Discover. Learn.<br/><span style={{ color:GREEN }}>Live healthier.</span>
            </h1>
            <p className="text-base mb-8 max-w-md leading-relaxed" style={{ color:INK_OFF }}>
              Abu Dhabi's government-led ecosystem empowering individuals, families, schools, and researchers to make healthy living the easy choice.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={()=>setPage(phase==="2"?"tools":"approach")} className="px-6 py-3.5 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>
                {phase==="2"?"Create a Wellness Plan":"Explore Healthy Living"}
              </button>
              <button onClick={()=>setPage("research")} className="px-6 py-3.5 text-sm font-semibold rounded-full"
                style={{ border:`1px solid ${INK_DIM}`, color:INK, background:BG }}>
                Explore Research
              </button>
            </div>
            <div className="mt-6">
              <SahatnaBanner label="Personal health tracking, device sync & health records" desc="Continue your health journey in Sahatna"/>
            </div>
          </div>
          <div className="relative h-72 lg:h-[58vh] rounded-3xl overflow-hidden shadow-xl">
            <img src={IMG_HERO} alt="Healthy Living Abu Dhabi" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }}/>
          </div>
        </div>
      </div>

      {/* WELLNESS COACH */}
      <WellnessCoachCard setPage={setPage}/>

      {/* AUDIENCE CTAs */}
      <div className="py-20 px-6 lg:px-20" style={{ background:BG }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.18em] mb-8" style={{ color:INK_OFF }}>Who is this for?</p>
          <div className="grid md:grid-cols-4 gap-5">
            {audienceCTAs.map(a=>(
              <button key={a.title} onClick={()=>setPage(a.page as Page)}
                className="p-6 text-left rounded-2xl transition-all" style={{ background:BG_ALT }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_MINT;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_ALT;}}>
                <div className="text-2xl mb-3">{a.icon}</div>
                <div className="text-sm font-bold mb-1" style={{ color:INK }}>{a.title}</div>
                <div className="text-xs leading-relaxed mb-4" style={{ color:INK_OFF }}>{a.desc}</div>
                <div className="text-xs font-semibold flex items-center gap-1" style={{ color:GREEN }}>{a.cta}<ArrowRight size={11}/></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLS STRIP — Phase 2 only */}
      {phase==="2" && (
        <div className="py-20 px-6 lg:px-20" style={{ background:BG_MINT }}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Tag color="green">Lightweight Wellness Tools</Tag>
              <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.025em", fontSize:"clamp(1.8rem,4vw,3rem)", color:INK, lineHeight:1.1, margin:"1.25rem 0" }}>
                Useful tools.<br/>No sign-up required.
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color:INK_OFF, maxWidth:"40ch" }}>
                Generate a personalised meal plan, a workout schedule, or a wellness check — then continue tracking in Sahatna.
              </p>
              <div className="flex gap-3 flex-wrap">
                {[["mealplans","Meal Plan"],["workout","Workout"],["wellness","Wellness Check"]].map(([p,l])=>(
                  <button key={p} onClick={()=>setPage(p as Page)} className="px-4 py-2.5 text-xs font-bold rounded-full"
                    style={{ background:BG, color:INK, border:`1px solid ${INK_DIM}` }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-56 lg:h-72 rounded-3xl overflow-hidden shadow-lg">
              <img src={IMG_FOOD} alt="Healthy food" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE LIFESTYLES */}
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-10 items-center py-20">
          <div className="relative h-64 lg:h-[52vh] rounded-3xl overflow-hidden shadow-lg">
            <img src={IMG_RUNNER} alt="Active lifestyles" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
          <div>
            <Tag color="sage">Active Lifestyles</Tag>
            <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.025em", fontSize:"clamp(2rem,4vw,3rem)", color:INK, lineHeight:1, margin:"1.25rem 0" }}>
              Move more.<br/>Live longer.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color:INK_OFF, maxWidth:"40ch" }}>
              From the Degayeg trail network to free park fitness classes and cycling events — movement is built into Abu Dhabi life.
            </p>
            <button onClick={()=>setPage("approach")} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color:GREEN }}>
              Our Approach <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* SCHOOLS & RESEARCH SPLIT */}
      <div className="py-20 px-6 lg:px-20" style={{ background:BG_PEACH }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <button onClick={()=>setPage("schools")} className="p-8 rounded-2xl text-left" style={{ background:BG }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_MINT;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG;}}>
            <Tag color="green">Schools & Children</Tag>
            <h3 style={{ fontFamily:F, fontWeight:800, fontSize:"1.5rem", color:INK, margin:"1rem 0 0.5rem" }}>Healthier futures start in school.</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color:INK_OFF }}>Tracking participation, awareness, and healthy behaviours across Abu Dhabi schools and families.</p>
            <div className="text-sm font-semibold flex items-center gap-1" style={{ color:GREEN }}>Explore <ArrowRight size={13}/></div>
          </button>
          <button onClick={()=>setPage("research")} className="p-8 rounded-2xl text-left" style={{ background:BG }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_MINT;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG;}}>
            <Tag color="sage">Global & Research</Tag>
            <h3 style={{ fontFamily:F, fontWeight:800, fontSize:"1.5rem", color:INK, margin:"1rem 0 0.5rem" }}>Setting a global benchmark.</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color:INK_OFF }}>Publications, policy briefs, and research across nutrition, physical activity, public health, and more.</p>
            <div className="text-sm font-semibold flex items-center gap-1" style={{ color:GREEN }}>Explore Research <ArrowRight size={13}/></div>
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="py-20 px-6 lg:px-20" style={{ background:BG_ALT }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[["120,000+","Residents engaged","green"],["500+","Nutri-Mark products","sage"],["25","Strategic initiatives","coral"],["8","Research categories","sage"]].map(([n,l,c])=>(
            <div key={l} className="p-6 rounded-2xl" style={{ background:c==="green"?GREEN_BG:c==="coral"?CORAL_BG:BG_SAGE }}>
              <div style={{ fontFamily:F, fontWeight:800, fontSize:"clamp(1.6rem,3vw,2.4rem)", color:c==="green"?GREEN:c==="coral"?CORAL:INK, marginBottom:"0.4rem" }}>{n}</div>
              <div className="text-xs uppercase tracking-[0.1em]" style={{ color:INK_OFF }}>{l}</div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 max-w-7xl mx-auto" style={{ color:INK_OFF }}>Figures are illustrative sample data.</p>
      </div>

      {/* LATEST UPDATES */}
      <div className="py-20 px-6 lg:px-20" style={{ background:BG }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <h3 style={{ fontFamily:F, fontWeight:700, fontSize:"1.2rem", color:INK }}>Latest Updates</h3>
            <button onClick={()=>setPage("updates")} className="text-xs font-semibold flex items-center gap-1.5" style={{ color:GREEN }}>
              View all <ArrowRight size={12}/>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {NEWS.slice(0,4).map(n=>(
              <div key={n.id} className="p-5 rounded-2xl cursor-pointer" style={{ background:BG_ALT }}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background=BG_MINT}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=BG_ALT}>
                <div className="flex items-center justify-between mb-3">
                  <Tag color="green">{n.tag}</Tag>
                  <span className="text-xs" style={{ color:INK_OFF }}>{n.date}</span>
                </div>
                <div className="text-sm font-semibold" style={{ color:INK }}>{n.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function OurApproachPage({ setPage }: { setPage:(p:Page)=>void }) {
  const [openIdx,setOpenIdx]=useState<number|null>(0);
  const items=[
    { title:"Active Lifestyles", body:"We support walking trails, cycling paths, parks, sports facilities and outdoor fitness zones across Abu Dhabi — making movement part of everyday life. From the Degayeg trail network to community park activation, our infrastructure investments reduce friction between intention and action." },
    { title:"Healthy Eating",    body:"From the Nutri-Mark front-of-pack label to community farmers markets and school nutrition programmes, we help residents choose better food more easily across 500+ participating products." },
    { title:"Prevention-First",  body:"We invest in health screening, early intervention, and public awareness so residents can manage their long-term health proactively — before illness develops." },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Our Approach" label="Healthy Living" imgSrc={IMG_RUNNER} bg={BG_MINT}
        subtitle="We shape systems, policies and infrastructure so that healthy choices are built into everyday life across Abu Dhabi."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 space-y-16">
          <div>
            {items.map((it,i)=>(
              <div key={it.title} style={{ borderTop:`1px solid ${INK_DIM}` }}>
                <button onClick={()=>setOpenIdx(openIdx===i?null:i)} className="w-full flex items-center justify-between py-6 text-left">
                  <span style={{ fontSize:"clamp(1.2rem,2.5vw,1.6rem)", fontWeight:700, color:INK, letterSpacing:"-0.01em" }}>{it.title}</span>
                  <ChevronDown size={16} style={{ color:INK_OFF, transform:openIdx===i?"rotate(180deg)":"none", transition:"transform .2s", flexShrink:0, marginLeft:16 }}/>
                </button>
                <AnimatePresence>
                  {openIdx===i && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                      <p className="pb-8 text-base leading-relaxed max-w-3xl" style={{ color:INK_OFF }}>{it.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${INK_DIM}` }}/>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {["Understand","Design","Partner","Measure"].map((s,i)=>(
              <div key={s} className="p-6 rounded-2xl" style={{ background:BG_ALT }}>
                <div className="text-3xl font-bold mb-4" style={{ color:BG_SAGE }}>0{i+1}</div>
                <div style={{ fontSize:"1.05rem", fontWeight:700, color:INK }}>{s}</div>
              </div>
            ))}
          </div>
          <div className="p-8 rounded-2xl" style={{ background:BG_MINT }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.02em", fontSize:"clamp(1.6rem,3vw,2.4rem)", color:INK, marginBottom:"1rem" }}>
                  Healthy Living complements Sahatna.
                </h2>
                <p className="text-sm leading-relaxed" style={{ color:INK_OFF }}>This website focuses on Discovery, Education, and Engagement. For personal health management, tracking, and device integrations, continue in Sahatna.</p>
              </div>
              <div>
                <div className="p-5 rounded-xl mb-3" style={{ background:BG }}>
                  <div className="text-xs uppercase tracking-[0.12em] font-bold mb-2" style={{ color:GREEN }}>Healthy Living</div>
                  <div className="text-xs" style={{ color:INK_OFF }}>Discover → Learn → Generate → Participate → Collaborate</div>
                </div>
                <div className="p-5 rounded-xl" style={{ background:BG }}>
                  <div className="text-xs uppercase tracking-[0.12em] font-bold mb-2" style={{ color:INK_OFF }}>Sahatna</div>
                  <div className="text-xs" style={{ color:INK_OFF }}>Personalize → Track → Monitor → Manage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function SchoolsPage({ setPage }: { setPage:(p:Page)=>void }) {
  const impacts=[
    { n:"42,000+", l:"Students reached", c:"green"  },
    { n:"380",     l:"Schools engaged",  c:"sage"   },
    { n:"94%",     l:"Awareness rate",   c:"green"  },
    { n:"68%",     l:"Behaviour change", c:"coral"  },
  ];
  const areas=[
    { title:"Students",  items:["Participation","Awareness","Healthy behaviours","Activity levels","Programme feedback"] },
    { title:"Families",  items:["Parent engagement","Family participation","Awareness","Healthy habits at home","Family needs"] },
    { title:"Schools",   items:["Programme participation","School initiatives","Engagement levels","Activities delivered","School feedback"] },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Schools & Children" label="Schools & Children" imgSrc={IMG_CORNICHE} bg={BG_MINT}
        subtitle="Tracking participation, awareness, and healthy behaviours among students and families across Abu Dhabi."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 space-y-16">
          {/* Impact stats */}
          <div>
            <p className="text-xs uppercase tracking-[0.18em] mb-6" style={{ color:INK_OFF }}>Reach & Impact</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {impacts.map(s=>(
                <div key={s.l} className="p-6 rounded-2xl" style={{ background:s.c==="green"?GREEN_BG:s.c==="coral"?CORAL_BG:BG_ALT }}>
                  <div style={{ fontFamily:F, fontWeight:800, fontSize:"clamp(1.4rem,3vw,2rem)", color:s.c==="green"?GREEN:s.c==="coral"?CORAL:INK, marginBottom:"0.4rem" }}>{s.n}</div>
                  <div className="text-xs uppercase tracking-[0.1em]" style={{ color:INK_OFF }}>{s.l}</div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color:INK_OFF }}>Figures are illustrative sample data.</p>
          </div>

          {/* Engagement areas */}
          <div>
            <p className="text-xs uppercase tracking-[0.18em] mb-6" style={{ color:INK_OFF }}>Areas of Engagement</p>
            <div className="grid md:grid-cols-3 gap-5">
              {areas.map(a=>(
                <div key={a.title} className="p-6 rounded-2xl" style={{ background:BG_ALT }}>
                  <div className="text-sm font-bold mb-4" style={{ color:INK }}>{a.title}</div>
                  {a.items.map(item=>(
                    <div key={item} className="flex items-center gap-2 py-2" style={{ borderBottom:`1px solid ${INK_DIM}` }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:GREEN_L }}/>
                      <span className="text-xs" style={{ color:INK_OFF }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Influence & Mobilization */}
          <div style={{ background:BG_PEACH }} className="p-8 rounded-2xl">
            <Tag color="coral">Influence & Mobilization</Tag>
            <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.02em", fontSize:"clamp(1.4rem,3vw,2.2rem)", color:INK, margin:"1rem 0" }}>
              Are we changing behaviours?
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color:INK_OFF }}>
              A key objective is understanding whether our programmes are influencing children's behaviours, encouraging healthier choices, and mobilising families and schools to participate.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {["Influencing children's healthy behaviours","Encouraging healthier food choices","Mobilising students to participate","Mobilising families to engage at home","Mobilising schools to adopt new programmes","Creating broader community participation"].map(item=>(
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:BG }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:CORAL }}/>
                  <span className="text-xs" style={{ color:INK }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SahatnaBanner label="Deeper school analytics and dashboards" desc="Advanced tracking and school data dashboards are available in Phase 2."/>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button onClick={()=>setPage("collaborate")} className="p-6 rounded-2xl text-left" style={{ background:BG_MINT }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_SAGE;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_MINT;}}>
              <div className="text-sm font-bold mb-1" style={{ color:INK }}>Is your school involved?</div>
              <div className="text-xs mb-3" style={{ color:INK_OFF }}>Contact us to register your school or collaborate on the programme.</div>
              <div className="text-xs font-semibold flex items-center gap-1" style={{ color:GREEN }}>Collaborate With Us <ArrowRight size={11}/></div>
            </button>
            <button onClick={()=>setPage("research")} className="p-6 rounded-2xl text-left" style={{ background:BG_ALT }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_MINT;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_ALT;}}>
              <div className="text-sm font-bold mb-1" style={{ color:INK }}>Schools research</div>
              <div className="text-xs mb-3" style={{ color:INK_OFF }}>Browse published research on children, nutrition, and physical activity.</div>
              <div className="text-xs font-semibold flex items-center gap-1" style={{ color:GREEN }}>View Research <ArrowRight size={11}/></div>
            </button>
          </div>
        </div>
      </div>
      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function ResearchPage({ setPage }: { setPage:(p:Page)=>void }) {
  const [cat,setCat]=useState("All"); const [subscribed,setSubscribed]=useState(false); const [email,setEmail]=useState("");
  const cats=["All","Nutrition","Physical Activity","Children & Schools","Mental Wellbeing","Policy","Public Health","Healthy Cities","Population Health"];
  const filtered=cat==="All"?RESEARCH_PUBS:RESEARCH_PUBS.filter(r=>r.cat===cat);
  return (
    <div style={{ fontFamily:F }}>
      <div style={{ background:`linear-gradient(135deg, ${BG_CREAM} 0%, ${BG_ALT} 100%)` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Tag color="sage">Global & Research</Tag>
            <h1 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.03em", fontSize:"clamp(2rem,5vw,4rem)", color:INK, lineHeight:1, margin:"1.25rem 0" }}>
              Setting a global benchmark for progressive health policy.
            </h1>
            <p className="text-base leading-relaxed" style={{ color:INK_OFF, maxWidth:"42ch" }}>
              Peer-reviewed publications, policy briefs, and case studies across nutrition, physical activity, public health, and beyond.
            </p>
          </div>
          <div className="relative h-48 lg:h-72 rounded-3xl overflow-hidden">
            <img src={IMG_RECT2} alt="Research" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        </div>
      </div>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div>
            <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color:INK_OFF }}>Topics</p>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className="block w-full text-left py-2.5 text-sm"
                style={{ color:cat===c?GREEN:INK_OFF, fontWeight:cat===c?700:400, borderBottom:`1px solid ${INK_DIM}` }}>
                {c}
              </button>
            ))}
            <div className="mt-8 p-5 rounded-2xl" style={{ background:BG_ALT }}>
              <p className="text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color:INK }}>Stay Updated</p>
              <p className="text-xs mb-4 leading-relaxed" style={{ color:INK_OFF }}>New publications and research alerts.</p>
              {subscribed ? (
                <p className="text-xs font-bold" style={{ color:GREEN }}>You're subscribed.</p>
              ) : (
                <>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                    className="w-full px-3 py-2 text-xs rounded-lg mb-2 focus:outline-none"
                    style={{ border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F, background:BG }}/>
                  <button onClick={()=>subscribed||setSubscribed(true)} className="w-full py-2 text-xs font-bold rounded-lg"
                    style={{ background:GREEN, color:WHITE }}>Subscribe</button>
                </>
              )}
            </div>
          </div>
          {/* Publications */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-[0.15em]" style={{ color:INK_OFF }}>{filtered.length} Publication{filtered.length!==1?"s":""}</p>
            </div>
            <AnimatePresence mode="popLayout">
              {filtered.map(r=>(
                <motion.div key={r.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="flex items-start gap-4 py-5 cursor-pointer" style={{ borderBottom:`1px solid ${INK_DIM}` }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Tag color="sage">{r.cat}</Tag>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background:BG_ALT, color:INK_OFF }}>{r.type}</span>
                    </div>
                    <div className="text-sm font-semibold mb-1" style={{ color:INK }}>{r.title}</div>
                    <div className="text-xs" style={{ color:INK_OFF }}>{r.date}</div>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{ background:BG_ALT, color:INK_OFF }}><Download size={11}/> PDF</button>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="pt-10">
              <button onClick={()=>setPage("collaborate")} className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color:GREEN }}>Contribute research <ArrowUpRight size={13}/></button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-20 px-6" style={{ background:BG_PEACH }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.02em", fontSize:"clamp(1.8rem,4vw,2.8rem)", color:INK, marginBottom:"1rem" }}>
            Collaborate on research with us
          </h2>
          <p className="text-sm mb-6" style={{ color:INK_OFF }}>Universities, researchers, and healthcare institutions are welcome to contribute.</p>
          <button onClick={()=>setPage("collaborate")} className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full"
            style={{ background:GREEN, color:WHITE, fontWeight:600 }}>Collaborate With Us <ArrowUpRight size={13}/></button>
        </div>
      </div>
      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function ToolsPage({ setPage }: { setPage:(p:Page)=>void }) {
  const tools=[
    { id:"mealplans", icon:"🥗", title:"Meal Plan Generator", desc:"Enter your goal, dietary preference, and lifestyle. Get a personalised day's meal plan with macros — no account needed.", phase:"1", cta:"Generate a Meal Plan" },
    { id:"workout",   icon:"🏋️", title:"Workout Planner",     desc:"Share your fitness goal, experience level, and available days. Receive a weekly workout schedule with exercises and guidance.", phase:"1", cta:"Build a Workout Plan" },
    { id:"wellness",  icon:"✨",  title:"Wellness Check",      desc:"Answer a short set of questions and receive general recommendations across movement, nutrition, sleep, and wellbeing.", phase:"1", cta:"Start Wellness Check" },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Wellness Tools" label="Tools" bg={BG_MINT}
        subtitle="Lightweight, educational tools. No account or sign-up required. For deeper personalization, continue in Sahatna."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {tools.map(t=>(
              <div key={t.id} className="flex flex-col p-6 rounded-2xl" style={{ background:BG_ALT }}>
                <div className="text-3xl mb-4">{t.icon}</div>
                <Tag color="green">Phase {t.phase}</Tag>
                <div style={{ fontFamily:F, fontWeight:700, fontSize:"1.1rem", color:INK, margin:"0.75rem 0 0.5rem" }}>{t.title}</div>
                <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color:INK_OFF }}>{t.desc}</p>
                <button onClick={()=>setPage(t.id as Page)} className="py-3 text-sm font-bold rounded-full"
                  style={{ background:GREEN, color:WHITE }}>{t.cta}</button>
              </div>
            ))}
          </div>
          <SahatnaBanner label="Personalized tracking & saved plans in Sahatna"
            desc="Continue your wellness journey with full personalization, progress tracking, and health history."/>
        </div>
      </div>
      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function MealPlanPage() {
  const [step,setStep]=useState<"form"|"result">("form"); const [loading,setLoading]=useState(false);
  const [activity,setActivity]=useState("Moderate"); const [diet,setDiet]=useState("No restriction");
  const [goal,setGoal]=useState("Balanced health");
  const meals=[
    { label:"Breakfast", name:"Labneh & Za'atar Flatbread",  desc:"Wholegrain khubz with labneh, za'atar, olive oil and tomatoes.", macros:{p:14,c:38,f:8}  },
    { label:"Lunch",     name:"Chicken Machboos Bowl",        desc:"Lean chicken on saffron rice with fresh salad.",                macros:{p:38,c:52,f:12} },
    { label:"Snack",     name:"Dates, Nuts & Yoghurt",        desc:"Two Medjool dates, mixed nuts and low-fat yoghurt.",            macros:{p:10,c:28,f:9}  },
    { label:"Dinner",    name:"Grilled Hammour & Vegetables", desc:"Spiced grilled fish with roasted root vegetables.",             macros:{p:36,c:30,f:11} },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Meal Plan Generator" label="Tools" bg={BG_PEACH}
        subtitle="Personalised in seconds · No account needed · Nothing saved"/>
      <div style={{ background:BG }}>
        <div className="max-w-xl mx-auto px-6 py-16">
          <AnimatePresence mode="wait">
            {step==="form"&&(
              <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Goal</label>
                  <div className="flex flex-wrap gap-2">
                    {["Balanced health","Weight management","Muscle building","Energy boost"].map(g=>(
                      <button key={g} onClick={()=>setGoal(g)} className="px-4 py-2 text-xs font-bold rounded-full"
                        style={{ background:goal===g?GREEN_BG:BG_ALT, color:goal===g?GREEN:INK_OFF, border:`1px solid ${goal===g?GREEN:INK_DIM}` }}>{g}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[["Age","28"],["Height","175 cm"],["Weight","70 kg"]].map(([l,ph])=>(
                    <div key={l}>
                      <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color:INK_OFF }}>{l}</label>
                      <input type="number" placeholder={ph} className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-xl"
                        style={{ background:BG_ALT, border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F }}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Activity Level</label>
                  <div className="flex rounded-xl overflow-hidden" style={{ border:`1px solid ${INK_DIM}` }}>
                    {["Low","Moderate","High"].map((a,i)=>(
                      <button key={a} onClick={()=>setActivity(a)} className="flex-1 py-3 text-sm font-bold"
                        style={{ background:activity===a?GREEN:"transparent", color:activity===a?WHITE:INK_OFF, borderRight:i<2?`1px solid ${INK_DIM}`:"none" }}>{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Dietary Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {["No restriction","Vegetarian","Vegan","Halal","Low-sugar"].map(d=>(
                      <button key={d} onClick={()=>setDiet(d)} className="px-4 py-2 text-xs font-bold rounded-full"
                        style={{ background:diet===d?GREEN_BG:BG_ALT, color:diet===d?GREEN:INK_OFF, border:`1px solid ${diet===d?GREEN:INK_DIM}` }}>{d}</button>
                    ))}
                  </div>
                </div>
                <button onClick={()=>{setLoading(true);setTimeout(()=>{setStep("result");setLoading(false);},1800);}} disabled={loading}
                  className="w-full py-3.5 text-sm font-bold disabled:opacity-50 rounded-full" style={{ background:GREEN, color:WHITE }}>
                  {loading?"Generating…":"Generate Meal Plan"}
                </button>
              </motion.div>
            )}
            {step==="result"&&(
              <motion.div key="result" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                {meals.map((m,i)=>(
                  <motion.div key={m.label} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                    className="p-5 rounded-2xl mb-3" style={{ background:BG_ALT }}>
                    <Tag color="green">{m.label}</Tag>
                    <div style={{ fontFamily:F, fontWeight:700, fontSize:"1rem", color:INK, margin:"0.5rem 0 0.25rem" }}>{m.name}</div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color:INK_OFF }}>{m.desc}</p>
                    <div className="flex gap-3 text-xs font-mono">
                      <span style={{ color:GREEN }}>P {m.macros.p}g</span>
                      <span style={{ color:CORAL }}>C {m.macros.c}g</span>
                      <span style={{ color:INK_OFF }}>F {m.macros.f}g</span>
                    </div>
                  </motion.div>
                ))}
                <div className="mt-5 space-y-3">
                  <SahatnaBanner label="Track or personalise further in Sahatna" desc="Save this plan, adjust portions, and monitor your nutrition over time."/>
                  <div className="flex gap-3">
                    <button onClick={()=>setStep("form")} className="flex-1 py-3 text-sm rounded-full" style={{ background:BG_ALT, color:INK }}>Regenerate</button>
                    <button className="flex-1 py-3 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>Download PDF</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function WorkoutPage() {
  const [step,setStep]=useState<"form"|"result">("form"); const [loading,setLoading]=useState(false);
  const [goal,setGoal]=useState("General fitness"); const [exp,setExp]=useState("Beginner"); const [days,setDays]=useState(3);
  const plan=[
    { day:"Monday",    focus:"Full Body Strength", exercises:[["Bodyweight Squats","3×15"],["Push-ups","3×12"],["Plank","3×45s"],["Lunges","3×12 each"]] },
    { day:"Wednesday", focus:"Cardio & Core",      exercises:[["Brisk Walk / Jog","30 min"],["Mountain Climbers","3×20"],["Bicycle Crunches","3×20"],["Dead Bug","3×10"]] },
    { day:"Friday",    focus:"Upper Body & Flex",  exercises:[["Shoulder Press","3×12"],["Tricep Dips","3×10"],["Resistance Band Rows","3×12"],["Yoga Stretch","10 min"]] },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Workout Planner" label="Tools" bg={BG_MINT}
        subtitle="A simple weekly workout plan based on your goal and schedule. No equipment or gym required."/>
      <div style={{ background:BG }}>
        <div className="max-w-xl mx-auto px-6 py-16">
          <AnimatePresence mode="wait">
            {step==="form"&&(
              <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Fitness Goal</label>
                  <div className="flex flex-wrap gap-2">
                    {["General fitness","Weight loss","Muscle building","Improve endurance"].map(g=>(
                      <button key={g} onClick={()=>setGoal(g)} className="px-4 py-2 text-xs font-bold rounded-full"
                        style={{ background:goal===g?GREEN_BG:BG_ALT, color:goal===g?GREEN:INK_OFF, border:`1px solid ${goal===g?GREEN:INK_DIM}` }}>{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Experience Level</label>
                  <div className="flex rounded-xl overflow-hidden" style={{ border:`1px solid ${INK_DIM}` }}>
                    {["Beginner","Intermediate","Advanced"].map((e,i)=>(
                      <button key={e} onClick={()=>setExp(e)} className="flex-1 py-3 text-sm font-bold"
                        style={{ background:exp===e?GREEN:"transparent", color:exp===e?WHITE:INK_OFF, borderRight:i<2?`1px solid ${INK_DIM}`:"none" }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Days Per Week: {days}</label>
                  <input type="range" min={2} max={6} value={days} onChange={e=>setDays(+e.target.value)} className="w-full accent-green-600"/>
                  <div className="flex justify-between text-xs mt-1" style={{ color:INK_OFF }}><span>2</span><span>6</span></div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-3" style={{ color:INK_OFF }}>Training Location</label>
                  <div className="flex gap-2">
                    {["Home","Gym","Outdoor","Any"].map(l=>(
                      <button key={l} className="flex-1 py-2 text-xs rounded-xl" style={{ background:BG_ALT, color:INK_OFF, border:`1px solid ${INK_DIM}` }}>{l}</button>
                    ))}
                  </div>
                </div>
                <button onClick={()=>{setLoading(true);setTimeout(()=>{setStep("result");setLoading(false);},1600);}} disabled={loading}
                  className="w-full py-3.5 text-sm font-bold disabled:opacity-50 rounded-full" style={{ background:GREEN, color:WHITE }}>
                  {loading?"Building your plan…":"Generate Workout Plan"}
                </button>
              </motion.div>
            )}
            {step==="result"&&(
              <motion.div key="result" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                {plan.map((d,i)=>(
                  <motion.div key={d.day} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                    className="p-5 rounded-2xl mb-3" style={{ background:BG_ALT }}>
                    <div className="flex items-center gap-3 mb-3">
                      <Tag color="green">{d.day}</Tag>
                      <span className="text-xs font-bold" style={{ color:INK }}>{d.focus}</span>
                    </div>
                    {d.exercises.map(([ex,rep])=>(
                      <div key={ex} className="flex items-center justify-between py-2" style={{ borderBottom:`1px solid ${INK_DIM}` }}>
                        <span className="text-xs" style={{ color:INK }}>{ex}</span>
                        <span className="text-xs font-mono font-bold" style={{ color:GREEN }}>{rep}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
                <div className="mt-5 space-y-3">
                  <SahatnaBanner label="Continue your fitness journey in Sahatna" desc="Save this plan, log completions, and track your progress over time."/>
                  <div className="flex gap-3">
                    <button onClick={()=>setStep("form")} className="flex-1 py-3 text-sm rounded-full" style={{ background:BG_ALT, color:INK }}>Regenerate</button>
                    <button className="flex-1 py-3 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>Download PDF</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function WellnessPage() {
  const questions=[
    { q:"How many days per week do you do at least 30 minutes of physical activity?", opts:["0","1–2","3–4","5+"] },
    { q:"How would you describe your typical daily diet?",                            opts:["Mostly processed","Mixed","Mostly whole foods","Balanced & varied"] },
    { q:"How many hours of sleep do you get on average?",                             opts:["Less than 5","5–6","7–8","More than 8"] },
    { q:"How often do you feel stressed or overwhelmed?",                             opts:["Daily","Most days","Sometimes","Rarely"] },
    { q:"How much water do you drink daily?",                                         opts:["Less than 1L","1–2L","2–3L","3L+"] },
  ];
  const [answers,setAnswers]=useState<Record<number,string>>({});
  const [done,setDone]=useState(false);
  const allAnswered=questions.every((_,i)=>answers[i]);
  const recs=[
    { area:"Movement",   icon:"🏃", rec:"Try adding two more active days. The Corniche walk or a community park class is a great start.", score:72 },
    { area:"Nutrition",  icon:"🥗", rec:"Aim to swap one processed meal per day for a whole-food option. Use the Meal Plan Generator for ideas.", score:65 },
    { area:"Sleep",      icon:"😴", rec:"Aim for 7–8 hours consistently. A regular wind-down routine can help improve sleep quality.", score:80 },
    { area:"Wellbeing",  icon:"🧘", rec:"Try 5–10 minutes of mindfulness or breathwork daily. Small habits compound over time.", score:58 },
    { area:"Hydration",  icon:"💧", rec:"You're on track. Aim to spread your water intake across the day rather than drinking in bursts.", score:85 },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Wellness Check" label="Tools" bg={BG_ALT}
        subtitle="Five quick questions. General wellness recommendations. No account needed."/>
      <div style={{ background:BG }}>
        <div className="max-w-xl mx-auto px-6 py-16">
          <AnimatePresence mode="wait">
            {!done&&(
              <motion.div key="quiz" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-8">
                {questions.map((q,i)=>(
                  <div key={i}>
                    <p className="text-sm font-semibold mb-3" style={{ color:INK }}>{q.q}</p>
                    <div className="space-y-2">
                      {q.opts.map(o=>(
                        <button key={o} onClick={()=>setAnswers(a=>({...a,[i]:o}))}
                          className="block w-full text-left px-4 py-3 text-sm rounded-xl transition-all"
                          style={{ background:answers[i]===o?GREEN_BG:BG_ALT, color:answers[i]===o?GREEN:INK_OFF,
                            border:`1px solid ${answers[i]===o?GREEN:INK_DIM}`, fontWeight:answers[i]===o?700:400 }}>
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={()=>allAnswered&&setDone(true)} disabled={!allAnswered}
                  className="w-full py-3.5 text-sm font-bold disabled:opacity-40 rounded-full" style={{ background:GREEN, color:WHITE }}>
                  Get My Recommendations
                </button>
              </motion.div>
            )}
            {done&&(
              <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                <p className="text-xs uppercase tracking-[0.15em] mb-6" style={{ color:INK_OFF }}>Your Wellness Snapshot</p>
                {recs.map((r,i)=>(
                  <motion.div key={r.area} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                    className="p-5 rounded-2xl" style={{ background:BG_ALT }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{r.icon}</span>
                        <span className="text-sm font-bold" style={{ color:INK }}>{r.area}</span>
                      </div>
                      <span className="text-sm font-mono font-bold" style={{ color:r.score>=75?GREEN:r.score>=60?CORAL:"#dc2626" }}>{r.score}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full mb-3" style={{ background:INK_DIM }}>
                      <motion.div className="h-full rounded-full" style={{ background:r.score>=75?GREEN:r.score>=60?CORAL:"#dc2626" }}
                        initial={{width:0}} animate={{width:`${r.score}%`}} transition={{duration:0.8,delay:i*0.07}}/>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color:INK_OFF }}>{r.rec}</p>
                  </motion.div>
                ))}
                <div className="pt-4 space-y-3">
                  <SahatnaBanner label="Personalized wellness tracking in Sahatna" desc="Track progress, connect a device, and get AI-powered recommendations."/>
                  <button onClick={()=>{setDone(false);setAnswers({});}} className="w-full py-3 text-sm rounded-full"
                    style={{ background:BG_ALT, color:INK }}>Retake Check</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function CollaboratePage() {
  const [sent,setSent]=useState(false);
  const [form,setForm]=useState({ name:"",org:"",role:"",interest:"",type:"",message:"",contact:"" });
  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setForm(f=>({...f,[k]:e.target.value}));
  const audiences=[
    { icon:"🎓", label:"Universities & Researchers", desc:"Joint studies, data sharing, academic publications" },
    { icon:"🏫", label:"Schools",                    desc:"Programme delivery, curriculum integration" },
    { icon:"🏛️", label:"Government Entities",        desc:"Policy collaboration, shared initiatives" },
    { icon:"🏥", label:"Healthcare Organisations",   desc:"Clinical partnerships, prevention programmes" },
    { icon:"🏢", label:"Private Sector",             desc:"Sponsorship, product partnerships, events" },
    { icon:"🌍", label:"Community Organisations",    desc:"Grassroots activities, outreach programmes" },
  ];
  const inputStyle = { background:BG, border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F };
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Collaborate With Us" label="Collaborate" bg={BG_ALT}
        subtitle="We partner with universities, researchers, schools, healthcare organizations, and community groups across Abu Dhabi and beyond."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] mb-6" style={{ color:INK_OFF }}>Who can collaborate?</p>
            <div className="space-y-3">
              {audiences.map(a=>(
                <div key={a.label} className="flex items-start gap-4 p-4 rounded-xl" style={{ background:BG_ALT }}>
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <div>
                    <div className="text-sm font-bold mb-0.5" style={{ color:INK }}>{a.label}</div>
                    <div className="text-xs" style={{ color:INK_OFF }}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {sent?(
              <div className="p-8 rounded-2xl text-center" style={{ background:GREEN_BG }}>
                <div className="text-3xl mb-4">✅</div>
                <h3 style={{ fontFamily:F, fontWeight:800, fontSize:"1.4rem", color:INK, marginBottom:"0.5rem" }}>Message received.</h3>
                <p className="text-sm" style={{ color:INK_OFF }}>We will be in touch within 5 working days.</p>
              </div>
            ):(
              <form onSubmit={e=>{e.preventDefault();setSent(true);}} className="space-y-4">
                <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color:INK_OFF }}>Start the conversation</p>
                <div className="grid grid-cols-2 gap-4">
                  {([["name","Name","Your name"],["org","Organisation","Organisation name"]] as [string,string,string][]).map(([k,l,p])=>(
                    <div key={k}>
                      <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>{l}</label>
                      <input value={(form as any)[k]} onChange={set(k)} placeholder={p} required
                        className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-xl" style={inputStyle}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>Role</label>
                  <input value={form.role} onChange={set("role")} placeholder="Your job title or role" className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-xl" style={inputStyle}/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>Area of Interest</label>
                  <select value={form.interest} onChange={set("interest")} className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-xl" style={inputStyle}>
                    <option value="">Select an area…</option>
                    {["Nutrition","Physical Activity","Schools & Children","Public Health","Mental Wellbeing","Policy","Research","Community Engagement"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>Type of Collaboration</label>
                  <select value={form.type} onChange={set("type")} className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-xl" style={inputStyle}>
                    <option value="">Select a type…</option>
                    {["Research Partnership","Programme Delivery","Event Sponsorship","Policy Input","Data Sharing","Curriculum Integration","Other"].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>Message</label>
                  <textarea value={form.message} onChange={set("message")} rows={4} placeholder="Tell us about your proposed collaboration…"
                    className="w-full px-3 py-2.5 text-sm focus:outline-none resize-none rounded-xl" style={inputStyle}/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>Contact Details</label>
                  <input value={form.contact} onChange={set("contact")} placeholder="Email or phone number" className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-xl" style={inputStyle}/>
                </div>
                <button className="w-full py-3.5 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>Submit</button>
              </form>
            )}
          </div>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

const COMMUNITIES_DATA = [
  { id:"c1", name:"Corniche Morning Walkers",  desc:"Daily sunrise walks. All ages welcome.",         area:"Corniche",       members:"~120", freq:"Daily 6 AM",     cat:"Walking Groups"    },
  { id:"c2", name:"Al Reem Cycling Club",      desc:"Weekend rides around Al Reem and beyond.",       area:"Al Reem Island", members:"~85",  freq:"Sat & Sun 6 AM", cat:"Sports Clubs"      },
  { id:"c3", name:"Healthy Families Abu Dhabi",desc:"Family activities and cooking workshops.",       area:"Various",        members:"~200", freq:"Weekly",          cat:"Family & Kids"     },
  { id:"c4", name:"Senior Wellness Circle",    desc:"Gentle exercise and mindfulness for seniors.",   area:"Khalifa Park",   members:"~60",  freq:"Tue & Thu 8 AM", cat:"Seniors"           },
  { id:"c5", name:"Plant-Based Cooking Club",  desc:"Share recipes using local ingredients.",         area:"Online + IRL",   members:"~95",  freq:"Biweekly",        cat:"Nutrition Support" },
  { id:"c6", name:"Degayeg Trail Runners",     desc:"Community runs on the Degayeg trail network.",   area:"Degayeg",        members:"~45",  freq:"Fri 5:30 AM",    cat:"Sports Clubs"      },
];

function RewardsPage({ phase }: { phase:Phase }) {
  const tiers=["Getting Started","Building Momentum","Community Leader","Wellness Champion"];
  const pts=1350; const curTier=1; const nextPts=2500;
  const earn=[["Daily Steps Goal","Complete 10,000 steps",50],["Weekly Active Minutes","Reach 150 active minutes",75],["Sleep Consistency","Log 7+ hours for 5 nights",60],["Festival of Health Event","Attend any Healthy Living event",100],["Daily Check-in","Complete your daily check-in",30],["Refer a Friend","Invite a resident to join",200]];
  const redeem=[["Community Gym Pass","One free session at a partnered gym",500],["Festival of Health Entry","Free entry to a ticketed event",300],["Wellness Voucher","AED 50 towards wellness products",700],["Fitness Class Pass","Free outdoor class at a public park",250]];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Rewards" label="Phase 2" bg={BG_PEACH}
        subtitle="Every healthy choice earns you points. Redeem them for real community rewards."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-14">
          {phase==="1" ? (
            <Phase2Gate phase={phase} title="Rewards — Coming in Phase 2"
              desc="The points and rewards system requires Sahatna account integration and is planned for Phase 2."/>
          ) : (
            <>
              <div className="p-8 rounded-2xl" style={{ background:GREEN_BG }}>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
                  <div><div className="text-xs uppercase tracking-[0.1em] mb-1" style={{ color:GREEN }}>Tier</div><div style={{ fontFamily:F, fontWeight:800, fontSize:"1.4rem", color:INK }}>{tiers[curTier]}</div></div>
                  <div className="text-right"><div className="text-xs uppercase tracking-[0.1em] mb-1" style={{ color:GREEN }}>Points</div><div style={{ fontFamily:F, fontWeight:800, fontSize:"2rem", color:INK }}>{pts.toLocaleString()}</div></div>
                </div>
                <div className="h-2 rounded-full mb-2" style={{ background:`${GREEN}25` }}>
                  <motion.div initial={{width:0}} animate={{width:`${(pts/nextPts)*100}%`}} transition={{duration:1.2}} className="h-full rounded-full" style={{ background:GREEN }}/>
                </div>
                <div className="flex justify-between text-xs" style={{ color:GREEN }}><span>{pts.toLocaleString()} pts</span><span>{(nextPts-pts).toLocaleString()} pts to {tiers[curTier+1]}</span></div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {tiers.map((t,i)=><span key={t} className="text-xs px-3 py-1.5 rounded-full" style={{ background:i<=curTier?GREEN:BG_ALT, color:i<=curTier?WHITE:INK_OFF }}>{t}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] mb-5" style={{ color:INK_OFF }}>Ways to Earn</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earn.map(([title,sub,p])=>(
                    <div key={title as string} className="p-5 rounded-2xl" style={{ background:BG_ALT }}>
                      <div className="text-xs font-mono font-bold mb-3" style={{ color:GREEN }}>+{p} pts</div>
                      <div className="text-sm font-bold mb-1" style={{ color:INK }}>{title}</div>
                      <div className="text-xs" style={{ color:INK_OFF }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] mb-5" style={{ color:INK_OFF }}>Redeem Points</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {redeem.map(([title,desc,cost])=>(
                    <div key={title as string} className="flex items-center gap-4 p-5 rounded-2xl" style={{ background:BG_ALT }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold mb-0.5" style={{ color:INK }}>{title}</div>
                        <div className="text-xs" style={{ color:INK_OFF }}>{desc}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-mono font-bold" style={{ color:CORAL }}>{cost} pts</span>
                        <button className="text-xs px-3 py-1.5 rounded-full"
                          style={{ background:pts>=(cost as number)?GREEN:BG, color:pts>=(cost as number)?WHITE:INK_OFF, border:`1px solid ${pts>=(cost as number)?GREEN:INK_DIM}` }}>Redeem</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <SahatnaBanner label="Track points and manage rewards in Sahatna" desc="Sync your activity data for automatic point calculations."/>
            </>
          )}
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function CommunitiesPage({ phase }: { phase:Phase }) {
  const [filter,setFilter]=useState("All");
  const cats=["All","Walking Groups","Sports Clubs","Nutrition Support","Family & Kids","Seniors"];
  const filtered=filter==="All"?COMMUNITIES_DATA:COMMUNITIES_DATA.filter(c=>c.cat===filter);
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Find a Community" label="Communities" imgSrc={IMG_CORNICHE} bg={BG_MINT}
        subtitle="Join a local wellness group — no account or sign-up required."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          {phase==="1" ? (
            <Phase2Gate phase={phase} title="Communities — Coming in Phase 2"
              desc="Community profiles and group management require deeper integration and are planned for Phase 2."/>
          ) : (
            <>
              <div className="flex gap-2 mb-10 flex-wrap">
                {cats.map(c=><button key={c} onClick={()=>setFilter(c)} className="text-xs px-4 py-2 rounded-full transition-all"
                  style={{ background:filter===c?GREEN:BG_ALT, color:filter===c?WHITE:INK_OFF, fontWeight:filter===c?700:400 }}>{c}</button>)}
              </div>
              <AnimatePresence mode="popLayout">
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map(c=>(
                    <motion.div key={c.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                      className="p-5 rounded-2xl" style={{ background:BG_ALT }}>
                      <div className="flex items-start justify-between mb-3">
                        <Tag color="green">{c.cat}</Tag>
                        <button className="text-xs px-3 py-1.5 rounded-full" style={{ background:BG, color:INK_OFF, border:`1px solid ${INK_DIM}` }}>View Info</button>
                      </div>
                      <div style={{ fontFamily:F, fontWeight:700, fontSize:"1rem", color:INK, marginBottom:"0.4rem" }}>{c.name}</div>
                      <p className="text-sm mb-3 leading-relaxed" style={{ color:INK_OFF }}>{c.desc}</p>
                      <div className="flex gap-4 text-xs" style={{ color:INK_OFF }}>
                        <span>{c.area}</span><span>·</span><span>{c.members}</span><span>·</span><span>{c.freq}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function ScannerPage({ phase }: { phase:Phase }) {
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Food & Label Scanner" label="Phase 2" bg={BG_ALT}
        subtitle="Scan packaged foods to view nutrition, ingredients, and healthier alternatives."/>
      <div style={{ background:BG }}>
        <div className="max-w-xl mx-auto px-6 py-16">
          {phase==="1"?(
            <Phase2Gate phase={phase} title="Food Scanner — Coming in Phase 2"
              desc="Scanning features require computer vision and health database integrations. This experience is planned for Phase 2 and is available now in Sahatna."/>
          ):(
            <div className="space-y-6">
              <div className="aspect-square max-w-xs mx-auto flex items-center justify-center rounded-3xl"
                style={{ border:`2px dashed ${INK_DIM}`, background:BG_ALT }}>
                <div className="text-center p-8">
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background:GREEN_BG }}>
                    <Search size={20} style={{ color:GREEN }}/>
                  </div>
                  <p className="text-sm" style={{ color:INK_OFF }}>Point your camera at the nutrition label</p>
                </div>
              </div>
              <button className="w-full py-3.5 text-sm font-bold rounded-full" style={{ background:GREEN, color:WHITE }}>Take Photo</button>
              <SahatnaBanner label="Full scanning experience in Sahatna" desc="Barcode scan, food recognition, and health history."/>
            </div>
          )}
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function LatestUpdatesPage() {
  const [filter,setFilter]=useState("All");
  const cats=["All","Policy","Events","Research","Community"];
  const filtered=filter==="All"?NEWS:NEWS.filter(n=>n.tag===filter);
  const tagColor = (tag:string)=>tag==="Policy"?"sage":tag==="Events"?"green":"coral" as "green"|"coral"|"sage";
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Latest Updates" label="Updates" imgSrc={IMG_RECT2} bg={BG_ALT}
        subtitle="News, announcements and stories from across the Healthy Living programme."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex gap-2 mb-10 flex-wrap">
            {cats.map(c=>(
              <button key={c} onClick={()=>setFilter(c)} className="text-xs uppercase tracking-[0.1em] px-4 py-2 rounded-full transition-all"
                style={{ background:filter===c?GREEN:BG_ALT, color:filter===c?WHITE:INK_OFF, fontWeight:filter===c?700:400 }}>{c}</button>
            ))}
          </div>
          <AnimatePresence mode="popLayout">
            {filtered.map(n=>(
              <motion.div key={n.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className="flex items-center gap-6 py-5 cursor-pointer group" style={{ borderBottom:`1px solid ${INK_DIM}` }}>
                <Tag color={tagColor(n.tag)}>{n.tag}</Tag>
                <span className="flex-1 text-sm font-semibold" style={{ color:INK }}>{n.title}</span>
                <span className="text-xs flex-shrink-0" style={{ color:INK_OFF }}>{n.date}</span>
                <ArrowRight size={14} style={{ color:INK_OFF, flexShrink:0 }}/>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function AboutUsPage() {
  const timeline=[
    { year:"2022", title:"Programme Launch",      desc:"Healthy Living officially launched as Abu Dhabi's flagship public health initiative." },
    { year:"2024", title:"Strategy Publication",  desc:"The Healthy Living Strategy 2024–2030 published, outlining 25 strategic initiatives." },
    { year:"2025", title:"Festival of Health",    desc:"The inaugural Festival of Health drew over 50,000 residents to the Corniche." },
    { year:"2026", title:"25 Initiatives Active", desc:"All 25 strategic initiatives across active lifestyle, nutrition, and prevention fully activated." },
  ];
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="About Healthy Living" label="About Us" imgSrc={IMG_HERO} bg={BG_PEACH}
        subtitle="Abu Dhabi's government-led programme empowering every citizen and resident to live longer, healthier lives."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-20">
          <div>
            <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.02em", fontSize:"clamp(1.4rem,3vw,2rem)", color:INK, lineHeight:1.2, marginBottom:"1.5rem" }}>
              A cross-government commitment to public health
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color:INK_OFF }}>We are a cross-government initiative working with the private sector, community organisations, and individual residents to make healthy living the default choice.</p>
            <div className="p-5 rounded-xl mt-6" style={{ background:BG_MINT }}>
              <div className="text-xs font-bold uppercase tracking-[0.12em] mb-2" style={{ color:GREEN }}>Our role</div>
              <p className="text-sm leading-relaxed" style={{ color:INK_OFF }}>The Healthy Living website focuses on Discovery, Education, and Engagement. Personal health management and tracking lives in Sahatna.</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] mb-6" style={{ color:INK_OFF }}>Milestones</p>
            {timeline.map((t,i)=>(
              <div key={t.year} className="flex gap-6 py-5" style={{ borderBottom:i<timeline.length-1?`1px solid ${INK_DIM}`:"none" }}>
                <div className="text-sm font-mono font-bold flex-shrink-0 w-12 pt-0.5" style={{ color:GREEN }}>{t.year}</div>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color:INK }}>{t.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color:INK_OFF }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

function PartnersPage({ setPage }: { setPage:(p:Page)=>void }) {
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Our Partners" label="Partners" bg={BG_ALT}
        subtitle="A coalition of government, healthcare, private sector, and community organisations."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 space-y-14">
          {Object.entries(PARTNERS).map(([cat,items])=>(
            <div key={cat}>
              <p className="text-xs uppercase tracking-[0.18em] mb-5" style={{ color:INK_OFF }}>{cat}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map(p=>(
                  <div key={p.name} className="p-5 rounded-xl" style={{ background:BG_ALT }}>
                    <div className="text-sm font-bold mb-1" style={{ color:INK }}>{p.name}</div>
                    <div className="text-xs leading-relaxed" style={{ color:INK_OFF }}>{p.role}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-20 px-6" style={{ background:BG_PEACH }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.02em", fontSize:"clamp(1.8rem,4vw,2.8rem)", color:INK, marginBottom:"1rem" }}>Become a Partner</h2>
          <button onClick={()=>setPage("collaborate")} className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full"
            style={{ background:GREEN, color:WHITE, fontWeight:600 }}>Collaborate With Us <ArrowUpRight size={13}/></button>
        </div>
      </div>
      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function PressPage() {
  const [sent,setSent]=useState(false); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [msg,setMsg]=useState("");
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="Press & Media" label="Press" bg={BG_ALT}
        subtitle="Resources and contacts for media professionals covering Healthy Living."/>
      <div style={{ background:BG }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] mb-5" style={{ color:INK_OFF }}>Press Releases</p>
              {[["Healthy Living Reaches 120,000 Registered Residents","10 Jul 2026","1.2 MB"],["Festival of Health 2025 Official Press Release","5 May 2025","0.8 MB"],["Nutri-Mark Label Expansion Announcement","3 Jul 2026","1.1 MB"]].map(([t,d,s])=>(
                <div key={t as string} className="flex items-center gap-4 py-4" style={{ borderBottom:`1px solid ${INK_DIM}` }}>
                  <div className="flex-1"><div className="text-sm font-semibold mb-0.5" style={{ color:INK }}>{t}</div><div className="text-xs" style={{ color:INK_OFF }}>{d} · {s}</div></div>
                  <button className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5" style={{ background:BG_ALT, color:INK_OFF }}><Download size={11}/> PDF</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="p-6 rounded-2xl sticky top-28" style={{ background:BG_ALT }}>
              <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color:INK_OFF }}>Media Contact</p>
              {sent?(
                <div className="py-4"><div className="text-sm font-bold mb-1" style={{ color:INK }}>Message sent.</div><p className="text-xs" style={{ color:INK_OFF }}>We will respond within 48 hours.</p></div>
              ):(
                <form onSubmit={e=>{e.preventDefault();setSent(true);}} className="space-y-4">
                  {([["Name",name,setName,"Your name"],["Email",email,setEmail,"your@email.com"]] as [string,string,(v:string)=>void,string][]).map(([l,v,s,p])=>(
                    <div key={l}>
                      <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>{l}</label>
                      <input value={v} onChange={e=>s(e.target.value)} placeholder={p}
                        className="w-full px-3 py-2.5 text-sm focus:outline-none rounded-lg"
                        style={{ background:BG, border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F }}/>
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] mb-1.5" style={{ color:INK_OFF }}>Message</label>
                    <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Your enquiry…"
                      className="w-full px-3 py-2.5 text-sm focus:outline-none resize-none rounded-lg"
                      style={{ background:BG, border:`1px solid ${INK_DIM}`, color:INK, fontFamily:F }}/>
                  </div>
                  <button className="w-full py-3 text-sm rounded-full" style={{ background:GREEN, color:WHITE, fontWeight:600 }}>Send</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <SiteFooter setPage={()=>{}}/>
    </div>
  );
}

const FAQ_DATA=[
  { cat:"About the Programme", qa:[
    ["What is Healthy Living?","Healthy Living is Abu Dhabi's government-led programme empowering every citizen and resident to live longer, healthier, more fulfilling lives through active lifestyles, healthy eating, and prevention-first health management."],
    ["What is Sahatna?","Sahatna is the primary platform for personal health management, tracking, monitoring, and device integrations. Healthy Living website redirects to Sahatna where those features are most appropriate."],
  ]},
  { cat:"Tools", qa:[
    ["Are the wellness tools free?","Yes. All tools — Meal Plan Generator, Workout Planner, and Wellness Check — are free, require no account, and save no personal data."],
    ["How do I save or track my plan?","Generated plans can be downloaded as PDFs. For persistent tracking and personalized recommendations, open Sahatna."],
  ]},
  { cat:"Research & Collaboration", qa:[
    ["How do I access research publications?","Visit the Global & Research section to browse peer-reviewed papers, policy briefs, and case studies by topic. Most are available as free PDF downloads."],
    ["How do I collaborate with Healthy Living?","Use the Collaborate With Us form to submit your organisation's details and area of interest. We typically respond within 5 working days."],
  ]},
  { cat:"Schools & Children", qa:[
    ["How does my school get involved?","Contact us via the Collaborate With Us page. Select 'Schools & Children' as the area of interest."],
  ]},
];

function FAQPage({ setPage }: { setPage:(p:Page)=>void }) {
  const [openCat,setOpenCat]=useState<string|null>(FAQ_DATA[0].cat); const [openQ,setOpenQ]=useState<string|null>(null);
  return (
    <div style={{ fontFamily:F }}>
      <PageHeader title="FAQ" label="Frequently Asked" bg={BG_ALT} subtitle="Common questions about the Healthy Living programme."/>
      <div style={{ background:BG }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-16">
          {FAQ_DATA.map(cat=>(
            <div key={cat.cat} className="mb-2">
              <button onClick={()=>setOpenCat(openCat===cat.cat?null:cat.cat)}
                className="w-full flex items-center justify-between p-4 rounded-xl text-left"
                style={{ background:openCat===cat.cat?BG_MINT:BG_ALT }}>
                <span className="text-sm font-bold" style={{ color:INK }}>{cat.cat}</span>
                <ChevronDown size={15} style={{ color:INK_OFF, transform:openCat===cat.cat?"rotate(180deg)":"none", transition:"transform .2s" }}/>
              </button>
              <AnimatePresence>
                {openCat===cat.cat&&(
                  <motion.div initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} className="overflow-hidden">
                    <div className="pt-2 pl-2 space-y-2 pb-2">
                      {cat.qa.map(([question,answer])=>(
                        <div key={question} className="rounded-xl overflow-hidden" style={{ background:BG_ALT }}>
                          <button onClick={()=>setOpenQ(openQ===question?null:question)} className="w-full flex items-center justify-between px-4 py-4 text-left">
                            <span className="text-sm pr-4" style={{ color:INK }}>{question}</span>
                            <ChevronDown size={13} style={{ color:INK_OFF, transform:openQ===question?"rotate(180deg)":"none", transition:"transform .2s", flexShrink:0 }}/>
                          </button>
                          <AnimatePresence>
                            {openQ===question&&(
                              <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                                <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color:INK_OFF }}>{answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div className="pt-10 flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm" style={{ color:INK_OFF }}>Still have a question?</p>
            <button onClick={()=>setPage("ai")} className="inline-flex items-center gap-2 px-6 py-3 text-sm rounded-full"
              style={{ background:GREEN_BG, color:GREEN, fontWeight:600 }}>Ask our AI <ArrowUpRight size={13}/></button>
          </div>
        </div>
      </div>
      <SiteFooter setPage={setPage}/>
    </div>
  );
}

function AskAIPage() {
  const [msgs,setMsgs]=useState<{role:"user"|"ai";text:string}[]>([{role:"ai",text:"Hello. Ask me about research, wellness tools, schools programmes, collaboration, or anything Healthy Living."}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const topics=[["Research","Publications & policy"],["Schools","Children's programmes"],["Tools","Wellness generators"],["Collaborate","Work with us"]];
  const send=(text:string)=>{
    if (!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]); setInput(""); setLoading(true);
    const reply=AI_REPLIES[`Tell me about ${text.split(" ").slice(-1)[0]}`]||(AI_REPLIES[text]??"For personalised guidance, consult a healthcare professional or visit Sahatna.");
    setTimeout(()=>{setMsgs(m=>[...m,{role:"ai",text:reply}]);setLoading(false);},1300);
  };
  return (
    <div style={{ fontFamily:F, background:BG_ALT, minHeight:"100%" }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12 pt-16 pb-16">
        <Tag color="green">Healthy Living AI</Tag>
        <h1 style={{ fontFamily:F, fontWeight:800, letterSpacing:"-0.025em", fontSize:"clamp(1.8rem,4vw,3rem)", color:INK, lineHeight:1.1, margin:"1rem 0 0.5rem" }}>
          Ask anything about healthy living
        </h1>
        <div className="flex items-center mb-8 rounded-xl overflow-hidden" style={{ border:`1px solid ${INK_DIM}`, background:BG }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
            placeholder="Ask about research, tools, schools, collaboration…"
            className="flex-1 px-4 py-4 text-sm bg-transparent focus:outline-none" style={{ color:INK,fontFamily:F }}/>
          <button onClick={()=>send(input)} disabled={!input.trim()} className="px-5 py-4 text-xs font-bold disabled:opacity-30 flex-shrink-0 flex items-center gap-2"
            style={{ background:GREEN, color:WHITE }}>Ask <Send size={12}/></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {topics.map(([l,d])=>(
            <button key={l} onClick={()=>send(`Tell me about ${l}`)} className="p-4 text-left rounded-xl transition-all"
              style={{ background:BG, border:`1px solid ${INK_DIM}` }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.borderColor=GREEN_L}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.borderColor=INK_DIM}>
              <div className="text-sm font-bold mb-1" style={{ color:INK }}>{l}</div>
              <div className="text-xs" style={{ color:INK_OFF }}>{d}</div>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {msgs.map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className="max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-2xl"
                style={m.role==="user"?{background:GREEN,color:WHITE}:{background:BG,color:INK,border:`1px solid ${INK_DIM}`}}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading&&<div className="flex justify-start"><div className="px-4 py-3 text-sm rounded-2xl" style={{ background:BG,color:INK_OFF }}>Thinking…</div></div>}
        </div>
        <p className="text-xs text-center pt-8" style={{ color:INK_OFF,borderTop:`1px solid ${INK_DIM}`,marginTop:"2rem",paddingTop:"1.5rem" }}>
          This assistant provides general guidance and is not a substitute for medical advice.
        </p>
      </div>
    </div>
  );
}

// ─── Wellness Lab ─────────────────────────────────────────────────────────────
const LAB_EVENTS: Record<string,{id:number;title:string;location:string;time:string;tags:string[];img:string}[]> = {
  "Abu Dhabi":[
    {id:0,title:"Corniche Walk Club",location:"Corniche Beach",time:"Tomorrow · 6:30 AM",tags:["Walking","Community","Free"],img:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80"},
    {id:1,title:"Yoga at Yas Bay",location:"Yas Bay Waterfront",time:"Saturday · 7:00 AM",tags:["Yoga","Outdoor","Free"],img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80"},
    {id:2,title:"Family Fitness Day",location:"Khalidiyah Park",time:"Sunday · 9:00 AM",tags:["Family","Fitness","Free"],img:"https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=80"},
  ],
  "Dubai":[
    {id:3,title:"Sunrise Yoga",location:"Kite Beach",time:"Tomorrow · 7:00 AM",tags:["Yoga","Outdoor","Free"],img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80"},
    {id:4,title:"Community Run",location:"Dubai Marina",time:"Saturday · 6:30 AM",tags:["Running","Community","Free"],img:"https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=80"},
    {id:5,title:"Sunset Meditation",location:"Zabeel Park",time:"Sunday · 5:30 PM",tags:["Mindfulness","Outdoor"],img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80"},
  ],
};

function WellnessLabPage({ setPage }: { setPage:(p:Page)=>void }) {
  const [sleep,setSleep]   = useState(6.25);
  const [water,setWater]   = useState(4);
  const [move,setMove]     = useState(15);
  const [stress,setStress] = useState(0); // 0=High 1=Med 2=Low
  const [showPlan,setShowPlan] = useState(false);
  const [acts,setActs]     = useState<("idle"|"progress"|"done")[]>(["idle","idle","idle"]);
  const [saved,setSaved]   = useState(new Set<number>());
  const [city,setCity]     = useState("Abu Dhabi");
  const [doneGoals,setDoneGoals] = useState(new Set<string>());
  const [aiInput,setAiInput] = useState("");
  const expDays = new Set([0,1,2]);

  const sB  = Math.min(Math.max(0, Math.round((sleep-6.25)*2.8)), 5);
  const wB  = Math.min(Math.max(0, Math.round((water-4)*0.65)), 3);
  const mB  = Math.min(Math.max(0, Math.round((move-15)*0.09)), 2);
  const stB = stress===0?0:stress===1?2:4;
  const projected = 72 + sB + wB + mB + stB;
  const diff = projected - 72;

  const impacts = [
    {name:"Sleep",   boost:sB,  icon:"🌙", msg:"Getting closer to 8 hours could have the biggest positive impact on your day."},
    {name:"Water",   boost:wB,  icon:"💧", msg:"Reaching 8 glasses daily could noticeably improve energy and focus."},
    {name:"Movement",boost:mB,  icon:"🚶", msg:"Even 20 extra minutes of movement daily can significantly lift your wellbeing."},
    {name:"Stress",  boost:stB, icon:"🧘", msg:"Reducing stress has a powerful effect on energy, sleep, and overall wellbeing."},
  ].sort((a,b)=>b.boost-a.boost);
  const topImpact = impacts[0];

  const fmtSleep=(v:number)=>{const h=Math.floor(v);const m=Math.round((v-h)*60);return m?`${h}h ${m}m`:`${h}h`;};
  const startAct=(i:number)=>{
    setActs(a=>{const n=[...a] as ("idle"|"progress"|"done")[];n[i]="progress";return n;});
    setTimeout(()=>setActs(a=>{const n=[...a] as ("idle"|"progress"|"done")[];n[i]="done";return n;}),2500);
  };
  const toggleGoal=(g:string)=>setDoneGoals(prev=>{const n=new Set(prev);n.has(g)?n.delete(g):n.add(g);return n;});
  const toggleSave=(id:number)=>setSaved(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});

  const ACTIVITIES=[
    {icon:"🚶",title:"15-Minute Walk",   best:"Energy + Stress",duration:"15 min",cta:"Start"},
    {icon:"🧘",title:"3-Minute Reset",   best:"Stress",         duration:"3 min", cta:"Start"},
    {icon:"🌙",title:"Early Night Challenge",best:"Recovery",    duration:"Tonight",cta:"Accept"},
  ];
  const BETTER_DAY=[
    {time:"8:00 AM", icon:"💧",cat:"Morning hydration",     tip:"Drink one glass of water after waking up."},
    {time:"12:30 PM",icon:"🚶",cat:"10-minute walk",         tip:"Take a short walk after lunch."},
    {time:"4:00 PM", icon:"🧘",cat:"Stress reset",           tip:"Take a 3-minute breathing break."},
    {time:"7:00 PM", icon:"🚶",cat:"Evening movement",       tip:"Complete another 20 minutes of light activity."},
    {time:"9:45 PM", icon:"📵",cat:"Start winding down",     tip:"Reduce screen time and prepare for sleep."},
    {time:"10:30 PM",icon:"🌙",cat:"Target bedtime",         tip:"Aim for 8 hours — lights out."},
  ];
  const INSIGHTS=[
    {icon:"🌙",title:"Sleep is your biggest opportunity",desc:"You reported less than 7 hours of sleep on 4 of your last 7 days.",badge:"High impact",   badgeColor:"coral" as const,action:"Explore"},
    {icon:"⚡",title:"Movement may be helping your energy",desc:"Your energy check-ins are better on days when you move for 30+ minutes.",badge:"Positive pattern",badgeColor:"green" as const,action:"View Pattern"},
    {icon:"💧",title:"Your hydration is improving",desc:"You reached your hydration target on 5 days this week.",badge:"🔥 5 Day Streak",badgeColor:"sage" as const,action:"Keep Going"},
  ];
  const COMING_UP=[
    {day:"Today",   items:["🧘 3-minute stress reset","🌙 Sleep goal — 8 hours"]},
    {day:"Tomorrow",items:["🌅 Sunrise Yoga · 7:00 AM · Kite Beach"]},
    {day:"Saturday",items:["🏃 Community Run · 6:30 AM · Dubai Marina"]},
  ];
  const AI_CHIPS=["How can I improve my score?","What should I focus on this week?","Give me a 20-minute wellness plan","Which activity should I try?"];

  return (
    <div style={{fontFamily:F}}>

      {/* PAGE HEADER */}
      <div style={{background:`linear-gradient(135deg,${BG_MINT} 0%,${BG_CREAM} 100%)`}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Tag color="green">Interactive</Tag>
            <h1 style={{fontFamily:F,fontWeight:800,letterSpacing:"-0.025em",fontSize:"clamp(2rem,4.5vw,3.2rem)",color:INK,lineHeight:1.05,margin:"1rem 0 0.5rem"}}>
              Wellness Lab 🧪
            </h1>
            <p className="text-base leading-relaxed max-w-md" style={{color:INK_OFF}}>Experiment with small changes and discover what could make you feel better.</p>
          </div>
          <div className="flex-shrink-0 p-6 rounded-2xl min-w-[210px]" style={{background:BG,border:`1px solid ${INK_DIM}`,boxShadow:"0 4px 20px rgba(15,36,24,0.07)"}}>
            <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{color:INK_OFF}}>Wellness Score</p>
            <div className="flex items-end gap-2 mb-1">
              <span style={{fontFamily:F,fontWeight:800,fontSize:"3rem",lineHeight:1,color:INK}}>72</span>
              <span className="text-sm font-semibold pb-1.5" style={{color:GREEN}}>↑ 4 this week</span>
            </div>
            <p className="text-xs" style={{color:INK_OFF}}>Biggest opportunity: <span style={{color:CORAL,fontWeight:600}}>Sleep consistency</span></p>
          </div>
        </div>
      </div>

      {/* WHAT-IF SIMULATOR */}
      <div style={{background:BG}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="rounded-3xl overflow-hidden" style={{border:`1.5px solid ${INK_DIM}`}}>
            <div className="px-8 py-6" style={{background:BG_ALT,borderBottom:`1px solid ${INK_DIM}`}}>
              <h2 style={{fontFamily:F,fontWeight:800,fontSize:"1.5rem",color:INK,letterSpacing:"-0.02em"}}>What could improve your day?</h2>
              <p className="text-sm mt-1" style={{color:INK_OFF}}>Adjust the sliders to see how small lifestyle changes could influence your projected wellness score.</p>
            </div>
            <div className="grid lg:grid-cols-[1fr_300px]">
              {/* Sliders */}
              <div className="px-8 py-8 space-y-8" style={{borderRight:`1px solid ${INK_DIM}`}}>
                {([
                  {label:"Sleep",   current:"6h 15m", val:fmtSleep(sleep), min:4,  max:10, step:0.25, onChange:(v:string)=>setSleep(parseFloat(v)),  lo:"4h",  hi:"10h"},
                  {label:"Water",   current:"4 glasses",val:`${water} glasses`,min:1,max:10,step:1,   onChange:(v:string)=>setWater(parseInt(v)),    lo:"1",   hi:"10"},
                  {label:"Movement",current:"15 min",  val:`${move} min`,   min:0,  max:90, step:5,   onChange:(v:string)=>setMove(parseInt(v)),     lo:"0 min",hi:"90 min"},
                ] as {label:string;current:string;val:string;min:number;max:number;step:number;onChange:(v:string)=>void;lo:string;hi:string}[]).map(s=>(
                  <div key={s.label}>
                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em]" style={{color:INK_OFF}}>{s.label}</p>
                        <p className="text-xs mt-0.5" style={{color:INK_OFF}}>Current: <span style={{color:CORAL}}>{s.current}</span></p>
                      </div>
                      <span className="text-lg font-bold" style={{color:INK,fontFamily:F}}>{s.val}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step}
                      value={s.label==="Sleep"?sleep:s.label==="Water"?water:move}
                      onChange={e=>s.onChange(e.target.value)}
                      className="w-full h-2 rounded-full cursor-pointer appearance-none" style={{accentColor:GREEN}}/>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs" style={{color:INK_DIM}}>{s.lo}</span>
                      <span className="text-xs" style={{color:INK_DIM}}>{s.hi}</span>
                    </div>
                  </div>
                ))}
                {/* Stress */}
                <div>
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em]" style={{color:INK_OFF}}>Stress</p>
                      <p className="text-xs mt-0.5" style={{color:INK_OFF}}>Current: <span style={{color:CORAL}}>High</span></p>
                    </div>
                    <span className="text-lg font-bold" style={{color:INK,fontFamily:F}}>{["High","Medium","Low"][stress]}</span>
                  </div>
                  <input type="range" min={0} max={2} step={1} value={stress} onChange={e=>setStress(parseInt(e.target.value))}
                    className="w-full h-2 rounded-full cursor-pointer appearance-none" style={{accentColor:GREEN}}/>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs" style={{color:INK_DIM}}>High</span>
                    <span className="text-xs" style={{color:INK_DIM}}>Medium</span>
                    <span className="text-xs" style={{color:INK_DIM}}>Low</span>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button onClick={()=>setShowPlan(true)} className="px-6 py-3.5 text-sm font-bold rounded-full"
                    style={{background:GREEN,color:WHITE,fontFamily:F}}>
                    ✨ Build My Better Day
                  </button>
                  <button onClick={()=>{setSleep(6.25);setWater(4);setMove(15);setStress(0);setShowPlan(false);}}
                    className="px-6 py-3.5 text-sm font-semibold rounded-full"
                    style={{background:BG_ALT,color:INK,border:`1px solid ${INK_DIM}`}}>
                    Reset
                  </button>
                </div>
              </div>

              {/* Score panel */}
              <div className="px-8 py-8 flex flex-col justify-center" style={{background:BG_ALT}}>
                <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{color:INK_OFF}}>Projected Wellness Score</p>
                <div className="flex items-center gap-3 mb-3">
                  <span style={{fontFamily:F,fontWeight:300,fontSize:"2rem",color:INK_OFF,lineHeight:1}}>72</span>
                  <span style={{color:INK_OFF,fontSize:"1.2rem"}}>→</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span key={projected} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} transition={{duration:0.2}}
                      style={{fontFamily:F,fontWeight:800,fontSize:"3.5rem",color:diff>0?GREEN:INK,lineHeight:1}}>
                      {projected}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {diff>0 && (
                    <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} exit={{opacity:0}}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5 self-start"
                      style={{background:GREEN_BG,color:GREEN}}>
                      <span className="text-xs font-bold">+{diff} potential improvement</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {diff===0&&<div className="mb-5"/>}
                <div className="p-4 rounded-2xl" style={{background:BG,border:`1px solid ${INK_DIM}`}}>
                  <p className="text-xs uppercase tracking-[0.12em] mb-3" style={{color:INK_OFF}}>Biggest Impact</p>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{topImpact.icon}</span>
                    <div>
                      <p className="text-sm font-bold mb-1" style={{color:INK}}>{topImpact.name}</p>
                      <p className="text-xs leading-relaxed" style={{color:INK_OFF}}>{topImpact.msg}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs mt-4 leading-relaxed" style={{color:INK_DIM}}>This is a wellness estimate, not medical advice.</p>
              </div>
            </div>
          </div>

          {/* Build My Better Day panel */}
          <AnimatePresence>
            {showPlan && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                transition={{duration:0.38,ease:[0.25,0,0,1]}} style={{overflow:"hidden"}}>
                <div className="mt-6 rounded-3xl overflow-hidden" style={{border:`1.5px solid ${GREEN_L}`}}>
                  <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    style={{background:GREEN_BG,borderBottom:`1px solid ${INK_DIM}`}}>
                    <div>
                      <h3 style={{fontFamily:F,fontWeight:800,fontSize:"1.3rem",color:INK}}>Your Better Day ✨</h3>
                      <p className="text-sm mt-0.5" style={{color:INK_OFF}}>A simple plan based on the changes you selected.</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs uppercase tracking-[0.12em]" style={{color:INK_OFF}}>Potential score</p>
                      <p style={{fontFamily:F,fontWeight:800,fontSize:"2.2rem",color:GREEN,lineHeight:1}}>{projected}</p>
                    </div>
                  </div>
                  <div className="px-8 py-8" style={{background:BG}}>
                    <div className="relative pl-8">
                      <div className="absolute left-4 top-3 bottom-3 w-px" style={{background:INK_DIM}}/>
                      <div className="space-y-7">
                        {BETTER_DAY.map((item,i)=>(
                          <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.06,duration:0.25}}
                            className="relative">
                            <div className="absolute -left-8 top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{background:BG_MINT,border:`1.5px solid ${GREEN_L}`,fontSize:"11px"}}>
                              {item.icon}
                            </div>
                            <p className="text-xs uppercase tracking-[0.1em] mb-0.5" style={{color:INK_OFF}}>{item.time}</p>
                            <p className="text-sm font-bold" style={{color:INK}}>{item.cat}</p>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{color:INK_OFF}}>{item.tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-8 pt-6 flex-wrap" style={{borderTop:`1px solid ${INK_DIM}`}}>
                      <button className="px-5 py-3 text-sm font-bold rounded-full" style={{background:GREEN,color:WHITE}}>Save as Today's Plan</button>
                      <button onClick={()=>setPage("ai")} className="px-5 py-3 text-sm font-semibold rounded-full"
                        style={{background:BG_ALT,color:INK,border:`1px solid ${INK_DIM}`}}>
                        Ask AI to Improve This Plan
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* KEY INSIGHTS */}
      <div style={{background:BG_ALT}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <h2 style={{fontFamily:F,fontWeight:800,fontSize:"1.6rem",color:INK,letterSpacing:"-0.02em"}}>Key Insights</h2>
          <p className="text-sm mt-1 mb-8" style={{color:INK_OFF}}>Patterns based on your recent check-ins.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {INSIGHTS.map((ins,i)=>(
              <div key={i} className="p-6 rounded-2xl transition-all" style={{background:BG,border:`1px solid ${INK_DIM}`,cursor:"default"}}
                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 28px rgba(15,36,24,0.09)"}
                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.boxShadow="none"}>
                <div className="text-3xl mb-4">{ins.icon}</div>
                <Tag color={ins.badgeColor}>{ins.badge}</Tag>
                <h3 className="text-sm font-bold mt-3 mb-2" style={{color:INK}}>{ins.title}</h3>
                <p className="text-xs leading-relaxed mb-5" style={{color:INK_OFF}}>{ins.desc}</p>
                <button className="text-xs font-semibold flex items-center gap-1" style={{color:GREEN}}>
                  {ins.action} <ArrowRight size={11}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRY THIS TODAY */}
      <div style={{background:BG}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <h2 style={{fontFamily:F,fontWeight:800,fontSize:"1.6rem",color:INK,letterSpacing:"-0.02em"}}>Try This Today</h2>
          <p className="text-sm mt-1 mb-8" style={{color:INK_OFF}}>Small actions selected for your current wellness goals.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {ACTIVITIES.map((a,i)=>{
              const st=acts[i];
              return (
                <div key={i} className="p-6 rounded-2xl" style={{background:st==="done"?GREEN_BG:BG_ALT,border:`1.5px solid ${st==="done"?GREEN_L:INK_DIM}`,transition:"all 300ms"}}>
                  <div className="text-3xl mb-3">{st==="done"?"✅":a.icon}</div>
                  <h3 className="text-sm font-bold mb-1" style={{color:INK}}>{a.title}</h3>
                  <p className="text-xs mb-1" style={{color:INK_OFF}}>Best for: <span style={{color:GREEN,fontWeight:600}}>{a.best}</span></p>
                  <p className="text-xs mb-6" style={{color:INK_OFF}}>Duration: {a.duration}</p>
                  <motion.button whileTap={{scale:0.96}} onClick={()=>st==="idle"&&startAct(i)} disabled={st!=="idle"}
                    className="px-5 py-2.5 text-xs font-bold rounded-full transition-all"
                    style={{background:st==="done"?GREEN:st==="progress"?BG_SAGE:GREEN,color:st==="progress"?INK:WHITE,opacity:st==="progress"?0.75:1}}>
                    {st==="idle"?a.cta:st==="progress"?"In Progress…":"Completed ✓"}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AROUND YOU */}
      <div style={{background:BG_CREAM}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 style={{fontFamily:F,fontWeight:800,fontSize:"1.6rem",color:INK,letterSpacing:"-0.02em"}}>Around You</h2>
              <p className="text-sm mt-1" style={{color:INK_OFF}}>Things happening nearby that support your wellness.</p>
            </div>
            <select value={city} onChange={e=>setCity(e.target.value)} className="text-sm px-4 py-2 rounded-full focus:outline-none cursor-pointer"
              style={{background:BG,border:`1px solid ${INK_DIM}`,color:INK,fontFamily:F}}>
              <option>Abu Dhabi</option>
              <option>Dubai</option>
            </select>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4" style={{scrollbarWidth:"none"}}>
            {(LAB_EVENTS[city]||[]).map(ev=>(
              <div key={ev.id} className="flex-shrink-0 rounded-2xl overflow-hidden" style={{width:272,background:BG,border:`1px solid ${INK_DIM}`}}>
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img src={ev.img} alt={ev.title} style={{width:"100%",height:"100%",objectFit:"cover"}}
                    onError={e=>(e.currentTarget as HTMLImageElement).style.display="none"}/>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold mb-1" style={{color:INK}}>{ev.title}</h3>
                  <p className="text-xs mb-1" style={{color:INK_OFF}}>📍 {ev.location}</p>
                  <p className="text-xs mb-3 font-medium" style={{color:GREEN}}>{ev.time}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ev.tags.map(t=><span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{background:BG_MINT,color:INK_OFF}}>{t}</span>)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleSave(ev.id)} className="flex-1 py-2 text-xs font-semibold rounded-full transition-all"
                      style={{background:saved.has(ev.id)?GREEN_BG:BG_ALT,color:saved.has(ev.id)?GREEN:INK_OFF,border:`1px solid ${saved.has(ev.id)?GREEN_L:INK_DIM}`}}>
                      {saved.has(ev.id)?"🔖 Saved":"Save"}
                    </button>
                    <button className="flex-1 py-2 text-xs font-semibold rounded-full" style={{background:BG_MINT,color:INK}}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="text-sm font-semibold inline-flex items-center gap-1.5" style={{color:GREEN}}>
              See All Activities <ArrowUpRight size={13}/>
            </button>
          </div>
        </div>
      </div>

      {/* WELLNESS EXPERIMENTS */}
      <div style={{background:BG}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <h2 style={{fontFamily:F,fontWeight:800,fontSize:"1.6rem",color:INK,letterSpacing:"-0.02em"}}>Wellness Experiments 🧪</h2>
          <p className="text-sm mt-1 mb-8" style={{color:INK_OFF}}>Try a small habit and see how it affects how you feel.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {/* Active */}
            <div className="p-6 rounded-2xl" style={{background:BG_MINT,border:`1.5px solid ${GREEN_L}`}}>
              <Tag color="green">Active Experiment</Tag>
              <div className="text-3xl mt-4 mb-3">💧</div>
              <h3 className="text-sm font-bold mb-1" style={{color:INK}}>Morning Water Experiment</h3>
              <p className="text-xs mb-4 leading-relaxed" style={{color:INK_OFF}}>Drink one glass of water within 30 minutes of waking for 5 days.</p>
              <p className="text-xs mb-2 font-semibold" style={{color:INK}}>Day 3 of 5</p>
              <div className="flex gap-1.5 mb-4">{[0,1,2,3,4].map(d=><span key={d} className="text-lg">{expDays.has(d)?"🔥":"○"}</span>)}</div>
              <p className="text-xs mb-5" style={{color:INK_OFF}}>Watching: <span style={{color:GREEN,fontWeight:600}}>Energy + Mood</span></p>
              <button className="px-5 py-2.5 text-xs font-bold rounded-full" style={{background:GREEN,color:WHITE}}>Check In Today</button>
            </div>
            {/* Suggested */}
            {[{icon:"🌙",title:"Screen-Free Wind Down",desc:"Avoid screens for 30 minutes before bed for 5 nights."},{icon:"🚶",title:"10-Minute After-Lunch Walk",desc:"Walk for 10 minutes after lunch for 5 days."}].map(ex=>(
              <div key={ex.title} className="p-6 rounded-2xl" style={{background:BG_ALT,border:`1px solid ${INK_DIM}`}}>
                <div className="text-3xl mb-3">{ex.icon}</div>
                <h3 className="text-sm font-bold mb-1" style={{color:INK}}>{ex.title}</h3>
                <p className="text-xs mb-6 leading-relaxed" style={{color:INK_OFF}}>{ex.desc}</p>
                <button className="px-5 py-2.5 text-xs font-bold rounded-full" style={{background:BG,color:GREEN,border:`1px solid ${GREEN_L}`}}>Try Experiment</button>
              </div>
            ))}
          </div>

          {/* Result state */}
          <div className="mt-8 p-8 rounded-3xl" style={{background:BG_ALT,border:`1.5px solid ${GREEN_L}`}}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-3xl mb-3">🎉</div>
                <Tag color="green">Experiment Complete</Tag>
                <h3 style={{fontFamily:F,fontWeight:800,fontSize:"1.2rem",color:INK,margin:"1rem 0 0.5rem"}}>Morning Water Experiment</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{color:INK_OFF}}>
                  Your average morning energy was slightly higher on the days you completed this experiment.
                </p>
                <p className="text-xs italic mb-5" style={{color:INK_DIM}}>Based on self-reported check-ins. Not a clinical conclusion.</p>
                <div className="flex gap-3 flex-wrap">
                  <button className="px-5 py-2.5 text-xs font-bold rounded-full" style={{background:GREEN,color:WHITE}}>Keep This Habit</button>
                  <button className="px-5 py-2.5 text-xs font-bold rounded-full" style={{background:BG,color:INK,border:`1px solid ${INK_DIM}`}}>Try Another</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {([["Before","6.2 / 10",CORAL_BG,CORAL],["During experiment","7.1 / 10",GREEN_BG,GREEN]] as [string,string,string,string][]).map(([l,v,bg,c])=>(
                  <div key={l} className="p-5 rounded-2xl text-center" style={{background:bg}}>
                    <p className="text-xs mb-2" style={{color:INK_OFF}}>{l}</p>
                    <p className="text-2xl font-bold" style={{color:c,fontFamily:F}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMING UP */}
      <div style={{background:BG_ALT}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <h2 style={{fontFamily:F,fontWeight:800,fontSize:"1.6rem",color:INK,letterSpacing:"-0.02em",marginBottom:"2rem"}}>Coming Up</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              {COMING_UP.map(day=>(
                <div key={day.day} className="mb-6">
                  <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{color:INK_OFF}}>{day.day}</p>
                  {day.items.map(item=>(
                    <button key={item} onClick={()=>toggleGoal(item)}
                      className="flex items-center gap-3 w-full text-left py-3.5 px-1 transition-all"
                      style={{borderBottom:`1px solid ${INK_DIM}`}}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{background:doneGoals.has(item)?GREEN:BG,border:`1.5px solid ${doneGoals.has(item)?GREEN:INK_DIM}`,transition:"all 200ms"}}>
                        {doneGoals.has(item)&&<span style={{color:WHITE,fontSize:"10px"}}>✓</span>}
                      </div>
                      <span className="text-sm leading-relaxed" style={{color:doneGoals.has(item)?INK_OFF:INK,textDecoration:doneGoals.has(item)?"line-through":"none",transition:"all 200ms"}}>{item}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            {/* AI Coach preview */}
            <div className="p-8 rounded-3xl flex flex-col" style={{background:BG_MINT,border:`1.5px solid ${INK_DIM}`}}>
              <Tag color="green">Wellness AI</Tag>
              <h3 style={{fontFamily:F,fontWeight:800,fontSize:"1.2rem",color:INK,margin:"1rem 0 0.5rem"}}>Ask Your Wellness Coach ✨</h3>
              <p className="text-sm mb-6" style={{color:INK_OFF}}>Want help deciding what to focus on next?</p>
              <div className="flex items-center rounded-xl overflow-hidden mb-4" style={{background:BG,border:`1px solid ${INK_DIM}`}}>
                <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setPage("ai")}
                  placeholder="Ask anything about your wellness plan…"
                  className="flex-1 px-4 py-3 text-sm bg-transparent focus:outline-none" style={{color:INK,fontFamily:F}}/>
                <button onClick={()=>setPage("ai")} className="px-4 py-3 text-xs font-bold flex items-center gap-1.5"
                  style={{background:GREEN,color:WHITE}}>Ask <Send size={11}/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_CHIPS.map(c=>(
                  <button key={c} onClick={()=>setPage("ai")} className="px-3 py-1.5 text-xs rounded-full transition-all"
                    style={{background:BG,border:`1px solid ${INK_DIM}`,color:INK_OFF,fontFamily:F}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG_ALT;(e.currentTarget as HTMLButtonElement).style.color=INK;}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=BG;(e.currentTarget as HTMLButtonElement).style.color=INK_OFF;}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter setPage={setPage}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
function MainApp({ phase }: { phase:Phase }) {
  const [page,setPage]=useState<Page>("home");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const mainRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{ if (mainRef.current) mainRef.current.scrollTop=0; },[page]);
  useEffect(()=>{ if (phase==="1" && PHASE2_PAGES.includes(page)) setPage("home"); },[phase, page]);

  return (
    <PhaseCtx.Provider value={phase}>
    <div className="flex flex-col h-full" style={{ background:BG }}>
      <SiteNav active={page} setPage={setPage} onDrawer={()=>setDrawerOpen(true)} phase={phase}/>
      <SiteDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} active={page} setPage={setPage} phase={phase}/>
      <main ref={mainRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.12}}>
            {page==="home"        && <HomePage setPage={setPage} phase={phase}/>}
            {page==="approach"    && <OurApproachPage setPage={setPage}/>}
            {page==="updates"     && <LatestUpdatesPage/>}
            {page==="about"       && <AboutUsPage/>}
            {page==="schools"     && <SchoolsPage setPage={setPage}/>}
            {page==="research"    && <ResearchPage setPage={setPage}/>}
            {page==="tools"       && phase==="2" && <ToolsPage setPage={setPage}/>}
            {page==="mealplans"   && phase==="2" && <MealPlanPage/>}
            {page==="workout"     && phase==="2" && <WorkoutPage/>}
            {page==="wellness"    && phase==="2" && <WellnessPage/>}
            {page==="collaborate" && <CollaboratePage/>}
            {page==="scanner"     && phase==="2" && <ScannerPage phase={phase}/>}
            {page==="rewards"     && phase==="2" && <RewardsPage phase={phase}/>}
            {page==="communities" && phase==="2" && <CommunitiesPage phase={phase}/>}
            {page==="partners"    && <PartnersPage setPage={setPage}/>}
            {page==="press"       && <PressPage/>}
            {page==="faq"         && <FAQPage setPage={setPage}/>}
            {page==="ai"          && <AskAIPage/>}
            {page==="lab"         && <WellnessLabPage setPage={setPage}/>}
          </motion.div>
        </AnimatePresence>
      </main>
      <AIChatBubble/>
    </div>
    </PhaseCtx.Provider>
  );
}

export default function App() {
  const [phase,setPhase]=useState<Phase>("1");
  const [sahatnaOpen,setSahatnaOpen]=useState(false);
  useEffect(()=>{
    const handler=()=>setSahatnaOpen(true);
    window.addEventListener("sahatna:open",handler);
    return ()=>window.removeEventListener("sahatna:open",handler);
  },[]);
  return (
    <div className="h-full" style={{ background:BG }}>
      <PhaseToggle phase={phase} setPhase={setPhase}/>
      <div className="h-full pt-9">
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.12}} className="h-full">
            <MainApp phase={phase}/>
          </motion.div>
        </AnimatePresence>
      </div>
      <SahatnaSignInModal open={sahatnaOpen} onClose={()=>setSahatnaOpen(false)}/>
    </div>
  );
}
