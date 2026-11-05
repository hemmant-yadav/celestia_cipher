# DESIGN.md — Personal Safety App

> **Purpose:** This file is the visual and interaction source of truth for Google Stitch and the implementation agent. Follow it before creating or changing any screen.
>
> **Design direction:** Premium, soft-pink, editorial, feminine-leaning without being childish, and extremely simple. Use the attached reference images for visual mood, colour relationships, typography character, surface treatment, and overall polish. Do not copy the beauty or food app layouts or their content.

---

## 1. Non-negotiable design principles

1. **Minimal, not empty-looking:** Every element must have a clear purpose. Use whitespace deliberately; do not fill it with decorative graphics, slogans, cards, or status widgets.
2. **Premium, not template-like:** Create a considered visual system with excellent typography, spacing, alignment, and transitions. Do not produce a generic dashboard or a typical AI-generated app interface.
3. **Safety before decoration:** Emergency actions and their status must be immediately understandable. Never let visual styling reduce legibility, tap accuracy, or speed.
4. **One consistent product:** All screens must share the same typography, colour tokens, spacing, radii, controls, icon style, and motion language.
5. **No invented product scope:** Do not add features, tabs, settings, onboarding steps, or content that are not specified in this file or confirmed by the product owner.
6. **No fake functionality:** A visual state must not imply that an alert, call, recording, location share, or police notification happened unless the app receives confirmation from the relevant system or service.
7. **Use real interface copy:** Do not add AI-sounding slogans, motivational phrases, filler copy, fake metrics, placeholder testimonials, or decorative text.

## 2. Reference image interpretation

Use the supplied images as **visual references only**:

- The pink abstract image establishes the soft blush-pink atmosphere and tonal range.
- The food-app reference establishes the use of large, confident typography, clean white surfaces, rounded composition, and restrained pink accents.
- The beauty-app reference establishes the premium editorial feel, restrained product presentation, and the relationship between pink and white.

Do **not** reproduce the reference apps' shopping layouts, product cards, product imagery, search bars, pricing, or content. This is a personal-safety app, not a beauty, food, or shopping app.

## 3. Product information architecture

Use exactly **four primary destinations**. Do not add a fifth tab.

### 3.1 Home

Home is intentionally almost empty.

It contains only:
- The app wordmark/name, if needed for brand identity.
- One large, clearly identifiable SOS control.
- The four-item bottom navigation.

Do not add:
- Welcome messages, taglines, motivational text, or AI-generated copy.
- Dashboard cards, statistics, activity summaries, maps, contact previews, battery widgets, or connection panels.
- Fake-call, voice, shake, or timer shortcut buttons.
- Decorative illustrations, floating shapes, random icons, or ornamental graphics.

**Voice activation and shake detection are background capabilities.** They must operate when configured and enabled; they are not Home buttons or Home cards. Their configuration belongs in My Safety.

### 3.2 SOS interaction and emergency state

The SOS control must have a deliberate activation interaction, such as press-and-hold with a visible progress indicator. Avoid accidental activation. The exact activation duration and cancellation rules are product/engineering decisions; do not invent them in the visual prototype.

After SOS activation, transition to a dedicated emergency screen. The screen should show the actual state of each action:
- Emergency services / police contact pathway, where an approved integration exists.
- Trusted-contact alerts.
- Live-location sharing.
- Audio/video recording, only where the user has granted permission and the feature is enabled.

Use truthful, per-action states such as **Sending**, **Sent**, **Delivered**, **Failed**, **Unavailable**, or **Not enabled**. Do not display “Police informed” or “Contacts informed” before confirmation.

Provide clear, high-priority actions where supported:
- Call emergency services.
- Call a trusted contact.
- End/cancel the emergency, with a deliberate confirmation flow and appropriate safeguards.

If police/emergency-service auto-notification is not technically or legally integrated, the UI must not imply that police were automatically notified. Show the real available action, such as opening the phone dialler, and make its behaviour explicit.

### 3.3 Map

