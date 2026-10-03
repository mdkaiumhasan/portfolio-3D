# 3D Game-Style Developer Portfolio
## Complete Product Requirements Document

**Document:** `prd.md`  
**Version:** 1.0  
**Product:** Interactive 3D Developer Portfolio  
**Platform:** Web (Desktop + Mobile)  
**Development Strategy:** MVP → Polish → Premium Game

---

# 1. Product Overview

এই project-এর লক্ষ্য একটি traditional scrolling portfolio-এর পরিবর্তে একটি **interactive 3D game-style portfolio website** তৈরি করা।

Visitor একটি 3D world-এর মধ্যে একটি playable character control করবে এবং world-এর বিভিন্ন location explore করে developer-এর:

- About
- Skills
- Projects
- Experience
- Resume
- Contact
- Social profiles

discover করবে।

মূল concept:

> **The 3D world is the hook. The portfolio content is the product.**

Experience game-like হবে, কিন্তু portfolio information যেন দ্রুত এবং সহজে পাওয়া যায়—বিশেষ করে recruiters এবং clients-এর জন্য।

---

# 2. Product Vision

একটি premium, memorable, performant এবং responsive portfolio তৈরি করা যা:

1. প্রথম কয়েক সেকেন্ডের মধ্যে visitor-কে visually impress করবে।
2. Character-based exploration-এর মাধ্যমে portfolio discover করতে দেবে।
3. Traditional navigation-এর fallback রাখবে।
4. Desktop এবং mobile উভয় platform-এ usable হবে।
5. Future-এ full game-like experience-এ expand করা যাবে।

---

# 3. Existing Assets

বর্তমানে available:

```text
/assets/map.glb
/assets/cool_man.glb
```

## `map.glb`

Main 3D portfolio environment।

## `cool_man.glb`

Playable character।

### Asset inspection requirements

Development শুরুতেই verify করতে হবে:

- Model scale
- Up axis
- Origin
- Materials
- Texture paths
- Embedded textures
- Animation clips
- Polygon count
- Draw calls
- Bounding boxes
- Skeleton
- Character proportions

যদি `cool_man.glb`-তে animation না থাকে, পরে Blender-এ animation যোগ করতে হবে।

---

# 4. Target Users

## Primary

### Recruiters
যারা দ্রুত:

- Developer কে
- কী skills আছে
- কী projects করেছে
- Contact কোথায়

জানতে চান।

### Clients

যারা previous work এবং technical capability দেখতে চান।

## Secondary

- Developers
- Friends
- Community
- General visitors

---

# 5. Core User Journey

```text
Landing
   ↓
Loading
   ↓
3D World
   ↓
Character Spawn
   ↓
Tutorial
   ↓
Free Exploration
   ↓
Interactive Locations
   ↓
Portfolio Panels
   ↓
Projects / Skills / About / Contact
   ↓
External Links / Resume
```

Alternative fast path:

```text
Landing
   ↓
Menu
   ↓
Projects / About / Skills / Contact
```

Visitor-কে পুরো world explore করতেই হবে এমন বাধ্যবাধকতা থাকবে না।

---

# 6. Product Principles

## 6.1 Portfolio First

Game mechanics portfolio information-এর উপরে priority পাবে না।

## 6.2 Fast Discovery

Visitor 30–60 seconds-এর মধ্যে essential portfolio information বুঝতে পারবে।

## 6.3 Progressive Complexity

প্রথমে simple playable experience:

```text
MVP
```

তারপর visual polish:

```text
Polish
```

তারপর advanced game mechanics:

```text
Premium Game
```

## 6.4 Performance First

Visual quality বাড়ানোর আগে performance budget maintain করতে হবে।

## 6.5 Mobile Friendly

Mobile experience secondary নয়; simplified হলেও usable হতে হবে।

---

# 7. Technology Stack

## Core

```text
React
TypeScript
Vite
```

## 3D

```text
Three.js
React Three Fiber
@react-three/drei
```

## Physics

```text
@react-three/rapier
```

## State

```text
Zustand
```

## UI

```text
Tailwind CSS
Motion
```

## Asset Pipeline

```text
Blender
GLB / GLTF
Draco
Meshopt
KTX2 / Basis
gltf-transform
```

## Deployment

```text
Vercel
```

---

