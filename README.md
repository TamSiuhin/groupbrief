# GroupBrief project website

Project website for **Reconstructing Group Cognition for Collaborative Agents**.

Live site: [zhaoxuan.info/groupbrief](https://zhaoxuan.info/groupbrief/).

This repository contains the website source and paper figures. It is not a release of the research implementation or benchmark dataset.

## Local preview

No package installation or build step is needed:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The site uses relative paths and can be deployed to a GitHub Pages project path.

## Files

- `index.html` — project description, authors, figures and citation
- `styles.css` — responsive light/dark styles
- `script.js` — interactive result charts, theme control, figure zoom and citation copy
- `assets/figures/` — figures from the paper
- `assets/groupbrief.pdf` — paper PDF

The full-benchmark tables and final Test results are kept distinct. Simulation preferences are against no brief and use each configuration’s valid comparison set; differences of the displayed marginal rates are not paired method effects.

The page layout is inspired by the [TeleTune project page](https://microsoft-teletune.github.io/); the site implementation and text were written for GroupBrief.