Map contains only location and navigation capabilities:
- Current/live location.
- Location-sharing state.
- Safe-route suggestions and route view.
- Nearby relevant help locations, such as police stations and hospitals.
- Route/location sharing actions.

Keep map controls quiet and secondary to the map. Do not turn the screen into a dashboard of unrelated safety cards.

### 3.4 My Safety

My Safety is the place to configure and manage personal-safety behaviour. It is not another Home dashboard.

Include these groups:

**Trusted contacts**
- Add, edit, and remove trusted contacts.
- Choose which contacts receive emergency alerts.
- Manage location-sharing permissions.

**Safety behaviour**
- Configure voice activation and its trigger phrase/command, where supported.
- Enable/disable and configure shake detection/sensitivity.
- Configure fake-call behaviour.
- Configure a safety/check-in timer.
- Configure recording preferences and permissions.

**Safety history**
- Previous SOS events and their outcomes.
- Emergency notification history.
- Incident reports.
- Recording history, subject to privacy and retention rules.

**Privacy and app settings**
- Location, microphone, and camera permissions.
- Recording retention/deletion controls.
- Notification preferences.
- Account and app security.

Do not repeat live Home status widgets here. Use simple grouped rows and focused detail screens rather than a wall of cards.

### 3.5 Devices

Devices is only for physical and IoT hardware:
- Pair/connect a smartwatch.
- Pair/connect a safety keychain or dedicated safety device.
- Manage supported IoT devices.
- Show device battery percentage when available.
- Show connection/last-seen state.
- Explain and configure device-disconnection or power-off alerts.
- Show device-specific SOS configuration where supported.

Do not put general app settings, contacts, incident history, or map features in Devices.

### 3.6 Bottom navigation

Use exactly these labels, in this order:

1. Home
2. Map
3. My Safety
4. Devices

Use a compact, consistent bottom navigation. Use labels with icons only if the icon improves recognition. Do not use large decorative icons. The SOS interaction must remain easy to reach from Home; do not create a fifth navigation item for emergency mode.

---

## 4. Visual identity and colour system

### 4.1 Overall appearance

The visual direction is a soft, premium pink-and-white editorial interface:
- Warm blush/pale pink as the main app canvas or selected background areas.
- Clean white for important content surfaces.
- Muted rose for selected states and secondary accents.
- Deep charcoal for primary text.
- A distinct, accessible emergency red for SOS and emergency-critical states.

Treat the uploaded references as the colour authority. The following are **starting tokens**, not a reason to ignore the references. Tune them to the supplied images in Stitch while preserving contrast and emergency clarity.

| Token | Starting value | Intended use |
|---|---:|---|
| `color.canvas` | `#F8E9E9` | Main blush-pink background |
| `color.surface` | `#FFFFFF` | Main content surfaces |
| `color.surface-soft` | `#FCEFF0` | Subtle secondary surfaces |
| `color.rose` | `#D98D9D` | Muted rose accent |
| `color.rose-deep` | `#B96F80` | Selected controls and emphasis |
| `color.text` | `#282326` | Primary text |
| `color.text-muted` | `#81777A` | Secondary text |
| `color.border` | `#EADBDD` | Fine separators and borders |
| `color.sos` | `#C83F4B` | SOS and emergency action |
| `color.success` | `#34765D` | Confirmed success only |
| `color.warning` | `#A66A25` | Warning state |
| `color.error` | `#B8323D` | Failed/critical state |

### 4.2 Colour rules

- Prefer solid fills. **Do not use gradients anywhere**: not on backgrounds, buttons, cards, borders, text, icons, or animation effects.
- Do not use neon, glow, bloom, chrome, holographic, glass, frosted-glass, or artificial lighting effects.
- Keep pink as the brand colour, but do not make critical text low-contrast pink.
- SOS must remain visually distinct from ordinary rose accents.
- Never use colour alone to communicate a status. Pair it with a text label or clear shape/state.
- Check text and control contrast. Aim for WCAG 2.2 AA contrast: 4.5:1 for normal text and 3:1 for large text and essential UI graphics.

