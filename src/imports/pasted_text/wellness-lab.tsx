Create a new fully functional page/tab called **“Wellness Lab”** for the Healthy Living app.

The goal is to make this page feel interactive, intelligent, modern, and personalized, while keeping Phase 1 technically lightweight.

**Important Phase 1 constraints**

* Do not add Apple Health, Fitbit, wearable integrations, hospital integrations, maps APIs, or complex external APIs.
* The only AI integration should be the existing AI chat/AI recommendation functionality.
* Use manually entered user data and lightweight frontend logic.
* Nearby/upcoming activities can use curated sample data based on the selected city or area.
* Keep the existing Healthy Living design system, typography, colors, navigation, spacing, card style, and overall visual identity.
* Do not redesign the rest of the app.

---

# PAGE HEADER

Title:

**Wellness Lab**

Subtitle:

**Experiment with small changes and discover what could make you feel better.**

On the right side of the header show:

**Wellness Score: 72**

Small text:

**↑ 4 this week**

Add a small insight underneath:

**Biggest opportunity: Sleep consistency**

---

# SECTION 1 — WHAT-IF SIMULATOR

Make this the main hero section of the page.

Create a large premium-looking card titled:

**What could improve your day?**

Subtitle:

**Adjust the sliders to see how small lifestyle changes could influence your projected wellness score.**

Create 4 interactive sliders:

### Sleep

Current: **6h 15m**

Slider range:
**4h — 10h**

Example selected value:
**8h**

### Water

Current:
**4 glasses**

Slider range:
**1 — 10 glasses**

Example selected:
**8 glasses**

### Movement

Current:
**15 min**

Slider range:
**0 — 90 min**

Example selected:
**35 min**

### Stress

Current:
**High**

Slider:

**High — Medium — Low**

---

On the right side of the simulator show a large animated score:

**Projected Wellness Score**

**72 → 84**

Badge:

**+12 potential improvement**

Below that:

### Biggest Impact

🌙 **Sleep**

“Getting closer to 8 hours could have the biggest positive impact on your day.”

Add a subtle disclaimer:

**This is a wellness estimate, not medical advice.**

---

Add two buttons:

Primary:
**✨ Build My Better Day**

Secondary:
**Reset**

When sliders move, animate the wellness score and insight text.

---

# BUILD MY BETTER DAY INTERACTION

When the user presses:

**Build My Better Day**

Open a side panel or expandable section.

Title:

**Your Better Day ✨**

Subtitle:

**A simple plan based on the changes you selected.**

Create a timeline:

### 8:00 AM

💧 **Morning hydration**
Drink one glass of water after waking up.

### 12:30 PM

🚶 **10-minute walk**
Take a short walk after lunch.

### 4:00 PM

🧘 **Stress reset**
Take a 3-minute breathing break.

### 7:00 PM

🚶 **Evening movement**
Complete another 20 minutes of light activity.

### 9:45 PM

📵 **Start winding down**
Reduce screen time.

### 10:30 PM

🌙 **Target bedtime**
Aim for 8 hours of sleep.

At the top of this panel show:

**Potential score: 84**

Buttons:

**Save as Today’s Plan**

**Ask AI to Improve This Plan**

---

# SECTION 2 — KEY INSIGHTS

Title:

**Key Insights**

Subtitle:

**Patterns based on your recent check-ins.**

Create 3 visually distinct insight cards.

### Insight 1

🌙

**Sleep is your biggest opportunity**

“You reported less than 7 hours of sleep on 4 of your last 7 days.”

Badge:

**High impact**

Button:

**Explore**

---

### Insight 2

⚡

**Movement may be helping your energy**

“Your energy check-ins tend to be better on days when you move for 30+ minutes.”

Badge:

**Positive pattern**

Button:

**View Pattern**

---

### Insight 3

💧

**Your hydration is improving**

“You reached your hydration target on 5 days this week.”

Show:

🔥 **5 Day Streak**

Button:

**Keep Going**

---

# SECTION 3 — TRY THIS TODAY

Title:

**Try This Today**

Subtitle:

**Small actions selected for your current wellness goals.**

Create 3 action cards.

### Card 1

🚶

**15-Minute Walk**

Best for:

**Energy + Stress**

Duration:

**15 min**

Button:

**Start**

---

### Card 2

🧘

**3-Minute Reset**

Best for:

**Stress**

Duration:

**3 min**

Button:

**Start**

---

### Card 3

🌙

**Early Night Challenge**

Best for:

**Recovery**

Duration:

**Tonight**

Button:

**Accept**

When a user starts an activity:

Change the button:

**Start → In Progress → Completed ✓**

Use a satisfying but subtle completion animation.

---

# SECTION 4 — AROUND YOU

