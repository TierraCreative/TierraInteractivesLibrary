# Tierra Interactives Library

A visual gallery of all Axon interactive end cards built by Tierra. Browse, filter, and preview every interactive before pulling source files.

## Structure

```
tierra-interactives-library/
├── index.html          ← The gallery page
├── style.css           ← All styles
├── app.js              ← Gallery logic (filtering, search, modal)
├── data.js             ← Card data — EDIT THIS to add new cards
├── README.md
└── interactives/       ← Drop all .html files from Axon here
    ├── 13_05_26-Video-Interactive-ECOM-MindMagic-...html
    └── ...
```

## Adding a new interactive

1. Export the `.html` file from Axon
2. Drop it into the `/interactives/` folder
3. Open `data.js` and add a new object to the top of the `CARDS` array:

```js
{
  id: 13,                          // next sequential number
  name: "Your Card Name",
  client: "Client Name",
  category: "ECOM",                // ECOM | BEV | Sleep — add new ones as needed
  ctaColor: "#FF0000",             // hex from Axon's __SSR_PROPS__
  ctaText: "Shop Now",
  ctaPosition: "bottom",
  date: "May 20, 2026",
  htmlFile: "interactives/your-file-name.html",
  driveUrl: "https://drive.google.com/...",
  tags: ["ecom", "product"]
},
```

4. Push to GitHub — the live site updates automatically.

## Hosting

Connect this repo to [Cloudflare Pages](https://pages.cloudflare.com/) (free, no limits on commercial use):

1. Go to Cloudflare Pages → Create a project
2. Connect your GitHub repo
3. Build settings: none needed (static site)
4. Deploy

Every push to `main` auto-deploys.

## Designer notes

The CTA button is **auto-injected by Axon** at the bottom of each interactive. When building source videos, keep the **bottom ~15% of the frame clear** — no product imagery, text, or key visual elements in that zone.

The dashed overlay shown in the gallery cards marks this CTA zone.