## 5. Typography — premium, editorial, and readable

Use a deliberate three-role type system. Load fonts from Google Fonts during prototyping; for production, consider self-hosting the approved font files if the app's privacy, performance, or offline requirements make that preferable.

### Recommended pairing

| Role | Typeface | Use |
|---|---|---|
| Primary UI | **Manrope** | Navigation, body copy, buttons, form labels, settings, emergency status, numbers |
| Editorial display | **Cormorant Garamond** | Occasional large page titles or a restrained brand statement |
| Cursive accent | **Allura** | Tiny brand signature or one short decorative accent only |

Suggested weights:
- Manrope: 400, 500, 600, 700.
- Cormorant Garamond: 400, 500, 600.
- Allura: regular only.

### Typography rules

- The interface must remain readable and functional without the cursive font loading.
- Never use cursive for SOS, emergency instructions, contact names, addresses, button labels, notification states, numbers, or any safety-critical information.
- Use Allura sparingly. It is an accent, not the app's main typeface. Do not turn every heading into script writing.
- Use Cormorant Garamond selectively to create an editorial/premium character. Do not use it for dense settings or small labels.
- Use Manrope for almost all functional UI.
- Keep text sizes, line heights, and weights consistent across screens. Avoid tiny low-contrast captions.
- Do not mix additional typefaces without approval.

Suggested CSS font stacks:

```css
:root {
  --font-ui: "Manrope", sans-serif;
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-script: "Allura", cursive;
}
```

