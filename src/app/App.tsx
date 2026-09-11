import type { LucideIcon } from "lucide-react";
import { ArrowRight, Leaf, Search, ShieldCheck, Sprout } from "lucide-react";

const LOGO_URL = "https://healthyliving.abudhabi/wp-content/uploads/2025/12/cropped-logo.png";
const IMG_HERO = "https://healthyliving.abudhabi/wp-content/uploads/2025/12/911eaeffcf59b39142cc7e2f3fad1086fd10d771-scaled.png";
const IMG_WALK = "/generated/movement-reference.jpg";

const navItems = ["How we live", "Who we help", "Global & Research", "HealthyLiving AI", "Resources"];
const filterGroups = [
  ["All", "Food", "Movement", "Mind"],
  ["Low", "Medium", "High"],
  ["Office", "Home", "Outdoors"],
];

const updates = [
  ["News", "Festival of Health returns to Abu Dhabi for its largest edition yet", "4 min read"],
  ["Policy", "Nutri-Mark front-of-pack labelling prepares for federal rollout", "3 min read"],
  ["Research", "Healthy Living reaches 466 workforce across Abu Dhabi", "6 min read"],
  ["Schools", "Out-of-home advertising policy now covers all public-facing government assets", "5 min read"],
];

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className={`logo ${light ? "logo--light" : ""}`} href="#top" aria-label="Healthy Living Abu Dhabi home">
      <span>HEALTHY</span>
      <strong>LIVING</strong>
      <small>ABU DHABI</small>
    </a>
  );
}

function NavBar({ dark = false }: { dark?: boolean }) {
  return (
    <nav className={`nav ${dark ? "nav--dark" : ""}`} aria-label="Primary navigation">
      <div className="nav__inner">
        <a href="#top">How we live</a>
        <a href="#pillars">Who we help</a>
        <a href="#research">Global & Research</a>
        <Logo light={dark} />
        <a href="#ai">HealthyLiving AI</a>
        <a href="#updates">The 466 data</a>
        <a href="#updates">News</a>
        <a className="nav__pill" href="#today">Arabic</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <img className="hero__image" src={IMG_HERO} alt="Abu Dhabi waterfront with people choosing a healthier lifestyle" />
      <div className="hero__scrim" />
      <header className="hero__top">
        <div className="hero__links">
          {navItems.slice(0, 3).map((item) => <a key={item} href="#pillars">{item}</a>)}
        </div>
        <Logo light />
        <div className="hero__links hero__links--right">
          {navItems.slice(3).map((item) => <a key={item} href="#updates">{item}</a>)}
          <a href="#" aria-label="Arabic language">AR</a>
        </div>
      </header>
      <div className="hero__content">
        <p className="eyebrow">Healthy Living Abu Dhabi</p>
        <h1>Healthier choices.<br />Healthier lives.<br /><span>Healthier futures.</span></h1>
        <p className="hero__copy">Personal health tracking, device sync &amp; health records. Continue your health journey in Sahatna.</p>
        <div className="hero__actions">
          <a className="button button--white" href="#today">Choose healthier, every day</a>
          <a className="button button--ghost" href="#pillars">How we work</a>
        </div>
        <a className="button button--green" href="#ai">Connect to Sahatna</a>
      </div>
    </section>
  );
}

function WellnessPlan() {
  return (
    <section id="today" className="wellness">
      <NavBar />
      <div className="wellness__intro">
        <h2>Health is shaped<br />by everyday life,<br />not healthcare alone.</h2>
        <p>Healthy Living transforms the environments behind our daily decisions, making the healthier choice the easy one, while shaping tomorrow's healthier futures.</p>
        <p>By uniting government, business and communities, we build prevention into everyday life so everyone in Abu Dhabi can live longer, healthier lives.</p>
      </div>
      <div className="plan-card">
        <div className="plan-card__head">
          <h3>Today&apos;s wellness plan</h3>
          <span>Personal in 3 simple steps</span>
        </div>
        <div className="plan-card__body">
          <div className="plan-card__field"><Search size={14} /> Ask for today&apos;s healthy step</div>
          {filterGroups.map((group, index) => (
            <div className="chips" key={index}>{group.map((label, i) => <button className={i === 0 ? "active" : ""} key={label}>{label}</button>)}</div>
          ))}
        </div>
        <button className="button button--dark">Create My Plan</button>
      </div>
    </section>
  );
}

