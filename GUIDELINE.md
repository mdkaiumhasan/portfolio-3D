# 📘 Complete Setup, Customization & Deployment Guideline

Welcome to the **3D Interactive Cyberpunk + 2D Hybrid Portfolio Engine** — originally engineered and open-sourced by **[MD. Kaium Hasan](https://github.com/mdkaiumhasan/portfolio-3D)**.

This step-by-step guide walks you through **everything from downloading the repository and 3D `.glb` assets to customizing your personal data via the Unified Admin Panel and deploying live to Vercel** — even if this is your very first 3D web project.

---

## 📑 Table of Contents

1. [System Architecture Overview](#-1-system-architecture-overview)
2. [Prerequisites](#-2-prerequisites)
3. [Step 1: Clone the Repository & Install Packages](#-3-step-1-clone-the-repository--install-packages)
4. [Step 2: Download & Set Up 3D `.glb` Assets (GitHub Releases)](#-4-step-2-download--set-up-3d-glb-assets-github-releases)
5. [Step 3: Configure Free Cloud Services (MongoDB, Cloudinary, Gemini)](#-5-step-3-configure-free-cloud-services-mongodb-cloudinary-gemini)
6. [Step 4: Configure `.env.local` & Run Locally](#-6-step-4-configure-envlocal--run-locally)
7. [Step 5: Customize the Portfolio for Yourself (2D + 3D)](#-7-step-5-customize-the-portfolio-for-yourself-2d--3d)
8. [Step 6: Deploy to Production on Vercel](#-8-step-6-deploy-to-production-on-vercel)
9. [Replacing or Customizing 3D Models (Advanced)](#-9-replacing-or-customizing-3d-models-advanced)
10. [Troubleshooting & Common Issues](#-10-troubleshooting--common-issues)
11. [License & Creator Attribution](#-11-license--creator-attribution)

---

## 🏗️ 1. System Architecture Overview

Unlike static templates where you have to edit dozens of React and HTML files by hand, this project includes **three synchronized applications in one codebase**:

| Route / URL | Interface | Description |
| :--- | :--- | :--- |
| `/` | **3D Interactive World** | Playable third-person cyberpunk street built with Three.js & React Three Fiber, Octree physics, interactive station pedestals, procedural rain/audio, and mobile touch joystick + camera orbit. |
| `/?view=2d` or `/classic.html` | **2D Classic Portfolio** | Ultra-fast, responsive glassmorphic 2D portfolio for visitors on low-power devices, recruiters in a hurry, or browsers without WebGL. |
| `/admin` | **Unified Admin Console** | Password-protected executive dashboard that controls **both 2D and 3D views simultaneously**, uploads images to Cloudinary, generates technical blog posts with Gemini AI, and manages a **Direct Messages Inbox**. |

---

## ✅ 2. Prerequisites

Before starting, make sure you have installed:
- **[Node.js](https://nodejs.org/)** (`v18.18.0` or newer — `v20 LTS` recommended)
- **[Git](https://git-scm.com/)**
- A **[GitHub](https://github.com/)** account (for hosting your fork and deploying to Vercel)

 verify your installation in a terminal (PowerShell, Command Prompt, macOS Terminal, or Linux bash):

```bash
node -v
npm -v
git --version
```

---

## 📥 3. Step 1: Clone the Repository & Install Packages

1. **Fork** this repository on GitHub (click the **Fork** button at the top-right of [github.com/mdkaiumhasan/portfolio-3D](https://github.com/mdkaiumhasan/portfolio-3D)), or clone it directly:

```bash
git clone https://github.com/mdkaiumhasan/portfolio-3D.git
cd portfolio-3D
```

2. **Install all project dependencies:**

```bash
npm install
```

---

## 🎮 4. Step 2: Download & Set Up 3D `.glb` Assets (GitHub Releases)

The 3D Interactive World uses **6 optimized `.glb` 3D model files** (Desktop & Mobile Maps, Playable Character Avatar, Interactive Station Pedestal, and Desktop & Mobile Iron Thrones) placed inside the `public/models/` folder.

All 6 official `.glb` resource files are hosted on **[GitHub Releases (`v1.0.0`)](https://github.com/mdkaiumhasan/portfolio-3D/releases/tag/1.0.0)**.

### Option A: Automatic One-Command Download (Recommended)

Run the built-in downloader script to automatically verify or fetch all 6 `.glb` models into `public/models/`:

```bash
npm run download-models
```

*(Tip: If a file already exists in `public/models/`, the script skips it automatically. Pass `npm run download-models -- --force` to re-download everything fresh.)*

### Option B: Manual Download Links (Direct from GitHub Release `v1.0.0`)

If you prefer downloading manually in your browser, download each file below and place it inside **`public/models/`** with the **exact same filename**:

| # | Asset Role | Exact Filename in `public/models/` | Approx. Size | Direct GitHub Release Download Link |
| :-: | :--- | :--- | :---: | :--- |
| 1 | **Desktop 3D Street Map** (2K PBR Environment) | `after_the_rain_2k.glb` | `89.5 MB` | [Download `after_the_rain_2k.glb`](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/after_the_rain_2k.glb) |
| 2 | **Mobile 3D Street Map** (VRAM-Optimized Environment) | `after_the_rain_mobile.glb` | `7.7 MB` | [Download `after_the_rain_mobile.glb`](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/after_the_rain_mobile.glb) |
| 3 | **Playable Character Avatar** (Rigged + Animations) | `cool_man.glb` | `7.6 MB` | [Download `cool_man.glb`](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/cool_man.glb) |
| 4 | **Interactive Station Pedestal** (Hologram Tower) | `Project_tower.glb` | `1.2 MB` | [Download `Project_tower.glb`](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/Project_tower.glb) |
| 5 | **Desktop Iron Throne** (Centerpiece Prop) | `throne_of_iron__stone.glb` | `38.0 MB` | [Download `throne_of_iron__stone.glb`](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/throne_of_iron__stone.glb) |
| 6 | **Mobile Iron Throne** (Lightweight Prop) | `throne_mobile.glb` | `1.5 MB` | [Download `throne_mobile.glb`](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/throne_mobile.glb) |

After Step 2, your `public/models/` directory must look like this:

```text
public/
└── models/
    ├── after_the_rain_2k.glb
    ├── after_the_rain_mobile.glb
    ├── cool_man.glb
    ├── Project_tower.glb
    ├── throne_of_iron__stone.glb
    └── throne_mobile.glb
```

### Option C: External CDN Streaming (Optional)

If you host your `.glb` files on Cloudflare R2, AWS S3, or your own CDN bucket with CORS enabled, you can set `VITE_MODEL_BASE_URL=https://your-cdn-domain.com/models` in `.env.local` / Vercel, and the engine will stream all 6 models from that base URL automatically.

---

## ☁️ 5. Step 3: Configure Free Cloud Services (MongoDB, Cloudinary, Gemini)

All backend features run on **100% free-tier developer accounts**:

### 5.1 MongoDB Atlas (Database for 2D/3D Content & Contact Inbox)
1. Sign up or log in at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster (`M0`)**.
3. Go to **Database Access** -> **Add New Database User**:
   - Choose **Password** authentication.
   - Enter a username and strong password (avoid special URL characters like `@` or `#` in the password, or URL-encode them).
   - Grant **Read and write to any database**.
4. Go to **Network Access** -> **Add IP Address**:
   - Click **Allow Access from Anywhere (`0.0.0.0/0`)** and confirm. *(Required so Vercel Serverless Functions can connect dynamically!)*
5. Go to **Database** -> Click **Connect** -> **Drivers (Node.js)** -> Copy the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio_db?retryWrites=true&w=majority
   ```

### 5.2 Cloudinary (Image Upload & Automatic WebP Optimization)
1. Create a free account at [cloudinary.com](https://cloudinary.com/).
2. Open your **Cloudinary Dashboard** (or **Settings -> API Keys**) and copy:
   - **Cloud Name** (`CLOUDINARY_CLOUD_NAME`)
   - **API Key** (`CLOUDINARY_API_KEY`)
   - **API Secret** (`CLOUDINARY_API_SECRET`)

### 5.3 Admin Console Password & HMAC Session Secret
- Choose a strong password for `/admin` (`ADMIN_PASSWORD`).
- Generate a random 64-character secret for signing session tokens (`JWT_SECRET`) by running this in your terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 5.4 Google Gemini API Key *(Optional — For AI Blog Studio)*
1. Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Click **Create API Key** and copy it into `GEMINI_API_KEY`.
   *(If omitted, manual blog writing and editing in `/admin` still work completely fine.)*

---

## 💻 6. Step 4: Configure `.env.local` & Run Locally

1. Create a `.env.local` file in the project root by copying `.env.example`:

   **Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env.local
   ```
   **macOS / Linux / Git Bash:**
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in VS Code (or any editor) and fill in your credentials:

   ```env
   VITE_MODEL_BASE_URL=

   MONGODB_URI=mongodb+srv://yourUser:yourPass@cluster0.xxxxx.mongodb.net/portfolio_db?retryWrites=true&w=majority
   MONGODB_DB_NAME=portfolio_db

   ADMIN_PASSWORD=YourStrongAdminPassword123!
   JWT_SECRET=paste_your_generated_64_char_hex_secret_here

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   GEMINI_API_KEY=your_optional_gemini_api_key
   ```

   > **Security Note:** `.env.local` is already listed in `.gitignore`. **Never** commit `.env.local` or paste real keys into source files.

3. **Start the local development server** (runs Vite frontend + all `/api/*` serverless endpoints locally!):

   ```bash
   npm run dev
   ```

4. Test all three routes in your browser:
   - **3D Interactive Portfolio:** `http://localhost:5173/`
   - **2D Classic Portfolio:** `http://localhost:5173/?view=2d` (or `http://localhost:5173/classic.html`)
   - **Unified Admin Console:** `http://localhost:5173/admin`

---

## 🎨 7. Step 5: Customize the Portfolio for Yourself (2D + 3D)

### 7.1 Zero-Code Customization via `/admin` (Recommended)
1. Open `http://localhost:5173/admin` and sign in with your `ADMIN_PASSWORD`.
2. Update every section from the sidebar:
   - **Control Hub:** Toggle **"Available for Work"** badge and section maintenance banners.
   - **Home & Bio:** Set your Name (wrap highlighted name in `{{ACCENT}}Your Name{{/ACCENT}}`), Role, Bio narrative, Profile Portrait (upload directly via Cloudinary), and Resume PDF links (`home_cv_link`, `software_cv_link`, `network_cv_link`).
   - **Certifications:** Add your degrees, badges, or key stat metrics.
   - **Skills Matrix:** Create custom skill categories and set proficiency sliders (`0%–100%`).
   - **Projects & Categories:** Add your projects with cover images, tech stack, **Live Demo URL**, **GitHub Repo URL**, and rich HTML case studies.
   - **Timeline & NOC:** Add your work history, internships, and education milestones.
   - **Blog Articles:** Write full HTML articles (opens in the built-in 2D/3D Reader), link external LinkedIn/Medium posts, or generate technical articles in 1 click using **Generate with AI**.
   - **Activities & Robotics:** Showcase hackathons, exhibitions, or extracurricular highlights.
   - **Contact & Inbox:** Update your email, phone, location, social media links, and read/reply to visitor messages directly inside the **Direct Messages Inbox**.
3. Click **Save Changes** (or press `Ctrl + S` / `Cmd + S`). Both your **2D** and **3D** portfolios update immediately!

### 7.2 Update Browser Tab Title, SEO Meta Tags & Favicon
To replace the default SEO metadata (used when sharing your link on LinkedIn, Facebook, WhatsApp, or X/Twitter), edit:
- **`index.html`** — Update `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, `canonical` URL, and favicon `<link rel="icon">`.
- **`public/classic.html`** — Update `<title>` and meta tags at the top of the file if sharing `/classic.html` directly.
- **`admin.html`** — Update `<title>` for your Admin tab.

### 7.3 Update Offline / Initial Fallback Data (Optional)
Before MongoDB responds on the very first uncached load (or if MongoDB is temporarily unreachable), the app falls back to default data in:
- `src/admin/api.ts` (`fallbackPortfolioData`)
- `public/data/legacy_data.json`

Once you save your own profile in `/admin` locally during `npm run dev`, the server automatically syncs `public/data/legacy_data.json` for you!

---

## 🚀 8. Step 6: Deploy to Production on Vercel

This repository is pre-configured with `vercel.json` and serverless functions in `api/` for seamless **Vercel** deployment.

1. **Test your production build locally first:**
   ```bash
   npm run build
   ```
   Ensure it completes with `✓ built in ...` and zero TypeScript errors.

2. **Push your customized repository to your own GitHub account:**
   ```bash
   git remote set-url origin https://github.com/<your-github-username>/<your-repo-name>.git
   git add -A
   git commit -m "chore: customize portfolio content and metadata"
   git push -u origin main
   ```

3. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
   - Select your repository and click **Import**.
   - Confirm build settings (auto-detected):
     - **Framework Preset:** `Vite`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

4. **Add Environment Variables in Vercel:**
   Before clicking Deploy, expand **Environment Variables** and add:

   | Variable Name | Required? | Value |
   | :--- | :---: | :--- |
   | `MONGODB_URI` | **Yes** | Your MongoDB Atlas `mongodb+srv://...` URI |
   | `MONGODB_DB_NAME` | **Yes** | `portfolio_db` |
   | `ADMIN_PASSWORD` | **Yes** | Your `/admin` login password |
   | `JWT_SECRET` | **Yes** | Random 64-character hex string |
   | `CLOUDINARY_CLOUD_NAME` | **Yes** | Your Cloudinary Cloud Name |
   | `CLOUDINARY_API_KEY` | **Yes** | Your Cloudinary API Key |
   | `CLOUDINARY_API_SECRET` | **Yes** | Your Cloudinary API Secret |
   | `GEMINI_API_KEY` | Optional | Your Google Gemini API Key |
   | `VITE_MODEL_BASE_URL` | Optional | Leave blank if `public/models/*.glb` is in your repo, or set your CDN/Release URL |

5. **Click Deploy!**
   Within ~1 minute, your portfolio will be live at `https://your-project.vercel.app`:
   - `https://your-project.vercel.app/` -> **3D World**
   - `https://your-project.vercel.app/?view=2d` -> **2D Classic Portfolio**
   - `https://your-project.vercel.app/admin` -> **Admin Console** (Log in once and click **Save** if your MongoDB database is brand new!)

---

## 🛠️ 9. Replacing or Customizing 3D Models (Advanced)

If you want to swap in your own 3D character or environment in Blender:
- **Character (`public/models/cool_man.glb`):** Rigged humanoid `.glb` (Mixamo / Ready Player Me compatible). Animation clip matching is handled in `src/components/player/characterAnimations.ts`.
- **Environment (`after_the_rain_2k.glb` & `after_the_rain_mobile.glb`):** Loaded and calibrated in `src/components/world/RainStreet.tsx` with automatic Octree collision mesh generation. Keep mobile textures <= `1024px` (`< 15 MB` total `.glb`) to prevent mobile browser VRAM crashes.
- **Station Positions:** Customize pedestal coordinates, colors, titles, and target modals in `STATIONS` inside `src/store/gameStore.ts`.

---

## 🩺 10. Troubleshooting & Common Issues

- **`/admin` login says `ADMIN_PASSWORD is not configured`:**
  Make sure `.env.local` exists locally (restart `npm run dev` after editing `.env.local`) or redeploy on Vercel after adding `ADMIN_PASSWORD` in Vercel Settings -> Environment Variables.
- **Changes saved in `/admin` fail with a MongoDB timeout on Vercel:**
  In MongoDB Atlas -> **Network Access**, make sure `0.0.0.0/0` (Allow Access from Anywhere) is active. Vercel Serverless Functions use dynamic cloud IPs.
- **3D Scene fails to load after cloning:**
  Run `npm run download-models` to verify all 6 `.glb` files are downloaded inside `public/models/`.
- **Styling changes in `public/classic.html` don't show new Tailwind utility classes:**
  Run `npm run build:classic-css` (also run automatically during `npm run build`) to recompile `public/classic-tailwind.css`.

---

## 📜 11. License & Creator Attribution

This project is open-sourced under the **[MIT License](LICENSE)**.

- **Original Architect & Creator:** **MD. Kaium Hasan**
- **Live Portfolio:** [www.mdkaiumhasan.site](https://www.mdkaiumhasan.site)
- **GitHub Repository:** [github.com/mdkaiumhasan/portfolio-3D](https://github.com/mdkaiumhasan/portfolio-3D)
- **LinkedIn:** [linkedin.com/in/md-kaium-hasan-bb6009372](https://www.linkedin.com/in/md-kaium-hasan-bb6009372/)

You are completely free to fork, customize, and deploy this engine for your personal or commercial portfolio! Keeping the [LICENSE](LICENSE) copyright notice and creator credit is appreciated and helps support open-source 3D web engineering. ⭐ **If this project helped you, please give the repository a Star on GitHub!**
