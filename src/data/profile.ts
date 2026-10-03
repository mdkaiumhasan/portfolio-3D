export interface ProfileData {
  name: string;
  titles: string[];
  bio: string;
  shortBio: string;
  email: string;
  phone: string;
  location: string;
  openToRemote: boolean;
  github: string;
  linkedin: string;
  portfolio: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    status: 'Completed' | 'In Progress';
    details: string;
  }>;
  stats: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  resumes: {
    softwareDev: {
      title: string;
      fileName: string;
      url: string;
      description: string;
    };
    networkEng: {
      title: string;
      fileName: string;
      url: string;
      description: string;
    };
  };
}

export const profileData: ProfileData = {
  name: "MD. Kaium Hasan",
  titles: [
    "Fullstack & Systems Developer",
    "Certified Network Support Engineer (CCNA)",
    "Distributed Systems & Cloud Engineer"
  ],
  shortBio: "Building high-throughput fullstack platforms & robust network infrastructures. 2+ years shipping production React, Next.js, Kotlin, Go, and MikroTik/CCNA networks.",
  bio: "Fullstack developer with 2+ years of hands-on experience building production React, Next.js, and TypeScript applications across food-delivery, child-safety, and content-automation platforms. Comfortable owning features end-to-end — states, edge cases, and performance, not just the happy path — while pairing REST/GraphQL data layers with clean, accessible UI. CCNA (200-301) certified with deep hands-on ISP field experience in MikroTik router/switch/OLT configuration, bandwidth management, and Linux server administration. Daily user of AI-assisted tooling (Claude, Cursor, Antigravity, MCP) to build faster without cutting corners.",
  email: "mdkaiumhasan2005@gmail.com",
  phone: "+880 1560-014339",
  location: "Dhanmondi 32, Dhaka, Bangladesh",
  openToRemote: true,
  github: "https://github.com/mdkaiumhasan",
  linkedin: "https://linkedin.com/in/md-kaium-hasan",
  portfolio: "https://www.mdkaiumhasan.site",
  twitter: "https://x.com/mdkaium2005?s=11",
  instagram: "https://www.instagram.com/kafi_ahmed2.0?igsh=NTZkdmR5ODFlaWto",
  facebook: "https://www.facebook.com/share/16NRG5WKLP/?mibextid=wwXIfr",
  education: [
    {
      degree: "Bachelor of Science (B.Sc.) in Computer Science & Engineering",
      institution: "Northern University Bangladesh",
      period: "Present",
      status: "In Progress",
      details: "Focus on Distributed Systems, Network Security, Database Architecture, and Advanced Software Engineering."
    },
    {
      degree: "Diploma in Engineering (Computer Science & Technology)",
      institution: "Mymensingh Polytechnic Institute",
      period: "Graduated 2026",
      status: "Completed",
      details: "Comprehensive foundation in computer networking, data structures, algorithms, microprocessor hardware, and systems programming."
    }
  ],
  stats: [
    { label: "Production Experience", value: "2+ Yrs", detail: "Shipping web, mobile & distributed systems" },
    { label: "Certification", value: "CCNA", detail: "Cisco Certified Network Associate (200-301)" },
    { label: "Enterprise Projects", value: "6+", detail: "Fullstack, mobile, IoT & protocol servers" },
    { label: "RBAC Security", value: "236+", detail: "Role-based policies enforced in production" }
  ],
  resumes: {
    softwareDev: {
      title: "Fullstack Developer Resume",
      fileName: "software developer Resume.pdf",
      url: "/software developer Resume.pdf",
      description: "Focus on React, Next.js, TypeScript, Go/Fiber, Kotlin Android, Kafka, and Kubernetes."
    },
    networkEng: {
      title: "Network Engineer Resume",
      fileName: "Networking Resume.pdf",
      url: "/Networking Resume.pdf",
      description: "Focus on CCNA (200-301), MikroTik RouterOS, GPON OLT/ONU, Red Hat Linux, and ISP operations."
    }
  }
};
