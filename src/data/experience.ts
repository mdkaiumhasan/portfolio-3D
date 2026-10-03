export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  type: 'Work Experience' | 'Education' | 'Certification';
  description: string;
  highlights: string[];
  skills: string[];
  credentialId?: string;
}

export const experienceData: ExperienceItem[] = [
  {
    id: "fnf-online",
    role: "Network Support Engineer",
    organization: "FNF Online (Internet Service Provider)",
    location: "Hazaribagh, Dhaka, Bangladesh",
    period: "Jan 2026 – Present",
    type: "Work Experience",
    description: "Hands-on ISP field operations engineering, core routing, optical distribution network management, and subscriber bandwidth administration.",
    highlights: [
      "Configure and maintain high-capacity MikroTik core routers, distribution switches, and GPON OLT devices for last-mile and network-wide fiber connectivity.",
      "Manage dynamic bandwidth allocation, PPPoE queues, and QoS profiles across enterprise client accounts and downstream reseller connections.",
      "Diagnose and rapidly mitigate network downtime, routing bottlenecks, and fiber attenuation to ensure 99.9% service availability.",
      "Coordinate technical support for reseller accounts, onboarding new fiber nodes and managing onward service delivery."
    ],
    skills: ["MikroTik RouterOS", "GPON OLT/ONU", "PPPoE", "Bandwidth Management", "VLAN", "Network Triage", "Cisco IOS"]
  },
  {
    id: "independent-dev",
    role: "Independent Fullstack & Systems Developer",
    organization: "Self-Employed / Remote Collaborations",
    location: "Dhaka, Bangladesh (Remote)",
    period: "2025 – Present",
    type: "Work Experience",
    description: "Engineering production-grade web applications, distributed backend services, native Android mobile apps, and protocol servers.",
    highlights: [
      "Engineered GravityEats food delivery ecosystem with NestJS microservices, Kafka event streaming, and KEDA-autoscaled Kubernetes pods.",
      "Constructed Parentra child safety suite featuring LiveKit WebRTC real-time audio/video streaming and Android Device Admin policy enforcement.",
      "Developed high-performance headless digital commerce platforms (Cradle & Care) with MedusaJS, Redis caching, and Meilisearch (<250ms latency).",
      "Created the Waypoint Challenge IEP MCP server, reducing special education lesson modification from hours to minutes."
    ],
    skills: ["React", "Next.js", "TypeScript", "Kotlin", "Go", "Kafka", "Kubernetes", "PostgreSQL", "MCP"]
  },
  {
    id: "ccna-cert",
    role: "CCNA 200-301 (Cisco Certified Network Associate)",
    organization: "Cisco Systems",
    location: "Global Certification",
    period: "Completed",
    type: "Certification",
    description: "Comprehensive enterprise networking certification covering IP routing protocols (OSPF), switching (STP/VLANs), IP services (NAT/DHCP/NTP), network security, and network automation fundamentals.",
    highlights: [
      "Network Fundamentals: Routers, switches, cabling, IPv4/IPv6 subnetting.",
      "Network Access: VLANs, trunking, EtherChannel, Spanning Tree Protocol (STP).",
      "IP Connectivity: OSPFv2, static routing, default routing.",
      "Security Fundamentals: Access Control Lists (ACLs), Port Security, DHCP snooping."
    ],
    skills: ["Cisco IOS", "OSPF", "VLANs", "STP", "ACLs", "IPv4/IPv6", "EtherChannel"]
  },
  {
    id: "mikrotik-cert",
    role: "MikroTik Certified Training",
    organization: "MikroTik Academy",
    location: "Dhaka, Bangladesh",
    period: "Completed",
    type: "Certification",
    description: "Hands-on RouterOS administration covering firewall filters, NAT rules, MTCNA concepts, queue trees, hotspot gateways, and wireless/wireline bridge configurations.",
    highlights: [
      "Advanced firewall packet flow filtering, address lists, and mangle marking.",
      "Bandwidth management via PCQ, simple queues, and hierarchical queue trees.",
      "PPPoE server configuration, user profiles, and RADIUS billing integration."
    ],
    skills: ["RouterOS", "Firewall Mangle", "PCQ Queuing", "PPPoE Server", "Hotspot"]
  },
  {
    id: "redhat-cert",
    role: "Red Hat Linux Server Administration",
    organization: "Red Hat Training Program",
    location: "Dhaka, Bangladesh",
    period: "Completed",
    type: "Certification",
    description: "Linux system administration, SELinux policies, systemd services, SSH key hardening, storage management (LVM), and network interface bonding.",
    highlights: [
      "Managing file systems, permissions, access control lists (ACLs), and LVM partitions.",
      "Configuring network services, firewalld, SELinux enforcement, and automated cron jobs.",
      "Deploying and securing web servers, SSH daemons, and system logs with journald."
    ],
    skills: ["Red Hat Enterprise Linux", "SELinux", "systemd", "firewalld", "Bash Scripting", "LVM"]
  },
  {
    id: "peoplentech-diploma",
    role: "Post Graduate Diploma in Network System Administration",
    organization: "PeopleNTech Institute of IT",
    location: "Dhaka, Bangladesh",
    period: "Completed",
    type: "Certification",
    description: "In-depth professional diploma in corporate enterprise networking, Windows Server Active Directory Domain Services, and network disaster recovery.",
    highlights: [
      "Windows Server Active Directory, Group Policy Objects (GPO), DNS, and DHCP configuration.",
      "Enterprise LAN design, switch redundancy, and security vulnerability patching.",
      "Network performance monitoring and automated incident alerting."
    ],
    skills: ["Windows Server", "Active Directory", "Group Policy", "DNS/DHCP", "Enterprise LAN"]
  },
  {
    id: "bsc-edu",
    role: "Bachelor of Science in Computer Science & Engineering (B.Sc CSE)",
    organization: "Northern University Bangladesh",
    location: "Dhaka, Bangladesh",
    period: "In Progress",
    type: "Education",
    description: "Undergraduate degree focusing on software engineering principles, distributed systems, operating system design, cryptography, and compiler theory.",
    highlights: [
      "Deepening theory in advanced algorithms, computational complexity, and network security protocols.",
      "Leading collaborative team software engineering capstone modules."
    ],
    skills: ["Distributed Computing", "Software Engineering", "Algorithms", "Operating Systems"]
  },
  {
    id: "polytechnic-edu",
    role: "Diploma in Engineering (Computer Science & Technology)",
    organization: "Mymensingh Polytechnic Institute",
    location: "Mymensingh, Bangladesh",
    period: "Completed 2026",
    type: "Education",
    description: "Four-year comprehensive engineering diploma in computer science, system hardware, microcontrollers, database systems, and networking.",
    highlights: [
      "Built and presented an autonomous Line Follower Robot (LFR) at the District Science Fair.",
      "Rigorous coursework in C/C++, Java, computer architecture, database management, and electronics."
    ],
    skills: ["C/C++", "Data Structures", "Computer Architecture", "Microcontrollers", "Networking"]
  }
];