# 8. Suggested Project Structure

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.ts
│
├── components/
│   ├── player/
│   │   ├── Player.tsx
│   │   ├── PlayerController.ts
│   │   ├── PlayerAnimations.ts
│   │   └── PlayerCollider.ts
│   │
│   ├── world/
│   │   ├── World.tsx
│   │   ├── Environment.tsx
│   │   ├── InteractiveObject.tsx
│   │   └── CollisionWorld.tsx
│   │
│   ├── camera/
│   │   └── ThirdPersonCamera.tsx
│   │
│   ├── interaction/
│   │   ├── InteractionSystem.ts
│   │   └── InteractionPrompt.tsx
│   │
│   ├── controls/
│   │   ├── KeyboardControls.ts
│   │   └── MobileControls.tsx
│   │
│   └── ui/
│       ├── HUD.tsx
│       ├── Menu.tsx
│       ├── LoadingScreen.tsx
│       ├── Tutorial.tsx
│       ├── AboutPanel.tsx
│       ├── ProjectsPanel.tsx
│       ├── SkillsPanel.tsx
│       ├── ExperiencePanel.tsx
│       └── ContactPanel.tsx
│
├── scenes/
│   └── PortfolioWorld.tsx
│
├── systems/
│   ├── input.ts
│   ├── movement.ts
│   ├── interaction.ts
│   ├── audio.ts
│   └── quality.ts
│
├── store/
│   └── gameStore.ts
│
├── data/
│   ├── projects.ts
│   ├── skills.ts
│   ├── experience.ts
│   └── profile.ts
│
├── assets/
│   ├── map.glb
│   ├── cool_man.glb
│   └── audio/
│
└── styles/
    └── globals.css
```

---

# 9. Application Architecture

```text
                         APP
                          |
              +-----------+-----------+
              |                       |
            WORLD                     UI
              |                       |
      +-------+-------+          +----+----+
      |       |       |          |         |
     MAP    PLAYER  CAMERA      HUD      MENU
              |
          PHYSICS
              |
          MOVEMENT
              |
         ANIMATION
              |
        INTERACTION
              |
       +------+------+------+
       |      |      |      |
     ABOUT PROJECTS SKILLS CONTACT
```

---

# 10. Global State

Zustand store should manage:

```ts
gameState
├── player
│   ├── position
│   ├── rotation
│   ├── velocity
│   └── movementState
│
├── interaction
│   ├── nearbyObject
│   └── activeInteraction
│
├── ui
│   ├── activePanel
│   ├── menuOpen
│   └── tutorialVisible
│
├── settings
│   ├── quality
│   ├── sound
│   └── music
│
└── progression
    ├── discoveredZones
    ├── completedQuests
    └── achievements