function Pillars() {
  const pillars: { Icon: LucideIcon; label: string; title: string; body: string }[] = [
    { Icon: Leaf, label: "Pillar 01", title: "Healthier Choices", body: "Where the healthy option is the easy one." },
    { Icon: ShieldCheck, label: "Pillar 02", title: "Prevention", body: "Acting early, in the places that shape our health." },
    { Icon: Sprout, label: "Pillar 03", title: "Healthier Together", body: "Government, business and community, acting as one." },
  ];

  return (
    <section id="pillars" className="pillars">
      <NavBar />
      <p className="section-kicker">Healthy Living Abu Dhabi</p>
      <h2>Three pillars. One shared goal.</h2>
      <div className="pillar-grid">
        {pillars.map(({ Icon, label, title, body }) => (
          <article className="pillar" key={title}>
            <span>{label}</span>
            <div className="pillar__icon"><Icon size={23} strokeWidth={1.7} /></div>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ImageStatement() {
  return (
    <section className="statement">
      <img src={IMG_WALK} alt="A woman walking on Abu Dhabi's waterfront skyline" />
      <span className="sr-only">Healthy living, shaped around real life. Movement.</span>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="research">
      <NavBar dark />
      <div className="research__cards">
        <article>
          <p>Healthier eating. Everywhere.</p>
          <h3>Healthier eating. Everywhere.</h3>
          <span>Transforming food environments and nutrition choices in everyday settings.</span>
        </article>
        <article>
          <p>Global research</p>
          <h3>Setting a global benchmark.</h3>
          <span>Data, behaviour science, and policy partnerships for healthier living at scale.</span>
        </article>
      </div>
      <p className="section-kicker section-kicker--dark">Real change, already underway</p>
      <div className="stats">
        <article><strong>466+</strong><span>Schools and workplaces in active Healthy Living pilots</span></article>
        <article><strong>200+</strong><span>Activities every week across Abu Dhabi</span></article>
        <article><strong className="stat--coral">10 - 25%</strong><span>Sugar and salt reduction targets in food products</span></article>
        <article><strong>Zero</strong><span>Unhealthy food and drink ads in public spaces</span></article>
      </div>
    </section>
  );
}

function Updates() {
  return (
    <section id="updates" className="updates">
      <NavBar />
      <div className="updates__cta">
        <div>
          <strong>Personal health tracking, device sync and health records</strong>
          <span>Continue your journey in Sahatna.</span>
        </div>
        <a className="button button--dark" href="#top">Connect to Sahatna</a>
      </div>
      <div className="updates__heading">
        <h2>Latest updates</h2>
        <a href="#">View all</a>
      </div>
      <div className="news-list">
        {updates.map(([tag, title, read]) => (
          <article key={title}>
            <span>{tag}</span>
            <h3>{title}</h3>
            <p>{read}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  return (
    <main>
      <Hero />
      <WellnessPlan />
      <Pillars />
      <ImageStatement />
      <Research />
      <Updates />
      <style>{styles}</style>
    </main>
  );
}

const styles = `
:root {
  --ink: #0f2418;
  --ink-soft: rgba(15, 36, 24, 0.62);
  --ink-faint: rgba(15, 36, 24, 0.12);
  --forest: #0b2418;
  --forest-2: #102c1f;
  --green: #2f8b5b;
  --mint: #ecf4ee;
  --sage: #dbe9df;
  --paper: #fafaf5;
  --coral: #df7b58;
  --white: #ffffff;
  font-family: 'Plus Jakarta Sans', Arial, sans-serif;
  color: var(--ink);
  background: var(--paper);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); }
a { color: inherit; text-decoration: none; }
button { font: inherit; }
main { min-height: 100vh; overflow: hidden; background: var(--paper); }

.logo {
  display: inline-grid;
  place-items: center;
  gap: 0;
  min-width: 96px;
  color: var(--green);
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -0.04em;
  text-align: center;
  text-transform: uppercase;
}
.logo span { font-size: 10px; }
.logo strong { font-size: 13px; }
.logo small { font-size: 7px; letter-spacing: 0.09em; font-weight: 700; }
.logo--light { color: var(--white); }

.button {
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: 12px;
  font-weight: 800;
  justify-content: center;
  min-height: 40px;
  padding: 0 22px;
  transition: transform .2s ease, background .2s ease;
}
.button:hover { transform: translateY(-1px); }
.button--white { background: var(--white); color: var(--ink); }
.button--ghost { border: 1px solid rgba(255,255,255,.58); color: var(--white); }
.button--green { background: var(--green); color: var(--white); margin-top: 16px; min-width: 160px; }
.button--dark { background: var(--forest); color: var(--white); }

.hero {
  color: var(--white);
  min-height: 760px;
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
}
.hero__image, .statement img {
  height: 100%;
  inset: 0;
  object-fit: cover;
  position: absolute;
  width: 100%;
  z-index: -2;
}
.hero__image { object-position: center top; }
.hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(7, 18, 12, .42), rgba(7, 18, 12, .16) 38%, rgba(7, 18, 12, .45)), radial-gradient(circle at 50% 45%, transparent 0 22%, rgba(0,0,0,.28) 72%);
  z-index: -1;
}
.hero__top {
  align-items: start;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  left: 0;
  padding: 22px clamp(20px, 5vw, 70px);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}
.hero__links { display: flex; gap: 32px; font-size: 10px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.hero__links--right { justify-content: flex-end; }
.hero__content { margin-top: 36px; max-width: 760px; padding: 0 24px; text-align: center; }
.eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .11em; margin: 0 0 18px; text-transform: uppercase; }
.hero h1 { font-size: clamp(48px, 7vw, 86px); font-weight: 800; letter-spacing: -.07em; line-height: .84; margin: 0; }
.hero h1 span { color: #87caa2; }
.hero__copy { font-size: 14px; line-height: 1.7; margin: 28px auto 0; max-width: 690px; opacity: .92; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 25px; }

.nav { height: 54px; border-bottom: 1px solid var(--ink-faint); border-top: 1px solid rgba(15,36,24,.06); background: rgba(250,250,245,.92); }
.nav--dark { background: #0c261a; border-color: rgba(255,255,255,.12); color: rgba(255,255,255,.74); }
.nav__inner { align-items: center; display: grid; gap: 12px; grid-template-columns: repeat(4, minmax(0, 1fr)) auto repeat(4, minmax(0, 1fr)); height: 100%; margin: 0 auto; max-width: 1420px; padding: 0 22px; }
.nav a { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-align: center; text-transform: uppercase; white-space: nowrap; }
.nav__pill { border: 1px solid currentColor; border-radius: 99px; padding: 4px 9px; justify-self: center; }

.wellness { background: var(--mint); }
.wellness__intro {
  display: grid;
  gap: clamp(28px, 5vw, 92px);
  grid-template-columns: minmax(320px, 1.05fr) repeat(2, minmax(220px, .55fr));
  margin: 0 auto;
  max-width: 1180px;
  padding: 74px 28px 34px;
}
.wellness h2 { font-size: clamp(38px, 6vw, 72px); font-weight: 800; letter-spacing: -.07em; line-height: .87; margin: 0; }
.wellness__intro p { color: var(--ink-soft); font-size: 15px; line-height: 1.72; margin: 0; }
.plan-card {
  background: rgba(255,255,255,.68);
  border: 1px solid rgba(15,36,24,.08);
  border-radius: 18px;
  box-shadow: 0 26px 70px rgba(42, 70, 52, .09);
  margin: 14px auto 76px;
  max-width: 1080px;
  padding: 20px;
}
.plan-card__head { align-items: center; display: flex; justify-content: space-between; margin-bottom: 16px; }
.plan-card h3 { font-size: 20px; letter-spacing: -.04em; margin: 0; }
.plan-card__head span { color: var(--ink-soft); font-size: 11px; font-weight: 700; text-transform: uppercase; }
.plan-card__body { align-items: center; display: grid; gap: 12px; grid-template-columns: 1.35fr repeat(3, 1fr); margin-bottom: 14px; }
.plan-card__field { align-items: center; background: var(--paper); border: 1px solid var(--ink-faint); border-radius: 999px; color: var(--ink-soft); display: flex; gap: 8px; font-size: 12px; min-height: 38px; padding: 0 14px; }
.chips { background: var(--paper); border-radius: 999px; display: flex; gap: 4px; padding: 4px; }
.chips button { background: transparent; border: 0; border-radius: 999px; color: var(--ink-soft); cursor: pointer; flex: 1; font-size: 10px; font-weight: 800; padding: 8px 10px; }
.chips button.active { background: var(--green); color: var(--white); }

.pillars { background: var(--paper); padding-bottom: 110px; text-align: center; }
.section-kicker { color: rgba(15,36,24,.36); font-size: 10px; font-weight: 800; letter-spacing: .18em; margin: 96px 0 18px; text-transform: uppercase; }
.pillars h2 { font-size: clamp(34px, 4.2vw, 58px); font-weight: 800; letter-spacing: -.055em; line-height: .95; margin: 0 auto 78px; }
.pillar-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0 auto; max-width: 940px; }
.pillar { border-right: 1px solid rgba(15,36,24,.08); padding: 0 54px; }
.pillar:last-child { border-right: 0; }
.pillar span { color: rgba(15,36,24,.32); font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.pillar__icon { align-items: center; border: 1px solid rgba(47,139,91,.35); border-radius: 999px; color: var(--green); display: inline-flex; height: 45px; justify-content: center; margin: 20px 0 20px; width: 45px; }
.pillar h3 { font-size: 19px; letter-spacing: -.04em; margin: 0 0 8px; }
.pillar p { color: var(--ink-soft); font-size: 12px; line-height: 1.55; margin: 0; }

.statement { color: var(--white); min-height: 760px; position: relative; display: grid; place-items: end center; isolation: isolate; overflow: hidden; }
.statement img { object-position: center center; }
.statement__scrim { background: linear-gradient(180deg, rgba(5,16,10,.18), rgba(5,16,10,.1) 40%, rgba(5,16,10,.44)); inset: 0; position: absolute; z-index: -1; }
.statement .logo { position: absolute; top: 48px; }
.statement p { bottom: 76px; font-size: 12px; left: 50%; letter-spacing: .02em; margin: 0; opacity: .86; position: absolute; transform: translateX(-50%); white-space: nowrap; }
.statement__letters { bottom: 155px; font-size: clamp(52px, 11vw, 150px); font-weight: 300; left: 50%; letter-spacing: .38em; line-height: 1; opacity: .72; position: absolute; text-indent: .38em; transform: translateX(-50%); }

.research { background: var(--forest); color: var(--white); padding-bottom: 90px; }
.research__cards { display: grid; gap: 22px; grid-template-columns: 1fr 1fr; margin: 58px auto 82px; max-width: 1180px; padding: 0 28px; }
.research__cards article { border: 1px solid rgba(255,255,255,.22); border-radius: 6px; min-height: 134px; padding: 28px; }
.research__cards p { color: #93c9a8; font-size: 11px; font-weight: 800; margin: 0 0 14px; }
.research__cards h3 { font-size: 20px; letter-spacing: -.04em; margin: 0 0 9px; }
.research__cards span { color: rgba(255,255,255,.54); display: block; font-size: 12px; line-height: 1.65; max-width: 480px; }
.section-kicker--dark { color: rgba(255,255,255,.44); margin: 0 0 38px; text-align: center; }
.stats { display: grid; gap: 28px; grid-template-columns: repeat(4, 1fr); margin: 0 auto; max-width: 1160px; padding: 0 28px; }
.stats article { text-align: center; }
.stats strong { color: #84cda1; display: block; font-size: clamp(42px, 5vw, 67px); font-weight: 800; letter-spacing: -.06em; line-height: .9; margin-bottom: 15px; }
.stats .stat--coral { color: var(--coral); }
.stats span { color: rgba(255,255,255,.72); display: block; font-size: 12px; font-weight: 700; line-height: 1.45; margin: 0 auto; max-width: 178px; }

.updates { background: var(--paper); padding-bottom: 96px; }
.updates__cta { align-items: center; display: flex; justify-content: space-between; margin: 36px auto 76px; max-width: 960px; padding: 0 28px; }
.updates__cta strong { display: block; font-size: 13px; letter-spacing: -.02em; }
.updates__cta span { color: var(--ink-soft); display: block; font-size: 11px; margin-top: 5px; }
.updates__heading { align-items: baseline; display: flex; justify-content: space-between; margin: 0 auto 32px; max-width: 960px; padding: 0 28px; }
.updates__heading h2 { font-size: clamp(32px, 5vw, 55px); font-weight: 800; letter-spacing: -.06em; margin: 0; }
.updates__heading a { color: var(--green); font-size: 12px; font-weight: 800; }
.news-list { margin: 0 auto; max-width: 960px; padding: 0 28px; }
.news-list article { align-items: center; border-top: 1px solid rgba(15,36,24,.12); display: grid; gap: 22px; grid-template-columns: 110px 1fr 90px; min-height: 64px; }
.news-list article:last-child { border-bottom: 1px solid rgba(15,36,24,.12); }
.news-list span { color: var(--green); font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.news-list h3 { font-size: 13px; font-weight: 800; letter-spacing: -.015em; margin: 0; }
.news-list p { color: var(--ink-soft); font-size: 11px; margin: 0; text-align: right; }

@media (max-width: 980px) {
  .hero { min-height: 680px; }
  .hero__links, .nav a:not(.logo):not(.nav__pill) { display: none; }
  .hero__top { display: flex; justify-content: center; }
  .nav__inner { display: flex; justify-content: space-between; }
  .wellness__intro, .plan-card__body, .pillar-grid, .research__cards, .stats { grid-template-columns: 1fr; }
  .pillar { border-right: 0; border-bottom: 1px solid rgba(15,36,24,.08); padding: 34px 28px; }
  .pillar:last-child { border-bottom: 0; }
  .statement { min-height: 620px; }
  .statement__letters { font-size: 48px; letter-spacing: .22em; text-indent: .22em; }
}

@media (max-width: 620px) {
  .hero { min-height: 610px; }
  .hero h1 { font-size: 45px; }
  .hero__actions, .updates__cta { align-items: stretch; flex-direction: column; }
  .wellness__intro { padding-top: 52px; }
  .plan-card { border-radius: 12px; margin-inline: 16px; }
  .plan-card__head { align-items: flex-start; flex-direction: column; gap: 8px; }
  .chips { overflow-x: auto; }
  .pillar-grid { margin-inline: 18px; }
  .statement__letters { font-size: 36px; }
  .research__cards, .stats, .updates__cta, .updates__heading, .news-list { padding-inline: 18px; }
  .news-list article { grid-template-columns: 1fr; gap: 6px; padding: 18px 0; }
  .news-list p { text-align: left; }
}
`;

export default App;