Create a visually exciting local activity section.

Title:

**Around You**

Subtitle:

**Things happening nearby that support your wellness.**

At the top add a location selector:

📍 **Dubai ▾**

For Phase 1 this selector should simply filter curated sample activities.

Do not use a live events API.

Create horizontally scrollable event cards.

---

### EVENT 1

Image placeholder showing outdoor yoga.

**Sunrise Yoga**

📍 Kite Beach

**Tomorrow · 7:00 AM**

Tags:

**Yoga**

**Outdoor**

**Free**

Buttons:

**Save**

**View**

---

### EVENT 2

Image placeholder showing runners.

**Community Run**

📍 Dubai Marina

**Saturday · 6:30 AM**

Tags:

**Running**

**Community**

**Free**

Buttons:

**Save**

**View**

---

### EVENT 3

Image placeholder showing meditation.

**Sunset Meditation**

📍 Zabeel Park

**Sunday · 5:30 PM**

Tags:

**Mindfulness**

**Outdoor**

Buttons:

**Save**

**View**

---

Add a button:

**See All Activities**

---

# SECTION 5 — WELLNESS EXPERIMENTS

Title:

**Wellness Experiments 🧪**

Subtitle:

**Try a small habit and see how it affects how you feel.**

Create cards for simple multi-day experiments.

### Active Experiment

💧

**Morning Water Experiment**

Description:

**Drink one glass of water within 30 minutes of waking for 5 days.**

Progress:

**Day 3 of 5**

Show:

🔥 🔥 🔥 ○ ○

Tracking:

**Watching: Energy + Mood**

Button:

**Check In Today**

---

Also show two suggested experiments.

### Sleep Experiment

🌙

**Screen-Free Wind Down**

Avoid screens for 30 minutes before bed for 5 nights.

Button:

**Try Experiment**

---

### Movement Experiment

🚶

**10-Minute After-Lunch Walk**

Walk for 10 minutes after lunch for 5 days.

Button:

**Try Experiment**

---

# EXPERIMENT RESULT STATE

Design a result screen/card for when an experiment ends.

Example:

🎉 **Experiment Complete**

**Morning Water Experiment**

“Your average morning energy was slightly higher on the days you completed this experiment.”

Show simple comparison:

**Before: 6.2 / 10**

**During experiment: 7.1 / 10**

Buttons:

**Keep This Habit**

**Try Another Experiment**

Keep language cautious and wellness-focused. Do not present medical conclusions.

---

# SECTION 6 — COMING UP

Title:

**Coming Up**

Create a compact personal timeline combining goals, saved activities, and wellness experiments.

### Today

🧘 3-minute stress reset

🌙 Sleep goal — 8 hours

### Tomorrow

🌅 Sunrise Yoga

**7:00 AM · Kite Beach**

### Saturday

🏃 Community Run

**6:30 AM · Dubai Marina**

Allow the user to check off personal goals.

---

# SECTION 7 — ASK AI

At the bottom of the page create a polished AI card.

Title:

**Ask Your Wellness Coach ✨**

Subtitle:

**Want help deciding what to focus on next?**

Input placeholder:

**Ask anything about your wellness plan…**

Add suggested prompt chips:

**How can I improve my score?**

**What should I focus on this week?**

**Give me a 20-minute wellness plan**

**Which activity should I try?**

Clicking any prompt should open or populate the existing AI chat.

Do not create a separate AI system.

---

# MICRO-INTERACTIONS

Add subtle polished interactions throughout the page:

* Wellness score smoothly animates when simulator sliders move.
* Insight cards have subtle hover states.
* Completing an activity shows a small check animation.
* Saving an event changes the icon to a filled bookmark.
* Experiment progress animates when a day is completed.
* “Build My Better Day” smoothly reveals the personalized timeline.
* Keep animations clean and premium, not playful or excessive.

---

# RESPONSIVE BEHAVIOR

Desktop:

* Two-column simulator layout.
* Insights in a 3-card row.
* Activity cards horizontally scrollable.
* Experiments in a 3-card grid.

Mobile:

* Stack all content vertically.
* Simulator sliders full width.
* Score displayed prominently above sliders.
* Activities horizontally scroll.
* Sticky access to AI Coach at the bottom.

---

# OVERALL FEEL

The page should feel like a combination of:

**Personal wellness dashboard + interactive experiment lab + lifestyle discovery page.**

It should not feel clinical or hospital-like.

Prioritize:

* calm
* premium
* modern
* useful
* personalized
* interactive
* encouraging

The experience should make users want to move sliders, try experiments, save activities, and come back tomorrow to see their progress.

The hero interaction of the page should be:

**Adjust lifestyle → See projected impact → Build My Better Day → Save actions → Track what actually helped.**