Suggested Google Fonts stylesheet for a web prototype:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
```

If the product is native iOS/Android, use the same font roles with the platform's font-loading mechanism and test font rendering on real devices.

---

## 6. Layout, spacing, and component rules

### Layout

- Design mobile-first. The primary target is a modern phone screen.
- Respect device safe areas, status bars, home indicators, and keyboard insets.
- Use a consistent spacing scale based on 4 or 8 px increments.
- Keep content aligned to a consistent page margin.
- Use generous whitespace, but do not push critical controls below the fold.
- Prefer one clear primary action per screen.
- Avoid unnecessary nested cards. Use simple sections, rows, dividers, and a small number of larger surfaces.

### Shape and surfaces

- Use softly rounded corners, but keep the radius scale consistent.
- Use white surfaces against blush backgrounds where separation is needed.
- Use thin, subtle borders instead of heavy shadows.
- Shadows, if used, must be very soft and static. Never use a glow or coloured shadow.
- Do not put every individual row inside its own card.

### Buttons and controls

- Use solid fills, clear labels, and predictable pressed/disabled states.
- Keep the SOS control visually dominant and make its press-and-hold interaction obvious without adding paragraphs of instruction.
- Use a minimum touch target of 44 × 44 CSS px; prefer 48 × 48 px for important controls.
- Make destructive or emergency-ending actions visually and behaviourally distinct.
- Provide visible focus states for keyboard and accessibility use.
- Never use a decorative control that looks tappable but does nothing.

### Icons

- No decorative icon collections, random symbols, emojis, or AI-generated icons.
- Use icons only when they communicate an actual action or destination.
- Keep one consistent outline icon family, stroke weight, size, and alignment.
- Prefer text labels alongside icons for navigation and critical actions.
- Do not invent a custom icon for every feature. Reuse a small, consistent set.

---

## 7. Animation and interaction direction

The design must be **animation-ready** so the implementation agent can add refined motion in code. Stitch should establish the correct component geometry and state changes; the coding agent can implement the final motion.

### Motion style

Use motion that feels smooth, restrained, and intentional:
- Short opacity transitions for screen and content changes.
- Small vertical or horizontal movement for modal/sheet entry.
- Subtle scale/opacity feedback for button press states.
- A clear progress animation for the SOS press-and-hold interaction.
- A restrained status transition when an emergency action moves from Sending to Sent or Failed.
- Smooth bottom-sheet opening and closing.

### Motion limits

- No constant floating, wobbling, spinning, bouncing, pulsing, or breathing decorations.
- No parallax backgrounds, animated blobs, particle effects, or gradient animations.
- Do not animate every component when a screen opens.
- Do not delay SOS activation or emergency communication for an animation.
- Do not make critical information visible only through motion.
- Use looping animation only when it communicates a real ongoing state and has a clear stop condition.

### Suggested motion tokens

| Token | Duration | Use |
|---|---:|---|
| `motion.fast` | 120–160 ms | Press/release feedback |
| `motion.standard` | 180–240 ms | Small state and content transitions |
| `motion.screen` | 240–320 ms | Screen/sheet transitions |
| `motion.emphasis` | 320–420 ms | One-time SOS confirmation transition |

Use ease-out for entry and ease-in for exit. Avoid spring motion that overshoots or feels playful in emergency flows.

### Accessibility

- Respect the operating system's reduced-motion preference.
- When reduced motion is enabled, replace large movement with a quick opacity change or remove the motion.
- Maintain the same information and functionality with motion disabled.
- Do not rely on colour or animation alone to convey emergency status.

---

## 8. Screen-state requirements

Design and implement the following states where relevant:

- Default/idle.
- Pressing/holding SOS.
- SOS activated.
- Sending notification.
- Sent/delivered confirmation.
- Failed or unavailable service.
- No network / weak network.
- Location unavailable or permission denied.
- Microphone/camera permission denied.
- Device disconnected / battery unavailable.
- Empty state for no contacts, no devices, or no history.
- Loading state.

Keep empty and error states short, factual, and actionable. Do not use cute illustrations or generic AI-generated explanatory paragraphs.

---

## 9. Copy and content rules

- Use short, literal, human-written interface copy.
- Do not add slogans, motivational statements, filler, marketing language, or AI-style phrases.
- Do not invent a user's name, contact count, battery percentage, location, emergency number, or event history.
- Use realistic sample content only when a prototype requires it, and mark it as sample data.
- Use consistent verbs and labels across the app.
- Keep emergency messages direct and factual.

Examples of acceptable status language:
- `Sending alert`
- `Alert sent`
- `Delivery failed`
- `Location sharing active`
- `Location unavailable`
- `Recording not enabled`

Do not claim an action succeeded until the application receives a success result.

---

## 10. Accessibility, safety, and reliability in the UI

- Maintain strong contrast, visible focus, readable text, and touch targets suitable for one-handed use.
- Keep emergency actions reachable and easy to distinguish.
- Avoid accidental SOS activation through a single casual tap; use the approved press-and-hold or confirmation interaction.
- Make cancellation/end-emergency behaviour deliberate and clear.
- Provide text labels for important icons and accessible names for screen readers.
- Do not make the UI depend on animation, colour, sound, or haptics alone.
- Handle network, GPS, permissions, and device failures honestly.
- Do not imply that the app automatically contacts police unless a real, approved integration exists and confirms delivery.

---

## 11. Google Stitch workflow

Use this file and the attached reference images together.

1. Start a mobile app design project in Google Stitch.
2. Upload the supplied reference images to the project.
3. Add/import this `DESIGN.md` as the design-system instruction file.
4. Tell Stitch that the images define the **visual language only** and this file defines the product structure and constraints.
5. Generate the Home screen first. It must contain only the app identity, one SOS control, and the bottom navigation.
6. Generate the SOS-active screen as a separate state, showing truthful notification and location statuses.
7. Generate Map, My Safety, and Devices using the same design system.
8. Review the screens together for consistency before producing variations. Do not let Stitch invent extra tabs, widgets, slogans, gradients, or features.
9. Export the screens and the design system. Keep the exported design-system file with the project source.
10. Give the exported screens and this file to the implementation agent. The implementation agent must reproduce the approved designs rather than reinterpret them.

### Suggested initial Stitch prompt

```text
Design a premium mobile personal-safety app using the attached reference images
for visual direction and the supplied DESIGN.md as the source of truth.

