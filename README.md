# Read, after.

Two windows. One unanswered message. An expressive interaction for *Feeling Through Function — Designing Expressive Reactions*.

## Run

Open `dist/index.html` in a modern browser. No build, installation or network request is required for the interface assets. Photography and fonts are included locally.

## Experience

1. Bring the windows closer by dragging their title bars, using arrow keys, or pressing **Bring closer**.
2. Align both clock sliders to **12:04**. Time alone or proximity alone does not reveal the scene.
3. Discover a reply stuck without signal.
4. Select **Another possibility**, then repeat the combination to discover a typed and deleted draft.
5. Hold both possibilities, replay the draft, or restart.

Both scenes are authored fiction and represent alternatives, not a chronological sequence. An unchanged read receipt does not establish someone's intention.

## Source and logic

- [`dist/index.html`](dist/index.html): semantic interface, range inputs, controls and dialog.
- [`dist/style.css`](dist/style.css): layout, responsive behavior and reduced motion.
- [`dist/script.js`](dist/script.js): variables, event listeners, compound condition, scene transitions, timers, translations and synthesized sound.
- [`DESIGN.md`](DESIGN.md): design intent and interaction decisions.
- [`AI_TRANSCRIPT.md`](AI_TRANSCRIPT.md): edited AI collaboration notes, with reconstructed prompts, summarized responses and design reflections clearly identified.
- [`dist/assets/CREDITS.md`](dist/assets/CREDITS.md): photographs and font attribution.

Core condition: `!state.revealed && state.near && state.you === 4 && state.them === 4`.

Reveal is latched, so moving a window after discovery does not hide the outcome. Scene changes cancel pending story timers. English/Chinese, keyboard and touch alternatives, optional synthesized audio and reduced-motion content are included. No microphone or personal messages are used.

## Development notes

The independent two-window edition was developed separately from the earlier Read, No Reply project; the earlier source files were preserved.

Recorded development checks covered both input orders, partial combinations, reveal persistence, replay/reset and desktop/mobile layouts. These are functional checks, not evidence of a measured emotional effect. Actual sound output, screen-reader behavior and the OS reduced-motion mode still merit independent human testing.

WindowSwap and The Boat informed spatial perspective and narrative pacing. This project does not copy their artwork or code.
