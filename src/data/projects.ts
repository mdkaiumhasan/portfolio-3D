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
  imageUrl?: string;
  gallery?: string[];
  featured: boolean;
  color: string;
  icon: string;
}

export const projectsData: Project[] = [
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
  },
  {
    id: "enterprise-network",
    title: "Enterprise Trading Network",
    category: "AI & Protocol",
    year: "2025",
    subtitle: "High-Availability 600-Staff Trading Floor Network Infrastructure",
    summary: "Designed a multi-tier redundant network topology for a 600-staff financial trading floor with OSPF dynamic routing, 802.1Q VLAN segmentation, NAT/PAT, and stateful ACL security.",
    description: "Engineered a fault-tolerant campus and trading floor enterprise network infrastructure for 600 financial operators. Utilized multi-area OSPF for rapid sub-second convergence, strict VLAN isolation between management, trading, and guest traffic, and robust access control lists (ACLs) to mitigate unauthorized lateral movement.",
    bulletPoints: [
      "Architected core, distribution, and access layer hierarchy ensuring 99.99% uptime with redundant failover links.",
      "Configured multi-area OSPF routing, route summarization, and passive interface security across multi-site routers.",
      "Implemented 802.1Q VLAN trunking, inter-VLAN routing, and DHCP snooping with port security against ARP spoofing.",
      "Deployed NAT overload (PAT) pools and stateful firewall ACL rules enforcing least-privilege packet filtering."
    ],
    techStack: ["Cisco IOS", "OSPF", "VLAN / 802.1Q", "NAT / PAT", "ACL Security", "DHCP Snooping", "GNS3 / Packet Tracer"],
    metrics: ["600 Active Hosts", "Sub-second OSPF Failover", "Zero Route Leaks", "Strict Tier-1 ACLs"],
    imageUrl: "https://i.ibb.co.com/7tXff9kw/Screenshot-2025-12-31-193032.png",
    gallery: [
      "https://i.ibb.co.com/7tXff9kw/Screenshot-2025-12-31-193032.png",
      "https://i.ibb.co.com/JRY977Rk/Screenshot-2026-01-04-235907.png",
      "https://i.ibb.co.com/jmy2C5v/Screenshot-2026-01-04-232855.png",
      "https://i.ibb.co.com/bg3rbzrm/Screenshot-2026-01-04-232916.png"
    ],
    github: "https://github.com/mdkaiumhasan",
    live: "https://www.mdkaiumhasan.site",
    featured: true,
    color: "#10b981",
    icon: "Network"
  },
  {
    id: "ramadan-journey",
    title: "Ramadan Journey",
    category: "Mobile & Realtime",
    year: "2025",
    subtitle: "Real-Time Prayer & Fasting Companion Mobile Suite",
    summary: "Cross-platform mobile companion app built with React & Android Studio providing accurate prayer time computation, Sehri/Iftar alarms, and offline Islamic utilities.",
    description: "Ramadan Journey is a dedicated Islamic utility mobile application designed to keep users connected to prayer and daily fasting schedules with real-time prayer calculations, persistent notifications, and offline calendar utilities.",
    bulletPoints: [
      "Built native Android mobile package with background alarm managers for precise Fajr, Maghrib, and Sehri timing alerts.",
      "Engineered an offline-first prayer calculation engine based on astronomical coordinates with zero external API dependencies.",
      "Packaged and published installable APK and distribution bundles with automated notification services."
    ],
    techStack: ["React.js", "Android Studio", "Kotlin", "Local Notifications", "Offline SQLite"],
    metrics: ["100% Offline Accuracy", "Persistent Push Alarms", "Direct APK Distribution"],
    imageUrl: "https://files.catbox.moe/bcktxt.png",
    github: "https://github.com/mdkaiumhasan",
    live: "https://files.catbox.moe/b5bgv1.apk",
    featured: false,
    color: "#06b6d4",
    icon: "Clock"
  }
];