```

Premium-only state should not complicate the MVP store unnecessarily.

---

# 11. Phase 1 — MVP

## MVP Goal

একটি fully usable **playable 3D portfolio** তৈরি করা।

MVP-তে game mechanics minimal থাকবে।

---

## 11.1 MVP Feature List

### World

- [ ] R3F canvas
- [ ] `map.glb` loading
- [ ] Environment lighting
- [ ] Basic shadows
- [ ] Basic scene setup

### Player

- [ ] `cool_man.glb` loading
- [ ] Character collider
- [ ] Gravity
- [ ] Walking
- [ ] Running
- [ ] Jumping
- [ ] Character rotation

### Camera

- [ ] Third-person camera
- [ ] Follow
- [ ] Orbit
- [ ] Zoom
- [ ] Smooth damping

### Physics

- [ ] Rapier integration
- [ ] Ground collision
- [ ] Environment collision
- [ ] Character collision

### Interaction

- [ ] Detection radius
- [ ] Interaction prompt
- [ ] E key
- [ ] Interaction manager

### Portfolio

- [ ] About
- [ ] Projects
- [ ] Skills
- [ ] Experience
- [ ] Contact
- [ ] Resume

### UI

- [ ] HUD
- [ ] Menu
- [ ] Loading screen
- [ ] Tutorial
- [ ] Information panels

### Mobile

- [ ] Virtual joystick
- [ ] Camera touch control
- [ ] Jump button
- [ ] Interact button

### Fallback

- [ ] WebGL fallback
- [ ] Direct portfolio navigation

---

# 12. MVP — Phase-by-Phase Coding Plan

## MVP-01 — Project Setup

Create:

```text
React
TypeScript
Vite
R3F
Drei
Rapier
Zustand
Tailwind
Motion
```

Acceptance criteria:

- Development server works.
- Production build works.
- TypeScript has no blocking errors.
- Empty 3D scene renders.

---

## MVP-02 — Load Map

Load:

```text
map.glb
```

Requirements:

- Correct scale
- Correct orientation
- Correct materials
- Correct texture paths
- No major console errors

Acceptance:

> Visitor can see the complete environment.

---

## MVP-03 — Lighting

Add:

- Ambient/Hemisphere lighting
- Directional key light
- Environment lighting
- Basic shadows

Acceptance:

> World has readable depth and character visibility.

---

## MVP-04 — Physics

Add Rapier.

World:

```text
Visual Mesh
+
Collision Mesh
```

Prefer simplified collision geometry over expensive triangle colliders wherever practical.

Acceptance:

- Character cannot fall through ground.
- Character cannot walk through major buildings/objects.
- Collision remains stable.

---

## MVP-05 — Player

Load:

```text
cool_man.glb
```

Implement:

- Spawn point
- Collider
- Movement
- Gravity
- Jump
- Run

Acceptance:

> Player can freely navigate the main world.

---

## MVP-06 — Animation

Inspect available GLB clips.

Expected:

```text
Idle
Walk
Run
Jump
Fall
```

If unavailable, create/retarget animations later.

Acceptance:

- Animation matches movement.
- No obvious snapping.
- Idle state works.
- Movement transitions are smooth.

---

## MVP-07 — Camera

Implement:

```text
ThirdPersonCamera
```

Requirements:

- Smooth follow
- Mouse orbit
- Scroll zoom
- Camera obstruction handling

Acceptance:

> Camera remains comfortable during exploration and does not frequently clip through the environment.

---

## MVP-08 — Input System

Desktop:

```text
WASD / Arrow Keys
Shift
Space
E
Mouse
Scroll
```

Input should be centralized.

Do not bind movement logic directly into UI components.

---

## MVP-09 — Interaction System

Create reusable interactive object API:

```ts
{
  id: string;
  type: InteractionType;
  position: Vector3;
  radius: number;
  onInteract: () => void;
}
```

Supported MVP types:

```text
ABOUT
PROJECT
SKILL
EXPERIENCE
CONTACT
RESUME
```

Acceptance:

- Nearby object is detected.
- Prompt appears.
- E triggers correct action.
- Interaction closes cleanly.

---

## MVP-10 — About

Panel content:

- Name
- Role
- Short bio
- Main interests
- Current focus

---

## MVP-11 — Projects

Project data should be externalized:

```ts
{
  id,
  title,
  description,
  image,
  technologies,
  features,
  github,
  live
}
```

Panel must support:

- Project image
- Description
- Tech stack
- GitHub
- Live demo

---

## MVP-12 — Skills

Group skills:

```text
Frontend
Backend
Database
3D
Tools
Other
```

Avoid over-engineering skill visualization in MVP.

---

## MVP-13 — Experience

Show:

- Company
- Role
- Duration
- Responsibilities
- Key work

---

## MVP-14 — Contact

Show:

- Email
- GitHub
- LinkedIn
- Resume

External links should be clearly identifiable.

---

## MVP-15 — HUD

HUD:

```text
Developer Name
Menu
Current zone
Interaction prompt
Controls hint
```

HUD should not obstruct the 3D world.

---

## MVP-16 — Menu

Menu:

```text
ABOUT
PROJECTS
SKILLS
EXPERIENCE
CONTACT
RESUME
```

Menu provides a fast route to information.

---

## MVP-17 — Loading

Loading states:

```text
INITIALIZING
LOADING WORLD
LOADING CHARACTER
PREPARING EXPERIENCE
READY
```

Use actual asset loading progress where possible.

---

## MVP-18 — Tutorial

Display:

```text
WASD — Move
Mouse — Look
Shift — Run
Space — Jump
E — Interact
```

Actions:

```text
Got it
Skip
```

---

## MVP-19 — Mobile

Implement:

```text
Virtual Joystick
Touch Camera
Jump
Interact
```

Controls should have approximately 44px+ touch targets.

---

## MVP-20 — WebGL Fallback

If 3D cannot initialize:

```text
3D mode unavailable.

