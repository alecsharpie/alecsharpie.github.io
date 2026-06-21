# Psychofauna

*Ragebait detection that runs entirely in your browser — a work-in-progress Chrome
extension.*

Social feeds optimise for engagement, which often means surfacing inflammatory
"ragebait" that hijacks your attention and mood. **Psychofauna** is a Chrome extension
that spots that content as your Twitter/X feed loads and flags it — and it does the ML
**locally, in the browser**, so nothing about what you read ever leaves your device.

![The Psychofauna extension icon](img/icon.png)

## How it works

A `MutationObserver` watches for new tweets, pulls their text, and batches them to an
offscreen worker running **DistilBERT via [Transformers.js](https://huggingface.co/docs/transformers.js)**
(ONNX on WebAssembly). Anything it scores as inflammatory gets a red border. If the
model fails to load it falls back to keyword heuristics, so the extension still does
something useful.

## Where it's at (WIP)

The MVP works end to end: tweets are detected, classified in-browser, and styled, with a
debug overlay showing scores. But the model it currently ships is an off-the-shelf
**sentiment** classifier (SST-2) standing in for "ragebait" — a reasonable proxy, not
the real thing.

The actual goal is a **bespoke ragebait model**, and that pipeline is the part I'm
building now:

1. **Synthetic data** — a Gemini Flash prompt generates labelled tweet pairs across
   mild / moderate / severe severity.
2. **Fine-tune** — DistilBERT on the generated set (PyTorch + 🤗 Transformers).
3. **Export** — to quantised ONNX so it runs fast in the browser.

So far that's only been smoke-tested end to end (a tiny 10-example run to prove the
plumbing); training a model that actually beats the sentiment proxy is the next step.

## Roadmap

- [x] MVP — in-browser classifier, heuristic fallback, debug overlays
- [ ] Custom ragebait-trained model (data + training pipeline exist; needs a real run)
- [ ] User feedback loop
- [ ] More platforms (Reddit, …)
- [ ] WebGPU acceleration

## Tech

- **In-browser ML** — Transformers.js + ONNX WebAssembly, quantised DistilBERT
- **Extension** — Chrome Manifest V3, Offscreen API
- **Training** — PyTorch + 🤗 Transformers, synthetic data via Gemini Flash

*100% local. Take back your feed.*
