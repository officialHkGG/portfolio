# Portfolio V4 — Product Experience

Design direction: Apple-inspired simplicity without copying Apple's identity, layouts, trademarks or assets. A recruiter-focused portfolio that treats authentic projects like carefully presented products.

## Design foundations
- Near-black `#101112`, off-white `#f5f5f7`, blue `#c4d8f5` as a single accent
- System sans-serif typography, generous space, tightly controlled line length
- Light/dark alternating product sections for meaningful contrast
- Responsive from 320px upwards, mobile-first interaction behavior
- Low-noise UI: gentle scroll reveals (disabled for reduced motion), focused buttons, no autoplay video or GIF

## Story / information architecture
1. Intro: concise value proposition and clear links
2. Lisora QMS: modules and workflow diagram, explicitly conceptual (private source)
3. Job CRM: problem-first story, live demo and repository
4. Bostadskollen: backend architecture, repository link
5. Approach: understand, structure, deliver
6. Real experience: Hemfixarna, Spend Ninja, Linespotting, Nackademin
7. Personal story and technical skills
8. Contact and diploma

## Truthfulness / visuals
All three illustrations are composed entirely of HTML/CSS and clearly labeled as conceptual. They are NOT screenshots of working applications, and no invented product metrics or employer outcomes are shown. Replace with real screenshots only after the actual files are supplied and verified.

## What to add next
- Current CV PDF under assets and a real download link
- Real screenshots of the three projects; optimize as WebP/AVIF, responsive sizes
- Independent project detail pages with verified source explanations, architecture diagrams and implementation lessons
- Verify GitHub/live demo URLs and verify no private or sensitive data in screenshots
- Run browser QA at 320px/390px/768px/1440px, keyboard-only checks, screenreader checks, Lighthouse on Vercel preview
- Check language toggle, reduced-motion behavior and external links
- Update sitemap and analytics only with user-approved privacy-conscious approach

## Deployment
Static HTML + CSS + vanilla JS. No build step required, compatible with Vercel static hosting. Review the pull request and Vercel preview. Do not merge until QA.

Source: https://github.com/officialHkGG/portfolio