[About]
[Projects]
[Skills]
[Experience]
[Contact]
[Resume]
```

---

# 13. MVP Acceptance Criteria

MVP is complete when:

```text
[ ] World loads
[ ] Player loads
[ ] Player moves
[ ] Player runs
[ ] Player jumps
[ ] Gravity works
[ ] Collision works
[ ] Camera follows
[ ] Camera rotates
[ ] Animations work
[ ] Interaction works
[ ] About works
[ ] Projects work
[ ] Skills work
[ ] Experience works
[ ] Contact works
[ ] Resume works
[ ] Menu works
[ ] Loading works
[ ] Tutorial works
[ ] Mobile controls work
[ ] WebGL fallback works
[ ] Production build succeeds
```

---

# 14. Phase 2 — POLISH

## Polish Goal

MVP-এর functional prototype-কে একটি **premium-looking portfolio experience** বানানো।

Focus:

```text
Visual Quality
UX
Animation
Audio
Performance
Responsive Design
```

---

# 15. Polish — Visual Upgrade

## Lighting

Upgrade:

- Better HDR environment
- Sun/moon lighting
- Contact shadows
- Improved shadow maps
- Ambient occlusion if performance allows

## Materials

Improve:

- Roughness
- Metalness
- Normal maps
- Emissive materials

## Environment

Add:

- Decorative props
- Signs
- Plants
- Lamps
- Small environmental details

---

# 16. Polish — Character Upgrade

Improve:

- Animation blending
- Acceleration
- Deceleration
- Footstep timing
- Run transition
- Jump transition
- Landing animation

Add subtle character movement:

- Head movement
- Body lean
- Turning animation

---

# 17. Polish — Camera

Add:

- Camera collision
- Better damping
- Dynamic FOV
- Run FOV increase
- Cinematic transitions
- Focus transitions when opening panels

Avoid excessive camera shake.

---

# 18. Polish — UI

Improve:

- Typography
- Spacing
- Icons
- Panel transitions
- Backdrop blur where appropriate
- Micro-interactions
- Motion transitions

Visual principle:

> UI should feel like part of the game world, not a separate website pasted over it.

---

# 19. Polish — Interaction Feedback

Add:

- Object highlight
- Hover/touch feedback
- Interaction sound
- Prompt animation
- Distance-based prompt visibility

Example:

```text
Approach object
     ↓
Object subtly highlights
     ↓
"E — Interact"
     ↓
Interaction
     ↓
Panel transition
```

---

# 20. Polish — Audio

Add:

### Ambient

- Wind
- Environment ambience
- Subtle background music

### Gameplay

- Footsteps
- Jump
- Landing
- Interaction

### UI

- Open
- Close
- Selection

Audio controls:

```text
Master
Music
SFX
```

Default audio should respect browser autoplay restrictions.

---

# 21. Polish — Performance

Target:

### Desktop

Approximately:

```text
60 FPS
```

on reasonable modern hardware.

### Mobile

Approximately:

```text
30–60 FPS
```

depending on device capability.

Optimization:

- GLB compression
- Meshopt/Draco
- KTX2 textures
- Texture atlasing where appropriate
- Instancing
- LOD
- Frustum culling
- Shadow optimization
- Object visibility management
- Lazy loading
- Reduced DPR on weaker devices

---

# 22. Polish — Quality Profiles

Implement:

```text
AUTO
LOW
MEDIUM
HIGH
```

Quality settings can control:

```text
Pixel Ratio
Shadows
Particles
Post Processing
Environment Effects
```

AUTO should select a sensible starting profile.

---

# 23. Polish — Accessibility

Support:

- Reduced motion
- UI keyboard navigation
- Focus states
- High contrast
- Skip tutorial
- Skip 3D experience
- Direct portfolio navigation

---

# 24. Polish Acceptance Criteria

```text
[ ] Visual hierarchy feels intentional
[ ] Character animations are smooth
[ ] Camera feels natural
[ ] Interaction feedback is clear
[ ] UI transitions are polished
[ ] Audio is integrated
[ ] Mobile UX is usable
[ ] Performance is stable
[ ] Reduced-motion support works
[ ] Quality settings work
```

---

# 25. Phase 3 — PREMIUM GAME

## Premium Goal

Portfolio-কে একটি **small playable game world**-এ transform করা।

এই phase-এ features optional এবং portfolio value-এর পাশাপাশি entertainment value বাড়াবে।

---

# 26. Premium Feature — Quest System

Visitor ছোট quests complete করতে পারবে।

Example:

```text
Quest:
Find the Project Terminal

     ↓

