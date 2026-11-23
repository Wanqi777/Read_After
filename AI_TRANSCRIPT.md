# Read, after.
## A conversation about designing uncertainty

*AI collaboration notes for Feeling Through Function*

> **About this record**  
> This is an edited reconstruction of the project’s documented development. Prompts have been rephrased, AI responses condensed, and related exchanges grouped by design question. It is not a verbatim chat transcript. Implementation details refer to the working prototype; proposed user testing is identified as future work.

[Experience the project](https://wanqi777.github.io/Read_After/) · [Explore the code](dist/script.js) · [Read the design notes](DESIGN.md)

### The question that guided the work

**How can an interaction help someone reconsider an unanswered message without pretending to know another person’s mind?**

| Design question | What changed |
| --- | --- |
| What does “read” actually tell us? | The receipt became a fixed fact; its interpretation remained open. |
| How could the idea feel less like an explanation? | The receiver’s situation was delayed and revealed through the interface. |
| What should multiple inputs mean? | Spatial proximity and matching clocks became a combined reveal condition. |
| What happens when the experience is interrupted? | Persistent reveals, timer cleanup and accessible alternatives stabilized the story. |

## 01 — Start with what is missing

**Reconstructed prompt**

> I want to explore the feeling of seeing “Read” without receiving a reply. How could a small interactive webpage make that uncertainty visible?

**AI response, summarized**

Show the sender’s message and read receipt first. Reveal the receiver’s circumstances later, giving visitors a chance to reconsider what they initially assumed.

**My design judgment**

The useful part was the gap between an observable event and an inferred motive. I chose to keep the receipt unchanged while showing different possible contexts. A message being read would not become a score for how much someone cared.

**What this clarified**

The project needed to distinguish what the interface could establish from what the visitor might imagine. That distinction became the basis of the narrative.

## 02 — Let the interface carry the feeling

**Reconstructed prompt**

> The first page explains too much. Can the conversation and the reveal carry more of the meaning, with less text and a more engaging interaction?

**AI response, summarized**

Keep one message at the center, reduce explanatory copy, and make the receiver’s perspective appear as a noticeable change in the experience. In the later independent edition, two floating windows could represent the distance between perspectives.

**My design judgment**

I questioned the text-heavy first version and asked for stronger message-based interaction. After exploring web-art references, I requested a separate version so I could compare approaches. The separate two-window edition explored a quieter, more experiential presentation.

**What this clarified**

Asking AI to make a page “more interesting” was less useful than identifying what the visitor should encounter first, what should remain hidden, and which action should change their understanding.

## 03 — Give the inputs a relationship

**Reconstructed prompt**

> How can bringing two windows together and adjusting their clocks work as one interaction, rather than as unrelated controls?

**AI response, summarized**

Treat closeness and time as separate state conditions. Reveal the receiver’s side only when the windows are close and both clocks match the read receipt. Show feedback when only one condition is satisfied.

**The implemented rule**

```js
if (!state.revealed && state.near && atReadMoment()) {
  reveal();
}
```

`atReadMoment()` checks that both clock values equal `4`, displayed as **12:04**.

**My design judgment**

Bringing the windows closer gives perspective-taking a spatial action. Aligning the clocks identifies a shared moment. The rule makes these actions depend on each other: neither condition alone reveals the scene. Buttons and keyboard controls offer alternatives to dragging.

**What this clarified**

An AND condition can shape the pacing of a story. It also creates a practical design question: what feedback helps someone understand partial progress without revealing the outcome too early?

## 04 — Review what the polished version can still lose

**AI-assisted implementation review**

The review moved beyond whether the reveal worked. It considered what happened after discovery, during a scene change, and when animation was reduced.

| Concern | Implemented response | Why it matters |
| --- | --- | --- |
| Moving a window after a reveal | Keep the discovered scene visible. | A small movement should not erase the visitor’s discovery. |
| Switching scenes while callbacks are pending | Cancel story timers before resetting state. | A previous scene must not write into the next one. |
| Removing the typing animation | Retain the draft with its deleted/unsent status. | Reducing motion should preserve the story’s information. |
| Using a phone instead of desktop dragging | Stack the windows and provide a tap/button action. | Instructions should describe the controls actually available. |

**What this clarified**

The reduced-motion revision was particularly revealing. Removing an effect could also remove the evidence that words had existed. Accessibility therefore affected the narrative itself, as well as the way a control was operated.

## What I take from the collaboration

The process translated an emotional idea into interface states and working functions. Revisions examined whether those states communicated the intended experience and what the model left out.

The final two scenes remain possibilities: a reply waiting for a signal, or a draft that never gets sent. Neither resolves a real person’s intentions. My next peer test would ask whether visitors understand that distinction and whether the second scene feels like an alternative rather than the next event.
