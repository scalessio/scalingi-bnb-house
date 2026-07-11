# Scalingi BnB Public Frontend

This repository is the public static deploy output for `https://scalbnb.it`.

Do not treat this repository as the editable source of truth. The source project
lives in the private repository:

```text
scalessio/scalingi-apt-website
```

Normal deploy flow:

```text
push to scalingi-apt-website/master
  -> GitHub Action copies whitelisted frontend files
  -> this repository's main branch is updated
  -> GitHub Pages publishes scalbnb.it
```

Important files to preserve:

- `CNAME` must remain `scalbnb.it`.
- Existing public assets under `src/assets/` are part of the deployed site.
- `50x.html` is a public hosting/support file.

Avoid direct edits here unless doing an intentional emergency hotfix. Product
changes should normally be made in `scalingi-apt-website/frontend/`.