Explore world

     ↓

Find terminal

     ↓

Open project

     ↓

Quest Complete
```

Quest types:

- Explore
- Discover
- Interact
- Collect
- Find hidden location

---

# 27. Premium Feature — Progression

Track:

```text
Discovered Zones
Projects Viewed
Secrets Found
Achievements
Quest Progress
```

Example:

```text
Portfolio Explorer

Projects:
3 / 6

Zones:
4 / 5

Secrets:
2 / 4
```

---

# 28. Premium Feature — Achievements

Examples:

```text
FIRST STEPS
Enter the world.

CURIOUS
Open your first project.

EXPLORER
Visit every zone.

CODE HUNTER
Find a hidden terminal.

FULL TOUR
Discover the entire portfolio.
```

Achievements should remain optional and should not block portfolio access.

---

# 29. Premium Feature — NPC

Optional NPC system:

```text
NPC
 ↓
Approach
 ↓
Dialogue
 ↓
Choice
 ↓
Information / Quest
```

NPC can introduce:

- Developer
- Projects
- Skills
- Career journey

Dialogue should remain concise.

---

# 30. Premium Feature — Interactive Terminals

Add physical portfolio terminals.

Examples:

```text
Project Computer
Skill Database
Resume Terminal
Contact Station
GitHub Terminal
```

This makes the portfolio information feel native to the world.

---

# 31. Premium Feature — Hidden Areas

Create secret locations:

```text
Hidden Room
Secret Tunnel
Developer Room
Easter Egg
```

Secrets should be fun but never required for core portfolio information.

---

# 32. Premium Feature — Cinematic Sequences

Use short cinematic sequences for:

- World introduction
- Zone transitions
- Major project showcase
- Portfolio completion

Requirements:

- Skippable
- Short
- Respect reduced-motion preference

---

# 33. Premium Feature — Dynamic Environment

Optional:

```text
Day
Sunset
Night
```

Could affect:

- Lighting
- Sky
- Ambient audio
- Environment appearance

Do not add dynamic systems unless they meaningfully improve the experience.

---

# 34. Premium Feature — Weather

Optional:

```text
Rain
Fog
Wind
Particles
```

Weather should be performance-aware.

Low-end devices should automatically reduce or disable expensive effects.

---

# 35. Premium Feature — Controller Support

Optional:

```text
Xbox
PlayStation
Generic Gamepad
```

Mapping:

```text
Left Stick  → Move
Right Stick → Camera
A / Cross   → Jump
B / Circle  → Back
X / Square  → Interact
```

---

# 36. Premium Feature — Mini Games

Optional small interactions:

- Memory game
- Coding puzzle
- Find hidden objects
- Simple obstacle challenge

Mini-games must never prevent users from accessing portfolio content.

---

# 37. Premium Feature — World Map

A small map UI can show:

```text
You are here

ABOUT
PROJECTS
SKILLS
EXPERIENCE
CONTACT
```

Map should improve navigation rather than replace exploration.

---

# 38. Premium Feature — Save Progress

Optional local persistence:

```text
Zones discovered
Achievements
Quest progress
Settings
```

Use local storage only for non-sensitive gameplay preferences/progress.

No sensitive personal information should be stored.

---

# 39. Premium Acceptance Criteria

```text
[ ] Quest system works
[ ] Progress tracking works
[ ] Achievements work
[ ] NPC dialogue works
[ ] Interactive terminals work
[ ] Hidden areas work
[ ] Cinematic sequences are skippable
[ ] Dynamic environment is performant
[ ] Controller support works if enabled
[ ] Premium systems do not block portfolio access
```

---

# 40. Data Architecture

Portfolio content should be data-driven.

Example:

```ts
export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  features: string[];
  github?: string;
  live?: string;
}
```

Example:

```ts
export const projects: Project[] = [
  {
    id: "project-01",
    title: "Project Name",
    description: "Project description",
    technologies: ["React", "Three.js"],
    features: ["Feature one", "Feature two"],
    github: "https://github.com/...",
    live: "https://..."
  }
];
```

This architecture allows portfolio content to change without changing game systems.

---

# 41. Interaction Architecture

All interactable objects should use one common interface.

```text
InteractiveObject
├── id
├── type
├── position
├── radius
├── prompt
└── action
```

Possible types:

```text
ABOUT
PROJECT
SKILL
EXPERIENCE
CONTACT
RESUME
NPC
QUEST
TERMINAL
SECRET
```

This allows new interactions to be added without rewriting the player controller.

---

# 42. Input Architecture

Use an abstract input layer.

```text
                 INPUT
                   |
       +-----------+-----------+
       |           |           |
    Keyboard     Touch      Gamepad
       |           |           |
       +-----------+-----------+
                   |
              Input State
                   |
              Game Systems
