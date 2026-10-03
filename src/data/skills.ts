export interface SkillGroup {
  id: string;
  category: string;
  description: string;
  icon: string;
  skills: Array<{
    name: string;
    level: 'Expert' | 'Advanced' | 'Proficient';
    tag?: string;
  }>;
}

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    category: "Frontend & 3D Interactive",
    description: "Modern, dynamic, accessible user interfaces with clean architecture and WebGL graphics.",
    icon: "Layout",
    skills: [
      { name: "React / React 19", level: "Expert", tag: "Core" },
      { name: "Next.js 15 & 16 (App Router)", level: "Expert", tag: "SSR/SSG" },
      { name: "TypeScript", level: "Expert", tag: "Strict Mode" },
      { name: "Three.js & React Three Fiber (R3F)", level: "Advanced", tag: "3D Graphics" },
      { name: "JavaScript (ES6+)", level: "Expert" },
      { name: "HTML5 & Modern CSS3", level: "Expert" },
      { name: "Tailwind CSS & Vanilla CSS", level: "Expert" },
      { name: "Motion & UI Animations", level: "Advanced" }
    ]
  },
  {
    id: "backend",
    category: "Backend & Distributed Systems",
    description: "High-throughput APIs, pessimistic database concurrency, and event-driven architecture.",
    icon: "Server",
    skills: [
      { name: "Node.js & NestJS", level: "Expert", tag: "Enterprise" },
      { name: "Go (Golang) / Fiber", level: "Advanced", tag: "High Concurrency" },
      { name: "Python / FastAPI", level: "Proficient" },
      { name: "PostgreSQL & Row-Level Locking", level: "Expert", tag: "ACID" },
      { name: "TypeORM & Prisma", level: "Advanced" },
      { name: "Redis (Caching, Rate-limiting)", level: "Advanced", tag: "Sub-ms" },
      { name: "Cloud Firestore & SQLite", level: "Advanced" },
      { name: "RESTful APIs & GraphQL", level: "Expert" }
    ]
  },
  {
    id: "mobile-realtime",
    category: "Mobile & Real-Time Telemetry",
    description: "Native Android applications, peer-to-peer WebRTC video/audio, and message streaming.",
    icon: "Smartphone",
    skills: [
      { name: "Native Android (Kotlin)", level: "Expert", tag: "Native" },
      { name: "Jetpack Compose & Material 3", level: "Expert" },
      { name: "Android Architecture (Hilt, Room, WorkManager)", level: "Expert" },
      { name: "Android Device Admin Security", level: "Advanced" },
      { name: "LiveKit / WebRTC (Live Stream)", level: "Advanced", tag: "P2P" },
      { name: "WebSockets & Event-Driven IPC", level: "Expert" },
      { name: "Apache Kafka Event Streaming", level: "Advanced", tag: "Telemetry" }
    ]
  },
  {
    id: "networking",
    category: "Network Engineering & ISP Infra",
    description: "CCNA-certified routing, switching, ISP last-mile provisioning, and Linux server orchestration.",
    icon: "Network",
    skills: [
      { name: "MikroTik RouterOS Configuration", level: "Expert", tag: "ISP" },
      { name: "CCNA 200-301 (Routing & Switching)", level: "Expert", tag: "Certified" },
      { name: "GPON OLT / ONU Configuration", level: "Advanced", tag: "Fiber" },
      { name: "Red Hat Enterprise Linux (RHEL)", level: "Advanced", tag: "SysAdmin" },
      { name: "Windows Server Administration", level: "Advanced" },
      { name: "PPPoE Server & Bandwidth Shaping", level: "Expert" },
      { name: "VLAN Segmentation & Firewalling", level: "Advanced", tag: "Security" },
      { name: "LAN / WAN Architecture & Triage", level: "Expert" }
    ]
  },
  {
    id: "cloud-devops",
    category: "DevOps & Cloud Orchestration",
    description: "Containerization, auto-scaling clusters, CI/CD automation, and production observability.",
    icon: "Cloud",
    skills: [
      { name: "Docker & Containerization", level: "Advanced" },
      { name: "Kubernetes (K8s) & KEDA Autoscaling", level: "Advanced", tag: "Production" },
      { name: "GitHub Actions CI/CD", level: "Advanced" },
      { name: "Prometheus & Sentry Observability", level: "Advanced" },
      { name: "Vercel / Render / Supabase", level: "Expert" }
    ]
  },
  {
    id: "ai-tooling",
    category: "AI Protocol & Agentic Tooling",
    description: "Building autonomous tool-use protocols and leveraging state-of-the-art AI pair programming.",
    icon: "Sparkles",
    skills: [
      { name: "Model Context Protocol (MCP)", level: "Expert", tag: "Anthropic MCP" },
      { name: "Claude AI & Anthropic API", level: "Expert" },
      { name: "Antigravity & Cursor Workflow", level: "Expert" },
      { name: "Structured Prompt Engineering", level: "Expert" },
      { name: "Git & Collaborative Workflows", level: "Expert" }
    ]
  }
];
