# Healthy Living Abu Dhabi — Figma AI Prompt Pack
Two fully interactive prototype variants, page by page.

**How to use this:** Figma AI ("First Draft") works best on one focused screen at a time rather than one giant prompt. Paste the **Design System Primer** into your first generation (or into Figma AI's "brand/style" input if it has one), then paste each screen prompt one at a time, generating and refining before moving to the next. Reuse the primer language in every screen prompt so the AI stays visually consistent — I've already repeated the key style tokens inside each prompt for that reason.

---

## 0. Shared Design System Primer
*(Paste this first, or first, at the start of every session)*

```
Design a fresh, modern public-health web platform called "Healthy Living" for Abu Dhabi 
government. This is a real government-led wellness initiative — tone should feel 
trustworthy, optimistic, and civic, not like a startup or fitness app. Avoid neon/gamer 
aesthetics; avoid anything that feels like a private health-tech product.

VISUAL DIRECTION:
- Warm, human, sunlit palette: sandstone/off-white background (#F7F4EF), deep teal 
  primary (#0E5C56), warm coral/terracotta accent (#E8734A), soft sage green secondary 
  (#8FB89A), charcoal text (#22262B)
- Generous whitespace, soft rounded cards (16-20px radius), soft drop shadows, no harsh 
  neon glows
- Typography: a humanist grotesk display font (e.g. "Fixel Display" or "General Sans") 
  for headlines, and a clean readable sans (e.g. "Inter" or "IBM Plex Sans") for body — 
  bilingual-ready (Latin + Arabic), left-to-right with a note that Arabic RTL layout must 
  mirror cleanly
- Photography style: real people across different ages in Abu Dhabi settings — parks, 
  markets, gyms, family kitchens, corniche walks — bright and natural, not stock-generic
- Iconography: simple line icons, 2px stroke, rounded joins
- Component style: pill-shaped buttons, soft segmented tabs, card-based content blocks, 
  subtle motion (fade/slide-in on scroll, no flashy gamified glow effects)
- Include a persistent top nav with EN/AR language toggle, and a floating AI assistant 
  chat bubble bottom-right on every page

CONTENT FOUNDATION (use consistently across all screens):
- Program name: "Healthy Living"
- Tagline: "Making healthy living the easy choice for all"
- Mission line: "Healthy Living is Abu Dhabi's government-led program empowering every 
  citizen and resident to live longer, healthier, more fulfilling lives."
- Three core priorities: "Active Lifestyles", "Healthy Eating", "Prevention-First"
- Real initiative names to reference in content: "Degayeg Initiative", "Festival of 
  Health", "Nutri-Mark Label", "OOH Healthy Policy"
- Primary nav sections: Our Approach / Latest Updates / About Us
```

---

## VARIANT A — "Connected & Rewarded"
Wearable sync, progress tracking, rewards, policy library, AI assistant — public-facing marketing site with a personal account layer.

### A1. Home
```
Design the homepage for the Healthy Living "Connected & Rewarded" variant, using the 
Healthy Living design system (sandstone background, deep teal #0E5C56, coral accent 
#E8734A, sage green, rounded cards, humanist display font).

Sections top to bottom:
1. Sticky nav: logo left, links "Our Approach / Latest Updates / Connect Your Watch / 
   Rewards / Policies / About Us", EN/AR toggle, and a pill "Connect a Device" CTA button
2. Hero: large headline "Making healthy living the easy choice for all", subline about 
   the government program, a primary CTA "Connect Your Wearable" and secondary CTA 
   "Explore Our Approach", with a soft illustrated background pattern (not a photo)
3. "Why connect your device" — 3-card row: "Track your real progress", "Earn community 
   rewards", "See Abu Dhabi's collective impact" each with a line icon and 1-2 line copy
4. "Our priorities" — 3 cards: Active Lifestyles, Healthy Eating, Prevention-First, each 
   with icon + short description
5. "Latest Updates" — horizontal scroll of 3 news cards with date, title, small tag 
   ("News"), e.g. Festival of Health 2025, National Health and Nutrition Survey, 25 
   strategic initiatives
6. "Our initiatives" — 4 pill-style link cards: Degayeg Initiative, Festival of Health, 
   Nutri-Mark Label, OOH Healthy Policy
7. Community stats strip: a light teal band with 3-4 big animated numbers (e.g. "120,000+ 
   residents connected", "2.3M steps logged this month", "540 rewards redeemed today") — 
   label clearly as illustrative sample data
8. Footer: nav links, social icons (Instagram, YouTube, LinkedIn, X), privacy/terms, 
   copyright

Include a floating rounded AI chat bubble bottom-right labeled "Ask Healthy Living AI".
```

### A2. Connect Your Wearable
```
Design a "Connect Your Wearable" onboarding/dashboard screen for Healthy Living, same 
design system (sandstone bg, teal/coral/sage, rounded cards, humanist type).

Layout:
1. Page header: "Connect your device, see your progress" with subline about privacy and 
   data control
2. Device connection cards in a 2x2 or horizontal row: Apple Health, Google Fit, Fitbit, 
   Samsung Health — each a card with logo placeholder, "Connect" pill button, and a 
   status chip (Connected / Not connected)
3. Below, a "Your data, your control" reassurance panel: 3 short bullet icons about what 
   data is used for (steps, sleep, activity) and a link "Manage permissions"
4. Once "connected" (show the connected state), reveal a simple progress summary card: 
   today's steps ring, active minutes, sleep hours, with a soft teal progress ring 
   component (not neon/glowing — flat, warm style)
5. A "Weekly trend" line/bar chart card showing steps and active minutes across 7 days, 
   soft teal and coral lines, light gridlines
6. Sidebar or bottom module: "Your rewards progress" mini-card linking to the Rewards page

Keep it calm and reassuring, not gamified/cinematic — this is a civic wellness tool, not 
a fitness app.
```

### A3. Rewards
```
Design a "Rewards" page for Healthy Living (Connected & Rewarded variant). Same design 
system: sandstone background, deep teal, coral accent, soft rounded cards.

Sections:
1. Header: "Your healthy habits, recognized" with a simple points/tier summary bar 
   (current tier name, points total, progress bar to next tier — 4 tiers e.g. "Getting 
   Started", "Building Momentum", "Community Leader", "Wellness Champion")
2. "Ways to earn" — grid of 6 simple cards: daily steps goal, weekly active minutes, 
   sleep consistency, attending a Festival of Health event, completing a health check-in, 
   referring a friend — each with icon + points value
3. "Redeem your points" — a horizontal card carousel of real-feeling partner rewards: 
   discount at a community gym, free entry to Festival of Health, a wellness product 
   voucher, a public park fitness class pass — each card shows points cost and a 
   "Redeem" pill button
4. "Community leaderboard (opt-in)" — simple, anonymized/first-name-only leaderboard 
   list, with a toggle "Show my ranking" and privacy note that this is opt-in only
5. Footer same as homepage

Tone: warm and encouraging, not competitive/aggressive gamification.
```

### A4. Policy Library
```
Design a "Policy Documents" page for Healthy Living where residents can browse and 
download official policy and strategy documents. Same design system.

Layout:
1. Header: "Policies & Strategy Documents" with a search bar and filter chips (Category: 
   All / Nutrition / Active Lifestyle / Prevention / Regulations — and a Year dropdown)
2. Document list as clean rows/cards, each showing: document icon (PDF), title (e.g. 
   "Healthy Living Strategy 2026", "Nutri-Mark Label Guidelines", "OOH Healthy 
   Advertising Policy", "National Health and Nutrition Survey 2024-2025"), file type + 
   size tag, publish date, and a "Download" icon button
3. A "Most recently added" small highlighted card at top
4. Pagination or "Load more" at bottom
5. Sidebar (desktop) or top section (mobile): "Looking for something specific? Ask our 
   AI assistant" prompt box that links to the AI chat

Keep it document-library clean and official — think government resource center, calm 
and organized, generous spacing, clear typographic hierarchy.
```

### A5. AI Assistant (full page + chat bubble state)
```
Design two states of the Healthy Living AI Assistant using the same design system:

STATE 1 — Floating chat bubble (as it would appear on any page): a rounded chat window 
bottom-right, teal header "Healthy Living AI", a few suggested quick-question pills 
("What is the Nutri-Mark Label?", "How do I earn rewards?", "Find a wellness event near 
me"), message bubbles (user in coral-tinted bubble, AI in soft white/teal-bordered 
bubble), and a text input with send button.

STATE 2 — Full "Ask Healthy Living" page: a centered hero search/ask bar ("Ask anything 
about healthy living in Abu Dhabi..."), below it a grid of topic shortcut cards (Policies, 
Rewards, Nutrition, Events, Initiatives, Your Device Data), and below that a sample 
conversation thread showing a realistic Q&A exchange about connecting a wearable device 
and how points are calculated, with a clear disclaimer strip at the bottom: "This 
assistant provides general guidance and is not a substitute for medical advice."
```

### A6. About Us & Our Approach
```
Design the "About Us" and "Our Approach" pages for Healthy Living (can be one combined 
prompt generating two similar pages), same design system.

About Us:
1. Header: "About Healthy Living" with mission statement paragraph
2. "Who we are" section: description of the government-led program, working across 
   government, private sector, communities and individuals
3. Leadership/partners logo strip (placeholder government + health partner logos)
4. Timeline component: key milestones (program launch, Festival of Health 2025, strategy 
   publication, 25 strategic initiatives rollout)

Our Approach:
1. Header: "Our Approach" with intro paragraph about shaping systems, policies and 
   infrastructure
2. Three expandable/accordion sections for the priorities: Active Lifestyles, Healthy 
   Eating, Prevention-First — each with description + supporting icon illustration
3. "How we work" — simple 4-step process diagram (Understand → Design → Partner → 
   Measure)
4. Closing CTA band: "Be part of Healthy Living" with social follow icons
```

---

## VARIANT B — "Discover & Explore" (no personal tracking)
Events map, food label scanner, meal plans from basic inputs, community directory, AI guide — no saved user profile or health data tracking.

### B1. Home
```
Design the homepage for the Healthy Living "Discover & Explore" variant (no personal 
tracking, no login required), using the same design system: sandstone background, deep 
teal #0E5C56, coral accent #E8734A, sage green, rounded cards, humanist display font.

Sections:
1. Sticky nav: logo left, links "Events Near You / Scan Food Label / Meal Plans / Find a 
   Community / Our Approach / About Us", EN/AR toggle — NO login/account button, instead 
   a subtle "No account needed" note near the AI chat bubble
2. Hero: headline "Explore healthy living across Abu Dhabi", subline emphasizing free, 
   open access with no sign-up, two CTAs: "Find Events Near Me" and "Scan a Food Label"
3. "Explore without an account" — 4-icon feature row: Events Map, Food Scanner, Meal 
   Plans, Communities — each a simple card linking to that page
4. "Our priorities" — same 3 cards as Variant A (Active Lifestyles, Healthy Eating, 
   Prevention-First)
5. "Upcoming near you" — a mini map preview card with 3-4 pinned event teaser cards below 
   it (Festival of Health, community fun run, farmers market, free fitness class)
6. "Our initiatives" — same 4 pill cards as Variant A
7. Footer: same nav/social/legal structure as Variant A

Include the same floating "Ask Healthy Living AI" chat bubble bottom-right.
```

### B2. Events & Map
```
Design an "Events Near You" page for Healthy Living (Discover & Explore variant), same 
design system.

Layout:
1. Header: "Find healthy living events near you" with a search bar (location input) and 
   filter chips: All / Fitness / Nutrition / Community / Festival of Health
2. Split layout: left/main = interactive map with pin clusters across Abu Dhabi 
   (Corniche, Al Ain, Yas Island, Al Reem Island), right/sidebar (or below on mobile) = 
   scrollable list of event cards, each with event photo placeholder, title, date/time, 
   distance from user, category tag, and "View details" + "Get directions" buttons
3. An event detail card/modal example: event title (e.g. "Festival of Health — Corniche"), 
   date, description, organizer, an embedded small map, "Add to calendar" and "Get 
   directions" pill buttons
4. Toggle at top: "Map view / List view"

Style: clean, wayfinding-focused, generous map space, warm card styling matching the 
rest of the system.
```

### B3. Scan Food Label
```
Design a "Scan Your Food Label" page/flow for Healthy Living, same design system. This 
feature lets anyone photograph a packaged food label to get nutrition info and 
healthier alternatives — no account needed.

Design 3 connected states:
STATE 1 — Scan entry: centered camera viewfinder mock with a dashed rounded frame, 
instruction text "Point your camera at the nutrition label", a big pill "Take Photo" 
button and secondary "Upload from gallery" link, plus a small Nutri-Mark Label 
explainer strip at the bottom ("Look for the Nutri-Mark on Abu Dhabi products")

STATE 2 — Results: product name + photo, a clear Nutri-Mark-style rating badge (e.g. 
color-coded A-E or traffic-light style), a nutrition breakdown card (sugar, salt, fat, 
calories per serving) with simple bar indicators, and a plain-language summary line 
("High in added sugar")

STATE 3 — Alternatives: "Healthier alternatives" horizontal card carousel showing 2-3 
similar products with better ratings, each with product photo, name, rating badge, and 
"Why it's better" one-line note

Tone: helpful and non-judgmental, clear iconography, no alarming red/warning colors 
beyond the standard rating scale.
```

### B4. Meal Plans
```
Design a "Get a Meal Plan" page for Healthy Living (Discover & Explore variant) — 
generates a plan from basic inputs only, nothing saved, no account.

Layout:
1. Header: "Get a personalized meal plan in seconds" subline: "No account needed — just 
   answer a few quick questions"
2. A simple inline form/wizard card: Age (number input), Height, Weight, Activity level 
   (segmented control: Low/Moderate/High), Dietary preference (chip select: No 
   restriction, Vegetarian, Vegan, Halal, Low-sugar), Any allergies (tag input) — single 
   "Generate My Meal Plan" pill button at the bottom
3. Results state: a day's meal plan laid out as 4 cards (Breakfast, Lunch, Dinner, 
   Snack), each with a dish name, short description, simple macro tags (protein/carbs/
   fat as small pills), and an icon showing it aligns with local, accessible Abu Dhabi 
   food options
4. A "Wellness tip" callout card at the bottom with one practical tip
5. CTA: "Regenerate" and "Download as PDF" buttons, plus a note "This isn't saved 
   anywhere — download it to keep it"

Style: light, quick, low-friction — feels like a helpful tool, not a long health intake 
form.
```

### B5. Find a Community
```
Design a "Find a Community" directory page for Healthy Living, same design system.

Layout:
1. Header: "Find your healthy living community" with search bar and filter chips: 
   Walking Groups / Sports Clubs / Nutrition Support / Family & Kids / Seniors
2. A directory grid of community cards: community name, short description, location/
   area tag, member count (approximate, e.g. "~40 members"), meeting frequency, and a 
   "View & Join Info" button (links out, doesn't require account)
3. A featured section at top: "Popular this month" horizontal carousel of 3 highlighted 
   communities
4. Each community card links to a simple detail view: cover image, description, meeting 
   schedule, location map pin, organizer contact/link, and a "Get in touch" button

Tone: welcoming, community-bulletin-board feel, warm photography placeholders of group 
activities (walking, sports, cooking classes).
```

### B6. AI Guide
```
Design the AI Guide assistant for Healthy Living (Discover & Explore variant), same two 
states as Variant A's AI assistant but reworded for this variant's features:

STATE 1 — Floating chat bubble: teal header "Healthy Living Guide", suggested quick-
question pills: "Find events near me", "What does this food rating mean?", "Suggest a 
meal plan", "Find a walking group nearby" — same bubble/input styling as Variant A.

STATE 2 — Full "Ask Healthy Living" page: centered ask bar, topic shortcut cards 
(Events, Food Labels, Meal Plans, Communities, Initiatives, Policies), and a sample 
conversation showing the assistant helping someone find a nearby fitness event and 
explaining a food label rating, ending with the same medical-disclaimer strip: "This 
assistant provides general guidance and is not a substitute for medical advice."
```

### B7. About Us & Our Approach
```
Design the "About Us" and "Our Approach" pages for the Discover & Explore variant. 
Content and structure identical to Variant A's About/Approach prompt (same mission 
statement, timeline, priorities accordion, 4-step process diagram, closing CTA band) — 
but remove any reference to devices/rewards and instead close with: "Explore Healthy 
Living — no account needed" CTA linking to Events, Meal Plans, and Communities.
```

---

## Notes for building in Figma AI
- Generate the **Home** screen first in each variant to lock the visual language, then 
  reuse its generated components (buttons, cards, nav) as a Figma component set before 
  generating the rest — this keeps every subsequent page consistent instead of Figma AI 
  reinventing styles each time.
- If Figma AI supports "attach reference image," screenshot the generated Home page and 
  attach it to every later prompt in that variant.
- Arabic RTL versions: after English screens are approved, re-run each prompt with 
  `"Generate the RTL Arabic mirrored version of this exact layout, same components and 
  colors, text right-to-left"` appended.
- All numbers/stats in these prompts are placeholder/illustrative — swap in real figures 
  once available from the Healthy Living team before this goes to development.
