# 🌧️ MD. Kaium Hasan — 3D Interactive Cyberpunk Portfolio

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.dot.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=redux&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**An immersive, AAA-inspired 3D web experience built with React Three Fiber, WebGL, and TypeScript.**  
Explore interactive stations, examine enterprise projects, inspect technical credentials, and discover the journey of a Fullstack Systems & Cisco Certified Network Support Engineer.

[🌐 Live Portfolio Demo](#) • [💼 LinkedIn](https://linkedin.com/in/md-kaium-hasan) • [📧 Contact Me](mailto:mdkaiumhasan2005@gmail.com)

</div>

---

## 🌟 Overview

This portfolio is not just another flat website—it's a playable, photorealistic 3D world set in an atmospheric rainy street. Visitors take control of an animated 3D avatar in third-person view, interacting with futuristic holograms and physical pedestals to learn about my background, projects, enterprise architecture experience, and network engineering credentials.

---

## ✨ Key Features

### 🎮 AAA Third-Person Character Controller
- **Dynamic Physics & Locomotion:** Smooth walking animations, sprint mode, responsive rotation, and camera following using dampening algorithms.
- **Octree Collision Physics:** Real-time 3D spatial partitioning (`three/examples/jsm/math/Octree`) ensures the avatar collides accurately with buildings, curbs, and boundaries without clipping.
- **Mobile Touch Joystick:** Custom on-screen virtual joystick and touch controls for seamless mobile and tablet navigation.

### 🌧️ Immersive Cyberpunk / Rainy Environment
- **Atmospheric Visuals:** GPU-accelerated rain particle system, volumetric fog, dynamic lighting, and Parisian PBR street shaders.
- **3D Interactive Pedestals:** Glowing crystal pedestals and floating holographic interaction markers (`[E]` / Tap to Interact) that trigger modals when approached.
- **Iron Throne of Mastery:** A sculpted throne pedestal highlighting core certifications and career achievements.

### 🏛️ Interactive Stations
1. **Projects Exhibition:** Enterprise platforms including food delivery networks, real-time tracking, IoT and microservices architectures.
2. **Skills & Tech Vault:** Filterable breakdown across Frontend, Backend, Cloud/DevOps, and Cisco Networking.
3. **Experience Matrix:** Timeline of production engineering roles, ISP operations, and scalable application deliveries.
4. **Resume Vault:** Dual-track downloadable resumes (Fullstack Software Developer & Cisco CCNA Network Support Engineer).
5. **Contact Center:** Instant contact modal with direct links and copyable communication channels.

### ⚡ Accessibility & Performance (Hybrid Architecture)
- **Classic 2D Mode:** Users on low-power devices can toggle into a sleek, glassmorphic 2D portfolio at any time with a single click.
- **Graphics Settings:** Built-in settings modal with customizable graphics tiers (Low, Medium, High, Ultra), audio volume toggles, and performance monitors.
- **Web Audio Engine:** Spatial footsteps, ambient rain atmosphere, and synthesized futuristic UI sound effects using the Web Audio API.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite 5, HTML5 Semantic Markup |
| **3D & Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei`, GLTF/GLB PBR Pipelines |
| **Physics & Math** | Three.js Octree Collision Engine, Vector3 spherical dampening |
| **State Management** | Zustand (lightweight reactive global game & UI store) |
| **Audio & SFX** | Web Audio API (Synthesized procedural SFX + Spatial Audio) |
| **Icons & Styling** | Lucide React, Glassmorphism CSS, Canvas Confetti |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mdkaiumhasan/3D-PORTFOLIO.git
   cd 3D-PORTFOLIO
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional):**
   ```bash
   cp .env.example .env
   ```
   *(If `VITE_RAIN_STREET_MODEL_URL` is empty, the application automatically loads the local model in development).*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🕹️ Controls Guide

| Input | Action |
| :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or Arrow Keys | Move Avatar |
| <kbd>Shift</kbd> | Sprint / Run Faster |
| <kbd>E</kbd> or <kbd>Enter</kbd> | Interact with Station / Open Panel |
| <kbd>Esc</kbd> | Close Active Panel / Exit Modal |
| 📱 **Virtual Joystick** | Move avatar on touch screens |
| 🎛️ **HUD Buttons** | Quick-access to sound, settings, 2D mode, and camera reset |

---

## 📐 3D Asset Architecture & Model Download

To keep this open-source repository lightweight (~50MB) and strictly compliant with GitHub's 100MB file limit:
- Avatar (`cool_man.glb`), pedestals (`Project_tower.glb`), and props are bundled directly inside the repository.
- The high-fidelity 2K PBR environment model (**`after_the_rain_2k.glb`**, 220 MB) is hosted via GitHub Releases CDN with zero loss in visual quality.

### 📥 Direct 3D Model Download for Developers
If you are running the project locally offline:
1. Download the environment model: **[after_the_rain_2k.glb (Release v1.0.0)](https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0/after_the_rain_2k.glb)**
2. Place the downloaded file into your local project directory at `public/models/after_the_rain_2k.glb`
3. In production deployments, the application automatically streams the asset directly from the GitHub Releases CDN URL with full CORS support.

---

## 👤 Author

**MD. Kaium Hasan**
- **Website:** [www.mdkaiumhasan.site](https://www.mdkaiumhasan.site)
- **LinkedIn:** [linkedin.com/in/md-kaium-hasan](https://linkedin.com/in/md-kaium-hasan)
- **GitHub:** [@mdkaiumhasan](https://github.com/mdkaiumhasan)
- **Email:** [mdkaiumhasan2005@gmail.com](mailto:mdkaiumhasan2005@gmail.com)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to fork, learn from the code, and build your own 3D web experiences!