```

Game systems should not care whether input came from keyboard, touch or controller.

---

# 43. Performance Budget

The exact budget will depend on the final `map.glb`, but development should continuously monitor:

```text
FPS
Frame time
Draw calls
Triangles
Texture memory
JS bundle size
GLB size
Initial load time
```

Recommended principles:

- Avoid unnecessary 4K textures.
- Avoid excessive transparent materials.
- Avoid large numbers of real-time lights.
- Avoid high-resolution shadows everywhere.
- Prefer baked/static lighting when appropriate.
- Use simplified collision geometry.
- Load expensive assets progressively.

---

# 44. Loading Strategy

Initial:

```text
Critical assets
├── map
├── player
└── essential environment
```

Later:

```text
Non-critical assets
├── decorative props
├── audio
├── optional effects
└── premium content
```

Premium-only assets should not increase MVP initial loading unnecessarily.

---

# 45. Error Handling

Handle:

- GLB load failure
- Texture load failure
- WebGL unavailable
- Audio unavailable
- Missing project image
- Broken external link
- Invalid asset

Do not allow one missing decorative asset to crash the whole application.

---

# 46. Responsive Strategy

## Desktop

Full experience:

- Keyboard
- Mouse
- High-quality graphics

## Mobile

Simplified:

- Touch controls
- Lower DPR
- Reduced shadows/effects
- Smaller UI
- Simplified particles

## Small screens

Portfolio menu must remain immediately accessible.

---

# 47. SEO

Even though the core experience is 3D, the application should include:

```text
Page title
Meta description
Open Graph image
Twitter/X card
Favicon
Semantic fallback content
```

Recommended static content:

```text
Developer name
Role
Short introduction
Selected projects
Contact
```

This also helps when JavaScript/WebGL is unavailable.

---

# 48. Analytics

Optional, privacy-conscious analytics.

Possible events:

```text
world_loaded
tutorial_skipped
project_opened
resume_clicked
github_clicked
contact_clicked
zone_discovered
quest_completed
```

Do not track sensitive personal data.

---

# 49. Testing Strategy

## Unit

Test:

- Input mapping
- State transitions
- Interaction distance
- Quest state
- Data validation

## Integration

Test:

- Player + physics
- Player + camera
- Interaction + UI
- Menu + panels

## Manual

Test:

- Desktop
- Mobile
- Low-end device
- Slow network
- WebGL failure
- Reduced motion

---

# 50. Development Milestones

## Milestone A — Foundation

```text
React
R3F
Three
Rapier
Zustand
Project structure
```

Output:

> Empty but stable 3D application.

---

## Milestone B — Playable World

```text
map.glb
cool_man.glb
physics
movement
camera
animation
```

Output:

> Visitor can walk around the world.

---

## Milestone C — Portfolio MVP

```text
interaction
About
Projects
Skills
Experience
Contact
HUD
Menu
Loading
Tutorial
```

Output:

> Fully usable 3D portfolio.

---

## Milestone D — Mobile MVP

```text
joystick
touch camera
mobile UI
quality scaling
```

Output:

> Portfolio works on phones.

---

## Milestone E — Polish

```text
lighting
materials
animation
camera
audio
UI
performance
accessibility
```

Output:

> Premium-quality portfolio website.

---

## Milestone F — Premium Game

```text
quests
NPC
achievements
secrets
terminals
cinematics
dynamic world
controller
```

Output:

> Portfolio becomes a small playable game.

---

# 51. Recommended Build Order

Strict order:

```text
01. Project setup
02. R3F canvas
03. map.glb
04. Lighting
05. Physics
06. cool_man.glb
07. Input
08. Movement
09. Animation
10. Third-person camera
11. Interaction system
12. About
13. Projects
14. Skills
15. Experience
16. Contact
17. HUD
18. Menu
19. Loading
20. Tutorial
21. Mobile controls
22. WebGL fallback
23. Performance optimization
24. Visual polish
25. Audio
26. Accessibility
27. Quest system
28. NPC
29. Achievements
30. Secrets
31. Cinematics
32. Controller
33. Final QA
34. Production deployment
```

---

# 52. MVP Definition of Done

MVP must satisfy:

```text
FUNCTIONAL
✓ 3D world loads
✓ Character loads
✓ Movement works
✓ Jump works
✓ Run works
✓ Collision works
✓ Camera works
✓ Animation works
✓ Interaction works