The visual language is soft blush pink, white, muted rose, editorial typography,
subtle surfaces, and restrained rounded geometry. Use the specified premium font
pairing, including a very limited cursive accent. No gradients, glassmorphism,
glow, neon, decorative blobs, random illustrations, AI-looking dashboard cards,
marketing slogans, or unnecessary icons.

Follow the exact four-tab information architecture in DESIGN.md: Home, Map,
My Safety, Devices. Home must be extremely minimal: app identity, one large SOS
control, and bottom navigation only. Voice activation and shake detection are
background capabilities, not Home buttons. After SOS activation, show a separate
emergency state with truthful per-action statuses.

Create production-quality mobile layouts with consistent spacing, typography,
colour tokens, component geometry, and accessible controls. Do not invent features
or copy. Treat the references as aesthetic guidance only; do not copy their shopping
or beauty-app content/layout.
```

---

## 12. Implementation-agent rules

1. Read this file before making UI changes.
2. Inspect the existing app and identify its framework, routing, component system, and current working behaviour before editing.
3. Preserve all existing working functionality, backend contracts, API calls, authentication, permissions, and navigation behaviour unless a change is explicitly requested.
4. Do not rewrite working business logic to achieve a visual change.
5. Implement the approved Stitch screens faithfully. Do not substitute a generic template or redesign the app independently.
6. Create reusable design tokens and shared components for typography, buttons, navigation, surfaces, form rows, status labels, and spacing.
7. Keep motion in the presentation layer. Animation must not control or delay the underlying emergency logic.
8. Make layouts responsive and test on realistic mobile viewport sizes.
9. Test the SOS default, hold, activated, sending, success, failure, cancellation, and offline states.
10. Test voice/shake as background capabilities; do not add them to Home as visible action buttons.
11. Before finishing, compare every implemented screen against the approved Stitch output and this file. Fix spacing, font, colour, alignment, and state mismatches.
12. Do not add dependencies unless there is a clear need. Reuse the project's current stack where possible.
13. Do not change unrelated files or functionality. Report any required backend/integration work separately rather than faking it in the UI.

## 13. Optional implementation resources

Use only what fits the existing technology stack; these are references, not mandatory dependencies.

- **Google Stitch:** https://stitch.withgoogle.com/
- **Google's DESIGN.md announcement and format context:** https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
- **Google Stitch Skills (optional agent workflow):** https://github.com/google-labs-code/stitch-skills
- **Google Fonts:** https://fonts.google.com/ — Manrope, Cormorant Garamond, Allura.
- **Motion for React (optional, if the app uses React):** https://motion.dev/ — use for controlled transitions and reduced-motion support.
- **Lucide (optional, if an icon library is needed):** https://lucide.dev/ — use a small subset of consistent functional outline icons only.

Do not add a UI kit, animation package, icon package, or asset library merely because it is listed here. First inspect what the project already uses.

---

## 14. Definition of done

The design is ready for implementation only when:

- [ ] Exactly four primary tabs exist: Home, Map, My Safety, Devices.
- [ ] Home contains only app identity, the SOS control, and bottom navigation.
- [ ] SOS leads to a separate emergency status screen.
- [ ] Emergency statuses reflect actual outcomes and never claim unconfirmed delivery.
- [ ] Voice and shake are background capabilities and are configured in My Safety.
- [ ] Device pairing, battery, connectivity, and power-off alerts are confined to Devices.
- [ ] The pink-and-white visual system is consistent across all screens.
- [ ] Manrope, Cormorant Garamond, and the restrained Allura accent are used according to the typography rules.
- [ ] No gradients, glassmorphism, glow, decorative blobs, random illustrations, or AI-style filler copy appear.
- [ ] Motion is subtle, purposeful, code-compatible, and reduced-motion aware.
- [ ] The UI is accessible, responsive, and usable without animation.
- [ ] Existing product behaviour and backend functionality remain intact.
