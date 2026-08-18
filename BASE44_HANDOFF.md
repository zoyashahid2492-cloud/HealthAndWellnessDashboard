# Give this website to Base44

The live design at **https://healthyliving.figma.site** is this exact React + Vite app.

Do **not** import `cursor/build-healthy-living-website-a451` from the Cursor workspace. Base44 is connected to a different GitHub account, so that branch looks like a 404 even though the repo is public.

## Fastest working method

1. In the **same GitHub account connected to Base44**, fork:
   https://github.com/zoyashahid2492-cloud/HealthAndWellnessDashboard
2. In Base44, import **your fork**, branch `main` or `cursor/build-healthy-living-website-a451`.
3. Use these settings:

```text
Framework: React + Vite
Install: npm install
Dev: npm run dev
Build: npm run build
Output: dist
Env vars: none
```

## If Base44 cannot import GitHub

Create a new Base44 app and paste the prompt below.

---

# Base44 prompt — recreate https://healthyliving.figma.site exactly

Build a fully interactive public website that looks and behaves exactly like https://healthyliving.figma.site.

This is **Healthy Living Abu Dhabi**, a government wellness website. It must feel civic, calm, premium, and human — not like a startup fitness app.

## Design system (match exactly)

Font: Plus Jakarta Sans (Google Fonts), used everywhere.

Colors:
- Background white: `#FFFFFF`
- Alt background: `#F4F9F6`
- Mint: `#E5F2EB`
- Sage: `#D0E8DC`
- Peach: `#FDF1EC`
- Cream: `#FBF8F3`
- Ink: `#0F2418`
- Muted text: `rgba(15,36,24,0.5)`
- Hairline: `rgba(15,36,24,0.1)`
- Primary green: `#2A8A58`
- Light green: `#5BAF85`
- Green tint: `#EBF7F1`
- Coral: `#E8724E`
- Coral tint: `#FDF0EB`

UI rules:
- Pill buttons, fully rounded
- Cards 16–24px radius
- Generous whitespace
- Uppercase tracking labels
- Sticky top nav
- Floating “Ask AI” bubble bottom-right
- No neon, no dark mode, no hospital aesthetic

Logo:
`https://healthyliving.abudhabi/wp-content/uploads/2025/12/cropped-logo.png`

Photos:
- Hero: `https://healthyliving.abudhabi/wp-content/uploads/2025/12/hero-bg-3.png`
- Runner: `https://healthyliving.abudhabi/wp-content/uploads/2026/02/5a782eeafcf85327081d87e6ee59047151b61e1e-scaled.webp`
- Corniche: `https://healthyliving.abudhabi/wp-content/uploads/2026/01/71e4cdd5655c3ac5168eeaff712547e11ad47713-scaled.jpg`
- Food: Unsplash healthy bowl
- Community / rect images from healthyliving.abudhabi

## Prototype toggle

A thin top bar:
`PROTOTYPE` + toggle `Phase 1 — Initial Launch` / `Phase 2 — Full Vision`

Phase 1 hides tools, rewards, communities, scanner.
Phase 2 shows them.

## Navigation

Centered bilingual logo.

Phase 1:
Healthy Living (Our Approach, Updates, About Us) · Schools & Children · Global & Research · Collaborate · Wellness Lab · More (Partners, Press, FAQ, Ask AI) · green Ask AI button

Phase 2:
Healthy Living · Schools & Children · Global & Research · Tools (Meal Plan Generator, Workout Planner, Wellness Check) · Collaborate · More (Wellness Lab, Rewards, Communities, Scan Label, Partners, Press, FAQ, Ask AI)

Hamburger drawer on mobile. Footer with Explore / Tools / Info columns + Connect to Sahatna.

## Pages and exact content

### Home
Hero gradient mint → peach.
Eyebrow: Abu Dhabi Government Initiative
H1: Discover. Learn. **Live healthier.**
Body: Abu Dhabi's government-led ecosystem empowering individuals, families, schools, and researchers to make healthy living the easy choice.
CTAs: Phase 1 “Explore Healthy Living” + “Explore Research”. Phase 2 primary CTA “Create a Wellness Plan”.
Sahatna banner: Personal health tracking, device sync & health records / Continue your health journey in Sahatna / Connect to Sahatna

Today’s Wellness Plan card:
Ask 3 questions — sleep (Poor/Okay/Great), energy (Low/Normal/High), stress (Low/Medium/High).
Generate a short daily plan. Then “Ask AI About My Plan”.

Who is this for? 4 cards: Individuals, Families, Researchers, Organisations.

Phase 2 only strip: Useful tools. No sign-up required. Buttons to Meal Plan, Workout, Wellness Check.

Active Lifestyles photo + “Move more. Live longer.”
Schools + Research split cards.
Stats: 120,000+ Residents engaged · 500+ Nutri-Mark products · 25 Strategic initiatives · 8 Research categories
Latest Updates 4 news cards.

### Our Approach
Accordion: Active Lifestyles, Healthy Eating, Prevention-First.
Process: Understand / Design / Partner / Measure.
Healthy Living vs Sahatna comparison.

### Schools & Children
Stats: 42,000+ students, 380 schools, 94% awareness, 68% behaviour change.
Areas: Students / Families / Schools.
Influence & Mobilization list.

### Global & Research
Headline: Setting a global benchmark for progressive health policy.
Topic filters + publication list (PDF buttons).
Email subscribe box.
Collaborate CTA.

### Collaborate
Audience cards + form: Name, Organisation, Role, Area of Interest, Type of Collaboration, Message, Contact. Success: Message received.

### Wellness Lab
Header + Wellness Score 72, ↑ 4 this week, biggest opportunity Sleep consistency.
What-if sliders: Sleep, Water, Movement, Stress. Projected score 72 → live number.
Build My Better Day timeline.
Key Insights, Try This Today, Around You city filter (Abu Dhabi/Dubai), Experiments, Coming Up, Ask Wellness Coach chips.

### Tools (Phase 2)
Meal Plan Generator, Workout Planner, Wellness Check. All client-side, no backend. After results, “Continue in Sahatna”.

### Phase 2 extras
Rewards, Communities, Scan Label. In Phase 1 show Coming Soon / Connect to Sahatna gates.

### Supporting pages
Updates, About Us timeline, Partners, Press, FAQ, Ask AI chat page.

### Sahatna
Modal sign-in, not a real auth system. Never duplicate personal health tracking.

## Interactions
Page fade transitions, slider-driven score animation, form success states, AI chat replies for Research / Schools / Tools / Collaborate.

Keep everything frontend-only. No database. No environment variables.
