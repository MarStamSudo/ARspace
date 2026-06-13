# ARspace — No-Code WebAR Platform for Museums

> Turn any 3D object into an AR experience. No app. No developer. Just a QR code.

ARspace lets museum curators upload 3D assets and publish them as augmented reality experiences — instantly accessible to visitors via QR code, directly in their mobile browser.

---

## How It Works

**For the curator (Creator App)**
1. Upload a `.glb` 3D asset
2. Preview it in 3D, adjust scale
3. Hit Publish → get a QR code

**For the visitor (Viewer)**
1. Scan the QR code
2. Open in mobile browser — no app download
3. Place the 3D exhibit in their space via AR

---

## Live Demo

- **Creator:** [app.arspace.io](https://app.arspace.io)
- **Viewer example:** [[ar.arspace.io/viewer/viewer.html?id=...](https://arspace-viewer.vercel.app/viewer/viewer.html?id=c100a2ae-4c99-4a83-bd8c-f09945aea072)]

---

## Tech Stack

| Layer | Technology |
|---|---|
| Creator Frontend | HTML, JavaScript, Three.js |
| Viewer Frontend | HTML, `<model-viewer>` (Google) |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage (CDN) |
| Hosting | Vercel |
| AR Rendering | WebXR / ARKit / ARCore via model-viewer |

---

## Architecture

```
arspace/
├── index.html          # Creator App — upload assets, publish scenes
└── viewer/
    ├── viewer.html     # Viewer — AR experience for museum visitors
    ├── viewer.js       # Loads scene from Supabase, renders via model-viewer
    └── config.js       # Supabase credentials (not committed to git)
```

**Data flow:**

```
Curator uploads .glb
        ↓
Supabase Storage (CDN)
        ↓
Scene JSON saved to DB { scene_id, asset_url, scale }
        ↓
QR code generated → ar.arspace.io/viewer/viewer.html?id=SCENE_ID
        ↓
Visitor scans QR → Viewer fetches scene → AR rendered
```

---

## Database Schema

```sql
-- Scenes table
scenes (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name      text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- Objects table
objects (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id  uuid REFERENCES scenes(id),
  asset_url text NOT NULL,
  scale     float DEFAULT 1.0,
  created_at timestamptz DEFAULT now()
)
```

---

## Roadmap

- [x] Upload `.glb` assets
- [x] 3D preview before publish
- [x] Save scene to Supabase
- [x] Generate QR code
- [x] AR Viewer with plane detection
- [x] Mobile onboarding screen 
- [ ] Curator dashboard (manage scenes)
- [ ] Basic analytics (scan count per QR)
- [ ] Multiple objects per scene
- [ ] Image tracking (marker-based AR)
- [ ] White-label for enterprise

---

## Target Market

**Phase 1 — Museums & Cultural Heritage**
95,000+ museums worldwide. Curators can publish AR experiences without any technical knowledge or developer budget.

**Phase 2 — Retail & E-commerce**
"See it in your space before you buy." Same technology, new vertical.

**Phase 3 — Real Estate**
Virtual staging for apartments and commercial spaces.

---

## Why ARspace

| | ARspace | Custom AR dev | Existing tools |
|---|---|---|---|
| Setup time | 10 minutes | 3-6 months | Days-weeks |
| Cost | €49/month | €10,000+ | Complex pricing |
| Technical skill needed | None | High | Medium |
| Works without app | ✅ | ❌ | ❌ |

---

## License

MIT License — see [LICENSE](LICENSE)

---

*Built by Marinos Stamatopoulos · marinosstamatopoulos@gmail.com · https://www.linkedin.com/in/marinosstamatopoulos/*
