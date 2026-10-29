# 🌧️ MD. Kaium Hasan - Open-Source 3D + 2D Hybrid Portfolio Engine

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.dot.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10b981.svg?style=for-the-badge)

**An AAA-inspired 3D Cyberpunk Interactive World + Ultra-Fast 2D Classic Portfolio - managed simultaneously from a single Unified Executive Admin Console (`/admin`).**

[🌐 Live Portfolio](https://www.mdkaiumhasan.site) • [📘 **Complete Setup & Deploy Guide (`GUIDELINE.md`)**](GUIDELINE.md) • [📦 3D `.glb` Releases](https://github.com/mdkaiumhasan/portfolio-3D/releases/tag/1.0.0) • [💼 LinkedIn](https://www.linkedin.com/in/md-kaium-hasan-bb6009372/)

</div>

---

## 🚀 Want to Use This Portfolio for Yourself?

👉 **Read the full step-by-step [GUIDELINE.md](GUIDELINE.md)**!  
It walks you from cloning the repo, downloading all 6 `.glb` 3D models (`npm run download-models`), connecting free MongoDB Atlas + Cloudinary accounts, customizing **100% of your content from `/admin` without touching code**, and deploying live to **Vercel**.

---

## ✨ Key Highlights

### 🎮 1. Playable 3D Interactive Cyberpunk Street (`/`)
- **Third-Person Character & Octree Physics:** Smooth locomotion (`WASD` / Arrows + `Shift` Sprint + `Space` Jump), real-time `Octree` collision detection, and character emotes.
- **Desktop, Touchscreen Laptop & Mobile Optimized:** Dedicated lightweight mobile `.glb` models, multi-touch virtual joystick + independent right-thumb camera orbit, Sprint toggle, and WebGL auto-fallback.
- **Single-Stream Asset Caching:** Streams `.glb` assets once with live MB progress, caches permanently in CacheStorage + Service Worker (`0 bytes` re-download on revisit), and hands off a zero-copy `blob:` URL to Three.js.
- **Instant `Enter 2D` Switch:** Visitors on slow connections can switch to the 2D portfolio at `0%` without waiting for 3D assets.

### ⚡ 2. Synchronized 2D Classic Portfolio (`/?view=2d` & `/classic.html`)
- Sleek, responsive light/dark portfolio with category-filtered Projects, animated Skills bars, Experience Timeline, built-in Blog Article Reader, and Direct Contact Form.
- Uses static compiled Tailwind CSS (`14.4 kB` minified) with zero render-blocking CDN scripts.

### 🛡️ 3. Unified Executive Admin Console (`/admin`)
- **Write Once, Sync Everywhere:** Every change to Hero/Bio, Availability status, Dual-Track Resumes, Certifications, Skills, Projects, Experience, Blogs, Activities, and Contact channels updates **both 2D and 3D views** in real time (`MongoDB` + `BroadcastChannel`).
- **Direct Messages Inbox:** Visitor messages from both 2D and 3D contact forms save directly to MongoDB with read/unread filtering and 1-click email reply.
- **Cloudinary Upload & Server-Side Gemini AI Blog Studio:** Upload auto-optimized images and generate technical articles securely via HMAC-SHA256 authenticated serverless endpoints (`/api/*`).

---

## ⚡ Quick Start (3 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/mdkaiumhasan/portfolio-3D.git
cd portfolio-3D

# 2. Install dependencies
npm install

# 3. Verify or download all 6 3D (.glb) assets from GitHub Releases into public/models/
npm run download-models

# 4. Configure environment variables (.env.local)
cp .env.example .env.local

# 5. Launch local dev server (3D: /, 2D: /?view=2d, Admin: /admin)
npm run dev
```

For MongoDB Atlas, Cloudinary, `/admin` customization, and Vercel deployment instructions, follow **[GUIDELINE.md](GUIDELINE.md)**.

---

## 📦 3D `.glb` Assets Included ([Release `v1.0.0`](https://github.com/mdkaiumhasan/portfolio-3D/releases/tag/1.0.0))

| Asset | File in `public/models/` | Purpose |
| :--- | :--- | :--- |
| Desktop Street Map | `after_the_rain_2k.glb` | 2K PBR Cyberpunk Rainy Street Environment |
| Mobile Street Map | `after_the_rain_mobile.glb` | Mobile VRAM-Optimized Street Environment |
| Character Avatar | `cool_man.glb` | Rigged Playable Third-Person Character |
| Station Pedestal | `Project_tower.glb` | Interactive Holographic Station Tower |
| Desktop Throne | `throne_of_iron__stone.glb` | Sculpted Iron Throne Centerpiece |
| Mobile Throne | `throne_mobile.glb` | Mobile Optimized Iron Throne |

---

## 👤 Original Creator & Attribution

**MD. Kaium Hasan** — *Network Engineer & Fullstack Developer*
- **Portfolio:** [www.mdkaiumhasan.site](https://www.mdkaiumhasan.site)
- **GitHub:** [@mdkaiumhasan](https://github.com/mdkaiumhasan)
- **LinkedIn:** [linkedin.com/in/md-kaium-hasan-bb6009372](https://www.linkedin.com/in/md-kaium-hasan-bb6009372/)
- **Email:** [mdkaiumhasan2005@gmail.com](mailto:mdkaiumhasan2005@gmail.com)

---

## 📄 License

Open-sourced under the **[MIT License](LICENSE)** — Copyright (c) 2026 **MD. Kaium Hasan**.  
Feel free to fork, learn from the architecture, and build your own interactive 3D + 2D portfolio! If you find this engine useful, please give the repo a ⭐ on GitHub.