PORTFOLIO
✓ About
✓ Projects
✓ Skills
✓ Experience
✓ Contact
✓ Resume
✓ External links

UX
✓ Loading screen
✓ Tutorial
✓ HUD
✓ Menu
✓ Mobile controls
✓ WebGL fallback

TECHNICAL
✓ TypeScript builds
✓ No critical console errors
✓ Production build succeeds
✓ Assets load reliably
```

---

# 53. Polish Definition of Done

```text
✓ High-quality lighting
✓ Better materials
✓ Smooth animation blending
✓ Better camera
✓ Interaction feedback
✓ Audio
✓ Responsive UI
✓ Mobile optimization
✓ Quality profiles
✓ Reduced motion
✓ Performance optimization
✓ Fast navigation
✓ Error handling
```

---

# 54. Premium Definition of Done

```text
✓ Quest system
✓ Progress tracking
✓ Achievements
✓ NPC
✓ Interactive terminals
✓ Hidden areas
✓ Cinematic moments
✓ Dynamic environment
✓ Optional weather
✓ Optional controller
✓ Optional mini-games
✓ Optional save progress
```

---

# 55. Scope Control

The following should NOT block MVP:

```text
Advanced NPCs
Quest system
Weather
Day/night
Multiplayer
Mini-games
Complex shaders
Large open-world mechanics
Inventory system
Combat
```

If a feature does not improve portfolio discovery, it should be considered optional until the core portfolio is complete.

---

# 56. Final Experience

## MVP

```text
       3D PORTFOLIO
             |
       Explore World
             |
     +-------+-------+
     |       |       |
    ABOUT PROJECTS SKILLS
     |       |       |
     +-------+-------+
             |
         EXPERIENCE
             |
          CONTACT
```

## Polish

```text
       PREMIUM WORLD
             |
      Smooth Movement
             |
       Cinematic UI
             |
       Audio + FX
             |
     Beautiful Environment
             |
      Fast Portfolio UX
```

## Premium Game

```text
             WORLD
               |
       +-------+-------+
       |       |       |
      NPC    QUESTS  TERMINALS
       |       |       |
       +-------+-------+
               |
        EXPLORATION
               |
       +-------+-------+
       |       |       |
   SECRETS  ACHIEVEMENTS
       |       |
       +-------+
               |
        PORTFOLIO
```

---

# 57. Product Success Criteria

The final product should achieve three things simultaneously:

### 1. Memorable

Visitor should remember the portfolio because of the interactive 3D experience.

### 2. Useful

Visitor should quickly understand:

- Who the developer is
- What they build
- What technologies they use
- Which projects they have completed
- How to contact them

### 3. Performant

The experience should remain usable on normal mobile and desktop hardware.

---

# 58. Final Product Principle

> **Don't build a game that happens to contain a portfolio. Build a portfolio that happens to feel like a game.**

The MVP establishes the portfolio.

The Polish phase establishes the quality.

The Premium Game phase establishes the memorable experience.

All three phases must preserve fast access to the actual portfolio information.

---

# 59. Final Roadmap

```text
                    3D PORTFOLIO
                         |
              ┌──────────┴──────────┐
              |                     |
             MVP                  FOUNDATION
              |                     |
       Playable Portfolio     React + R3F + Rapier
              |
              ↓
           POLISH
              |
      ┌───────┼────────┐
      |       |        |
   Visual    UX      Performance
      |       |        |
      └───────┼────────┘
              |
              ↓
        PREMIUM GAME
              |
     ┌────────┼─────────┐
     |        |         |
   Quests    NPCs     Secrets
     |        |         |
  Achievements       Cinematics
              |
              ↓
       FINAL EXPERIENCE
              |
      Portfolio + Game
```

**End of PRD**
