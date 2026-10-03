export interface Project {
  id: string;
  title: string;
  category: 'Enterprise Fullstack' | 'Mobile & Realtime' | 'AI & Protocol' | 'Robotics & Hardware';
  year: string;
  subtitle: string;
  summary: string;
  description: string;
  bulletPoints: string[];
  techStack: string[];
  metrics: string[];
  github?: string;
  live?: string;
  featured: boolean;
  color: string;
  icon: string;
}

export const projectsData: Project[] = [
  {
    id: "gravityeats",
    title: "GravityEats",
    category: "Enterprise Fullstack",
    year: "2025 – Present",
    subtitle: "Multi-Platform Enterprise Food Delivery Ecosystem (Bangladesh)",
    summary: "Built an enterprise multi-platform food delivery ecosystem powered by NestJS, Kotlin Android Multi-Module, and Next.js 16 across Customer, Rider, Merchant, and Admin roles.",
    description: "GravityEats is a production-grade multi-platform food delivery ecosystem engineered to handle high-concurrency order workflows, real-time dispatch, and audited financial ledgers. Built with a modular microservices architecture utilizing Kafka event streaming, KEDA autoscaled Kubernetes pods, and pessimistic locking for guaranteed zero double-payouts in cash-on-delivery transactions.",
    bulletPoints: [
      "Engineered an audited financial ledger & COD cash reconciliation system using TypeORM pessimistic locking and idempotent transactions, eliminating payout fraud.",
      "Architected a native Kotlin Android platform (:app-customer, :app-rider, :app-merchant, :shared) using Jetpack Compose, Hilt, Room, and WorkManager with Mapbox turn-by-turn navigation and offline-first data sync.",
      "Developed real-time order dispatch & telemetry pipelines leveraging Apache Kafka event streaming, WebSockets, and OneSignal push notifications.",
      "Integrated a custom HMAC-signed mobile crash triage inbox for immediate frontline error reporting.",
      "Containerized and deployed microservices on Kubernetes with KEDA autoscaling, Prometheus/Sentry monitoring, and high unit/integration test coverage with Jest and Android testing tools."
    ],
    techStack: ["Next.js 16", "NestJS", "Kotlin (Android)", "Apache Kafka", "WebSockets", "Kubernetes", "KEDA", "TypeORM", "PostgreSQL", "Mapbox", "Docker", "Sentry"],
    metrics: ["4 Apps in Monorepo", "0 Payout Desync (Pessimistic Locks)", "Sub-second Telemetry", "KEDA Autoscaled"],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: true,
    color: "#ff5722",
    icon: "UtensilsCrossed"
  },
  {
    id: "parentra",
    title: "Parentra",
    category: "Mobile & Realtime",
    year: "2026 – Present",
    subtitle: "Real-Time Parental Control & Child Safety Suite",
    summary: "Dual native Android apps and high-performance React dashboard with Go/Fiber backend, WebRTC live camera/audio streaming, and geofencing.",
    description: "Parentra provides modern parents with immediate, low-latency peace of mind. Consists of child and parent native Android apps paired with a responsive React supervisory dashboard, featuring live camera and microphone streaming via WebRTC (LiveKit), geofence alerts, and Android Device Admin protection against unauthorized app uninstallation.",
    bulletPoints: [
      "Developed dual native Android apps (Kotlin) and a responsive React supervisory dashboard backed by a high-throughput Go/Fiber & PostgreSQL backend.",
      "Implemented live WebRTC camera and audio streaming using LiveKit, alongside real-time WebSocket events for instant geofence entry/exit alerts and telemetry.",
      "Enforced strict device security via Android Device Admin policy, background permission health monitoring, and anti-uninstall PIN enforcement.",
      "Engineered rich cross-platform chat supporting media uploads, dynamic emoji reactions, Cloudinary media storage, and Glide disk caching."
    ],
    techStack: ["Kotlin", "Jetpack Compose", "Go (Fiber)", "React", "LiveKit (WebRTC)", "WebSockets", "PostgreSQL", "Cloudinary", "Android Device Admin"],
    metrics: ["Sub-150ms WebRTC Stream", "Dual Native Apps", "Android Device Admin Enforced", "Real-Time Geofencing"],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: true,
    color: "#00d2ff",
    icon: "ShieldAlert"
  },
  {
    id: "cradle-care",
    title: "Cradle & Care",
    category: "Enterprise Fullstack",
    year: "2026",
    subtitle: "High-Performance Headless E-Commerce Platform",
    summary: "Built with Next.js 15, MedusaJS, PostgreSQL, and Redis, achieving a 9.0/10 production-readiness audit rating.",
    description: "An enterprise-grade headless digital commerce architecture designed for maternal and infant care goods. Features custom FEFO (First-Expired, First-Out) inventory batch management, lightning-fast instant search powered by Meilisearch, and military-grade web security with CSP nonces and 236 granular RBAC access control policies.",
    bulletPoints: [
      "Designed a custom FEFO inventory module with PostgreSQL row-level locking (SELECT FOR UPDATE) to prevent overselling and track perishable product expiry batches.",
      "Implemented instant search via Meilisearch delivering results under 250ms with typo tolerance and faceting.",
      "Deployed 6-zone Redis rate-limiting, per-request Content Security Policy nonces, and 236 RBAC access control policies across administrative roles.",
      "Audited and achieved a verified 9.0/10 production-readiness rating."
    ],
    techStack: ["Next.js 15", "MedusaJS", "PostgreSQL", "Redis", "Meilisearch", "Tailwind CSS", "TypeScript", "Docker"],
    metrics: ["9.0/10 Readiness Score", "<250ms Search Latency", "236 RBAC Policies", "Row-Level FEFO Locks"],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: true,
    color: "#10b981",
    icon: "ShoppingBag"
  },
  {
    id: "waypoint-mcp",
    title: "Waypoint Challenge : IEP MCP Server",
    category: "AI & Protocol",
    year: "2026",
    subtitle: "AI Model Context Protocol Server for Special Education Teachers",
    summary: "TypeScript MCP server reducing special education lesson planning from hours to minutes. Winner of Hacker News open challenge with direct CEO interview invite.",
    description: "Engineered an AI Model Context Protocol (MCP) server adhering to Anthropic's MCP specification. Empowers special education educators by automating Individualized Education Program (IEP) grounded modifications with strict legal compliance.",
    bulletPoints: [
      "Selected from an open competition on Hacker News; received direct interview invitation from Waypoint Founder & CEO.",
      "Designed a disability profile knowledge base covering 9 categories with a comorbidity resolver that detects and reconciles conflicts between multiple diagnoses.",
      "Enforced strict legal distinction between accommodations and modifications (IDEA compliance), citing exact IEP source tags (ACC-1, MOD-2) on every recommendation.",
      "Shipped 17 discrete tools including progress tracking, parent report generation, SMART goal recommendations, and differentiated lesson materials with SQLite persistence and 24 passing automated tests."
    ],
    techStack: ["TypeScript", "Model Context Protocol (MCP)", "Node.js", "SQLite", "Jest", "Claude AI API"],
    metrics: ["17 MCP Tools", "9 Disability Profiles", "100% IDEA Compliance", "24 Passing Tests"],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: true,
    color: "#8b5cf6",
    icon: "BrainCircuit"
  },
  {
    id: "easymess",
    title: "EasyMess",
    category: "Mobile & Realtime",
    year: "2026",
    subtitle: "Automated Bachelor Mess & Meal Expense Tracker",
    summary: "Native Android app with Material 3, Jetpack Compose, and Cloud Firestore computing real-time live meal rates, member balances, and bazaar requests.",
    description: "A specialized financial management application crafted for students and bachelor flatmates in Bangladesh. Eliminates the friction of manual paper calculations through reactive real-time database sync and automated meal accounting.",
    bulletPoints: [
      "Developed a native Android app in Kotlin using Jetpack Compose with Material 3 UI design principles.",
      "Built an automated financial & meal-rate calculation engine powered by Cloud Firestore, computing live meal rates (Total Expense / Total Meals) and individual member balances on every update.",
      "Designed a role-based access framework (Manager vs. Member) featuring instant mess onboarding via unique Bind Codes and an interactive Bazar Request approval workflow.",
      "Shipped a dynamic dual-language localization system (Bangla & English) alongside interactive monthly calendar views, dark/light themes, and real-time group chat."
    ],
    techStack: ["Kotlin", "Jetpack Compose", "Material 3", "Cloud Firestore", "Firebase Auth", "Coroutines & Flow"],
    metrics: ["Live Meal Rate Engine", "Bangla & English Localization", "Unique Bind Codes", "Real-Time Group Chat"],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: false,
    color: "#f59e0b",
    icon: "Calculator"
  },
  {
    id: "line-follower-robot",
    title: "Autonomous Line Follower Robot (LFR)",
    category: "Robotics & Hardware",
    year: "2025",
    subtitle: "District Science Fair Demonstration",
    summary: "Autonomous navigation robot using Arduino microcontroller, IR reflectance sensor array, and high-current L298N H-bridge motor driver.",
    description: "Designed, wired, and programmed an autonomous ground vehicle capable of high-speed path tracking along complex black-and-white grid courses at the District Science Fair.",
    bulletPoints: [
      "Assembled and calibrated an array of infrared reflectance sensors to detect surface contrast differences with microsecond response times.",
      "Implemented a PID-inspired differential motor control algorithm on an ATmega328P Arduino microcontroller.",
      "Interfaced an L298N dual H-bridge motor driver to regulate DC motor torque and PWM velocity during sharp angular turns."
    ],
    techStack: ["Arduino / C++", "ATmega328P", "IR Sensor Array", "L298N Motor Driver", "Hardware Calibration"],
    metrics: ["Microsecond Sensor Loop", "Autonomous Path Tracking", "Science Fair Awardee"],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: false,
    color: "#ec4899",
    icon: "Bot"
  }
];
