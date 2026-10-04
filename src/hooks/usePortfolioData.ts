import { useState, useEffect } from 'react';

export interface StatItem {
  heading: string;
  description: string;
}

export interface SkillItem {
  name: string;
  percent: number;
}

export interface ActivityItem {
  title: string;
  description: string;
  imageUrl: string;
}

export interface ProjectItem {
  title: string;
  role?: string;
  technology?: string;
  imageUrl?: string;
  shortDesc?: string;
  fullDetails?: string;
  live?: string;
  github?: string;
  year?: string;
}

export interface ExperienceItem {
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface PostItem {
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  shortDesc: string;
  fullContent?: string;
}

export interface ContactDetailItem {
  type: string;
  value: string;
}

export interface SocialLinkItem {
  platform: string;
  url: string;
}

export interface PortfolioData {
  home_heading?: string;
  home_subheading?: string;
  home_profile_image?: string;
  home_cv_link?: string;
  about_info_heading?: string;
  about_info_text?: string;
  about_cv_link?: string;
  stats?: StatItem[];
  skills?: SkillItem[];
  activities?: ActivityItem[];
  projects?: ProjectItem[];
  experiences?: ExperienceItem[];
  posts?: PostItem[];
  contact_info_heading?: string;
  contact_info_text?: string;
  contact_cv_link?: string;
  contactDetails?: ContactDetailItem[];
  socialLinks?: SocialLinkItem[];
  available_for_work?: boolean;
}

// Fallback baseline data if API is loading or offline
const FALLBACK_DATA: PortfolioData = {
  home_heading: "Hi, I'm {{ACCENT}}MD. Kaium Hasan{{/ACCENT}}. A Network Engineer.",
  home_subheading: "I'm a Network Engineer. I love to build functional and resilient networks. Networks are digital roads for deploying applications like Twitter and google maps etc..",
  home_profile_image: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg",
  home_cv_link: "https://files.catbox.moe/0juxap.pdf",
  about_info_heading: "INFORMATION ABOUT ME",
  about_info_text: "I am a highly motivated, skilled and qualified Network Engineer with over 1 years commercial experience working within various private sector and public sector fast paced dynamic environments. My experience includes (but not limited to) Design, Security, Wireless, Project and BAU work.",
  about_cv_link: "https://files.catbox.moe/0juxap.pdf",
  available_for_work: true,
  stats: [
    { heading: "CCNA", description: "CISCO CERTIFIED NETWORK ASSOCIATE" },
    { heading: "MIKROTIK", description: "MIKROTIK ROUTER CONFIGURE & MANAGEMENT" },
    { heading: "WINDOWS SERVER", description: "WIDOWS SERVER CONFIGURETION & MANAGEMENT" },
    { heading: "LINUX SERVER", description: "LINUX SERVER CONFIGURETION & MANAGEMENT" },
    { heading: "MTCNA", description: "MIKROTIK CERTIFIED NETWORK ASSOCIATE" },
    { heading: "MTCRE", description: "MIKROTIK CERTIFIED ROUTING ENGINEER" }
  ],
  skills: [
    { name: "ROUTING", percent: 95 },
    { name: "SWITCHING", percent: 95 },
    { name: "CONFIGURE", percent: 90 },
    { name: "FIREWALL", percent: 80 },
    { name: "C++", percent: 75 },
    { name: "PYTHON", percent: 80 }
  ],
  activities: [
    {
      title: "District Science Exhibition - 2024 Project - LFR",
      description: "My Line Follower Robot (LFR) project demonstrates how sensors and automation can guide a robot along a path without human control. Presented at District Science Exhibition 2024.",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035636/portfolio/activities/wh65cwweq8aswishk7cv.webp"
    },
    {
      title: "Cultural Day Football Tournament-2025",
      description: "Participated as captain in the Cultural Day football tournament at our office. Guided my team to the semi-finals, showcasing sportsmanship, coordination, and leadership.",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035638/portfolio/activities/wgly8kbx4dcj3jdxzwod.jpg"
    }
  ],
  projects: [
    {
      title: "GravityEats",
      role: "Lead Fullstack & Mobile Architect",
      technology: "Next.js 16, NestJS, Kotlin Android, Apache Kafka, Kubernetes, PostgreSQL",
      imageUrl: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Multi-platform enterprise food delivery ecosystem across Customer, Rider, Merchant, and Admin roles with Kafka real-time dispatch and audited ledger.",
      fullDetails: "<h3>GravityEats - Multi-Platform Food Delivery Ecosystem</h3><p>Production-grade enterprise food delivery architecture handling high-concurrency order workflows, real-time dispatch, and audited financial ledgers. Built with Kafka event streaming, KEDA autoscaled Kubernetes pods, and pessimistic locking for zero double-payouts in cash-on-delivery transactions.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Parentra",
      role: "Fullstack & Mobile Engineer",
      technology: "Kotlin Android, Go (Fiber), React, LiveKit WebRTC, WebSockets, PostgreSQL, Cloudinary",
      imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Dual native Android apps and high-performance React dashboard with Go backend, sub-150ms WebRTC live camera/audio streaming, and geofencing.",
      fullDetails: "<h3>Parentra - Child Safety & Real-Time Supervisory Suite</h3><p>Parentra provides modern parents with immediate, low-latency peace of mind. Consists of child and parent native Android apps paired with a responsive React supervisory dashboard, featuring live camera and microphone streaming via WebRTC (LiveKit), geofence alerts, and Android Device Admin protection against unauthorized app uninstallation.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Enterprise Trading Network",
      role: "Network Architect & Administrator",
      technology: "Cisco IOS, OSPF, VLAN / 802.1Q, NAT / PAT, Stateful ACLs, DHCP Snooping",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035639/portfolio/projects/i1m0u1m6q1y3b4h8q1w2.png",
      shortDesc: "High-Availability redundant network topology for a 600-staff trading floor with multi-area OSPF routing, 802.1Q VLANs, and stateful ACL security.",
      fullDetails: "<h3>High-Availability 600-Staff Trading Floor Network Infrastructure</h3><p>Engineered a fault-tolerant campus and trading floor enterprise network infrastructure for 600 financial operators. Utilized multi-area OSPF for rapid sub-second convergence, strict VLAN isolation between management, trading, and guest traffic, and robust access control lists (ACLs) to mitigate unauthorized lateral movement.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Mess Management APP (EasyMess)",
      role: "Android & Fullstack Developer",
      technology: "Kotlin, Jetpack Compose, Material 3, Cloud Firestore, Firebase Auth",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035637/portfolio/projects/l3h5n5p8k7s1j3x4m8r2.jpg",
      shortDesc: "Automated bachelor mess & meal expense tracker for Manager and Members with live meal rates, member balances, and bazaar requests.",
      fullDetails: "<h3>EasyMess - Bachelor Mess & Meal Expense Tracker</h3><p>This app is an account management tool for mess Managers & Members. Easily track deposits, expenses, dues, and monthly reports with real-time automatic meal rate computation and bilingual (Bangla & English) localization.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Waypoint Challenge : IEP MCP Server",
      role: "AI & Protocol Engineer",
      technology: "TypeScript, Model Context Protocol (MCP), Node.js, SQLite, Jest, Claude AI API",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      shortDesc: "TypeScript AI Model Context Protocol server for special education lesson planning with 17 discrete tools and 100% IDEA legal compliance.",
      fullDetails: "<h3>Waypoint Challenge : IEP MCP Server</h3><p>Selected from an open competition on Hacker News with direct CEO interview invite. Designed a disability profile knowledge base covering 9 categories with a comorbidity resolver and 17 discrete tools adhering to Anthropic's Model Context Protocol (MCP) standard.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Cradle & Care",
      role: "Fullstack E-Commerce Engineer",
      technology: "Next.js 15, MedusaJS, PostgreSQL, Redis, Meilisearch, Tailwind CSS, Docker",
      imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80",
      shortDesc: "High-performance headless e-commerce platform with custom FEFO inventory management, sub-250ms search, and 236 RBAC policies.",
      fullDetails: "<h3>Cradle & Care - Headless Maternal Care E-Commerce</h3><p>Enterprise digital commerce architecture featuring FEFO (First-Expired, First-Out) inventory batch management with PostgreSQL row-level locks, instant typo-tolerant Meilisearch, and an audited 9.0/10 production-readiness score.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Ramadan Journey",
      role: "Android Developer",
      technology: "React.js, Android Studio, Kotlin, Push Notifications",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035641/portfolio/projects/t9v5x2k4m7p1j3w6s8r4.png",
      shortDesc: "Real-time prayer helper and Islamic companion providing accurate salah reminders, Sahri/Iftar alarms, and offline supplications.",
      fullDetails: "<h3>Ramadan Journey - Real-Time Prayer Helper</h3><p>Using this application you can stay connected with prayer times, accurate Sahri & Iftar countdown alarms, daily Islamic reminders, and offline prayer trackers.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    },
    {
      title: "Autonomous Line Follower Robot (LFR)",
      role: "Hardware & Robotics Engineer",
      technology: "Arduino / C++, ATmega328P, IR Reflectance Sensor Array, L298N Motor Driver",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035636/portfolio/activities/b1c4e7k2m9p3j5w8s0r2.webp",
      shortDesc: "Autonomous navigation robot using microsecond IR reflectance sensors and differential motor control for path tracking at the District Science Fair.",
      fullDetails: "<h3>Autonomous Line Follower Robot (LFR)</h3><p>Designed and wired an autonomous ground vehicle capable of high-speed path tracking along complex black-and-white grid courses. Presented and awarded at the District Science Exhibition 2024.</p>",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan"
    }
  ],
  experiences: [
    {
      title: "SENIOR NETWORK ENGINEER – REGISTERS OF SCOTLAND",
      date: "2019 - PRESENT",
      description: "Covering Network, Parameter Security and Virtualisation.",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035644/portfolio/experiences/oviaxzqzuolf1c9hdbmd.jpg"
    },
    {
      title: "SENIOR NETWORK & SECURITY ENGINEER – FNZ (UK) LTD",
      date: "2018 – 2019",
      description: "Worked closely with Platform team for new networks provisioning, routing and firewall policy management.",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035646/portfolio/experiences/uaz8dts2s2mexbvbkkyb.svg"
    }
  ],
  contactDetails: [
    { type: "Location", value: "Dhanmondi 27, Dhaka" },
    { type: "Email", value: "mdkaiumhasan2005@gmail.com" },
    { type: "Contact Number", value: "+880 1560-014339" },
    { type: "Languages", value: "Bangla, English, Hindi" }
  ],
  socialLinks: [
    { platform: "twitter", url: "https://x.com/mdkaium2005?s=11" },
    { platform: "instagram", url: "https://www.instagram.com/kafi_ahmed2.0?igsh=NTZkdmR5ODFlaWto" },
    { platform: "facebook", url: "https://www.facebook.com/share/16NRG5WKLP/?mibextid=wwXIfr" },
    { platform: "Linkedin", url: "https://www.linkedin.com/in/md-kaium-hasan-bb6009372/" },
    { platform: "github", url: "https://github.com/mdkaiumhasan" }
  ],
  posts: [
    {
      title: "Access Control List (ACL) – সম্পূর্ণ গাইড",
      date: "Oct 26, 2025",
      category: "Networking Guide",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg",
      shortDesc: "Access Control List (ACL) হলো এমন এক সেট নেটওয়ার্ক রুলস যা দিয়ে আমরা রাউটার বা সুইচের মাধ্যমে ডাটা ট্রাফিক নিয়ন্ত্রণ করি। Cisco Packet Tracer এ বাস্তব কনফিগারেশন গাইড।",
      fullContent: `<h1>Access Control List (ACL) – সম্পূর্ণ গাইড</h1>

<p><b>Access Control List (ACL)</b> হলো এমন এক সেট নেটওয়ার্ক রুলস যা দিয়ে আমরা রাউটার বা সুইচের মাধ্যমে ডাটা ট্রাফিক নিয়ন্ত্রণ করি। সহজভাবে বললে, ACL নির্ধারণ করে কে কাকে অ্যাক্সেস করতে পারবে এবং কে পারবে না।</p>

<h2>🎯 রিয়েল ওয়ার্ল্ড উদাহরণ:</h2>
<p>ধরো একটি অফিসে দুটি বিভাগ আছে — Accounts ও HR। এখন তুমি চাও যেন Accounts বিভাগের কম্পিউটারগুলো শুধু ইন্টারনেট ব্যবহার করতে পারে কিন্তু HR বিভাগের সার্ভারে ঢুকতে না পারে।<br/>
এই কাজটি ACL দিয়ে সহজে করা যায় — নির্দিষ্ট IP রেঞ্জকে “deny” করে দিয়ে, বাকিদের “permit” করা যায়।</p>

<h2>🔍 ACL এর ধরন:</h2>
<ul>
<li><b>Standard ACL:</b> শুধু সোর্স IP ঠিকানার ভিত্তিতে ট্রাফিক নিয়ন্ত্রণ করে (রেন্জ: 1-99 এবং 1300-1999)।</li>
<li><b>Extended ACL:</b> সোর্স, ডেস্টিনেশন, প্রোটোকল এবং পোর্ট — সব কিছুর ভিত্তিতে সূক্ষ্মভাবে নিয়ন্ত্রণ করতে পারে (রেন্জ: 100-199 এবং 2000-2699)।</li>
</ul>

<h2>🧩 Cisco Packet Tracer এ ACL কনফিগারেশন (Zero থেকে):</h2>

<h3>Step 1: Basic Network Setup</h3>
<p>দুটি নেটওয়ার্ক ও রাউটার ইন্টারফেস সেটআপ:</p>
<pre>
Network 1 (Accounts): 192.168.10.0/24  
Network 2 (HR Server): 192.168.20.0/24
Router Interface:
- G0/0 → 192.168.10.1 (Gateway for Net 1)
- G0/1 → 192.168.20.1 (Gateway for Net 2)
</pre>

<h3>Step 2: IP Configuration</h3>
<p>PC এবং রাউটারের ইন্টারফেসে সঠিক IP অ্যাসাইন করুন এবং ইন্টারফেসগুলো <code>no shutdown</code> করুন।</p>

<h3>Step 3: ACL তৈরি (Access Control Rule)</h3>
<p>উদাহরণ: Network 10 থেকে Network 20-এ অ্যাক্সেস ব্লক করা, কিন্তু বাকি সব ইন্টারনেট/অন্যান্য ট্রাফিক সচল রাখা:</p>
<pre>
Router> enable
Router# configure terminal
Router(config)# access-list 10 deny 192.168.10.0 0.0.0.255
Router(config)# access-list 10 permit any
</pre>

<h3>Step 4: ইন্টারফেসে ACL Apply করা</h3>
<p>যে ইন্টারফেসে ফিল্টারিং কার্যকর করতে চান, সেখানে ইনবাউন্ড (in) বা আউটবাউন্ড (out) হিসেবে Apply করুন:</p>
<pre>
Router(config)# interface g0/1
Router(config-if)# ip access-group 10 out
Router(config-if)# exit
Router# end
Router# write memory
</pre>

<h3>Step 5: ভেরিফিকেশন ও টেস্ট</h3>
<p>Accounts PC থেকে HR সার্ভারে ping করে দেখুন — Network 10 থেকে 20 তে ট্রাফিক ব্লক হয়েছে কিনা (Destination Host Unreachable আসা উচিত)।</p>

<h2>🧠 প্র্যাকটিক্যাল টিপস ও বেস্ট প্র্যাকটিস:</h2>
<ul>
<li>ACL সবসময় <b>“Top to Bottom”</b> ক্রমানুসারে এক্সিকিউট হয়। প্রথম ম্যাচ করা রুল কার্যকর হয়।</li>
<li>প্রতিটি ACL-এর শেষে একটি গোপন অদৃশ্য <b>“implicit deny any”</b> থাকে — তাই সব রুলের শেষে স্পেসিফিক অনুমোদন দিতে <code>permit any</code> দিতে ভুলবেন না।</li>
<li>Standard ACL সাধারণত ডেস্টিনেশনের সবচেয়ে কাছাকাছি ইন্টারফেসে এবং Extended ACL সোর্সের সবচেয়ে কাছাকাছি ইন্টারফেসে বসানো সর্বোত্তম।</li>
</ul>`
    },
    {
      title: "CCNA কি? Networking Career-er Sothik Shuruvat",
      date: "Oct 25, 2025",
      category: "Career & Certification",
      imageUrl: "https://files.catbox.moe/pasmm0.jpg",
      shortDesc: "Amra ek digital jogote baas kori, aar ei digital jogoter backbone holo network. CCNA certification holo network engineer hishebe journey shuru korar prothom ebong sobcheye guruttwopurno dhap.",
      fullContent: `<h3>CCNA ki? Networking Career-er Sothik Shuruvat</h3>

<p>Amra ek digital jogote baas kori, aar ei digital jogoter merudondo (backbone) holo network. Facebook, Google, YouTube theke shuru kore apnar office-er printer porjonto—shob kichui network-er opor nirbhorshil.</p>

<p>Jodi apni ei exciting sector-e career gorte chan, tahole network engineer hishebe apnar journey shuru korar prothom, ebong sobcheye guruttwopurno, dhap holo <strong>CCNA certification (Cisco Certified Network Associate)</strong>.</p>

<h3>Keno CCNA Ekhono Eto Guruttwopurno?</h3>

<p>Technology-r jogot onek druto bodle jacche, kintu CCNA-r chahida ekhono opar. Er karon holo eti shudhu "kivabe" (how) noy, eti "keno" (why) shekhay. Ei foundational knowledge apnake complex enterprise network-er somossa samadhan (troubleshooting) korte shaajjo kore.</p>

<p>Job market-e CCNA-r ekta alada mullo ache. Hiring manager-ra ei certificate-ke vishon-vabe pradhanno den, karon eta proman kore je apnar network fundamentals-er opor sposto dharona ache. Eti apnar CV-ke onnoder theke alada kore rakhe.</p>

<img src="https://files.catbox.moe/pasmm0.jpg" alt="CCNA Network Topology & Architecture" style="width:100%; max-width:680px; margin: 20px auto; display: block; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3);" />

<h3>Adhunik CCNA-te (200-301) Notun ki ache?</h3>

<p>Adhunik CCNA (version 200-301) ekhonkar projuktir sathe taal miliye onek updated. Eti shudhu traditional routing/switching-e simaboddho noy. Ekhon er moddhe included ache:</p>

<ul>
<li><strong>Automation & Programmability:</strong> Network automation-er dharona, jemon Python scripting, REST APIs, JSON data encoding, ebong Cisco DNA Center-er sathe porichoy.</li>
<li><strong>Security Fundamentals:</strong> VPNs, wireless security (WPA3), DHCP snooping, Dynamic ARP Inspection (DAI), ebong port security-r mool dharona.</li>
<li><strong>Wireless Networking:</strong> Wi-Fi 6 architecture ebong WLC (Wireless LAN Controller) centralized management concepts.</li>
<li><strong>Cloud Architecture:</strong> On-premise enterprise infrastructure theke hybrid cloud ebong virtualization (Hypervisors, VMs, Containers).</li>
</ul>

<h3>Porishesh</h3>

<p>Jodi apni network engineering-e ekta successful career gorte chan, tobe CCNA holo tar shera shuruvat. Eti apnake shudhu ekta bhalo chakri petei shaajjo korbe na (jemon: Network Engineer, System Admin, NOC Engineer, Network Support), borong apnar poroborti specialization (jemon CCNP, Enterprise Infrastructure, Cyber Security, ba Cloud Networking) er jonno ekta shokto vitti toiri kore debe.</p>`
    },
    {
      title: "Enterprise Trading Network: Fault-Tolerant Campus Topology",
      date: "Nov 15, 2025",
      category: "Network Architecture",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035639/portfolio/projects/i1m0u1m6q1y3b4h8q1w2.png",
      shortDesc: "A deep dive into engineering a high-availability network infrastructure for 600 financial traders using multi-area OSPF, 802.1Q VLAN trunking, and sub-second convergence.",
      fullContent: `<h3>High-Availability 600-Staff Trading Floor Network Infrastructure</h3>

<p>Financial trading environments cannot tolerate network downtime. A 3-second packet delay or failover stall can result in millions in losses. Here is how we engineered a multi-tier fault-tolerant campus and trading floor topology for 600 active operators.</p>

<h3>Core Architectural Pillars:</h3>
<ul>
<li><strong>Multi-Area OSPF:</strong> Structured area hierarchies (Area 0 Backbone + Area 10 Floor Distribution) with route summarization to reduce link-state database (LSDB) size and prevent SPF calculation storms.</li>
<li><strong>Sub-Second BFD (Bidirectional Forwarding Detection):</strong> Coupled with OSPF to achieve 250ms link failure detection and instant convergence to redundant fiber paths.</li>
<li><strong>Strict 802.1Q VLAN Isolation:</strong> Segmenting Trading Terminals, Management VTY, VoIP Phones, and Guest Wi-Fi with isolated broadcast domains and DHCP snooping.</li>
<li><strong>Stateful Edge ACLs & Port Security:</strong> Sticky MAC address limits to eliminate rogue switches, and strict ingress/egress filtering for financial APIs.</li>
</ul>

<pre>
! Sample Multi-Area OSPF Core Configuration
router ospf 1
 router-id 10.255.255.1
 auto-cost reference-bandwidth 100000
 network 10.0.0.0 0.0.0.3 area 0
 network 10.10.0.0 0.0.255.255 area 10
 bfd all-interfaces
</pre>

<p>Through redundant core switches, LACP EtherChannels, and automated failover, this architecture delivered 99.999% uptime with zero packet loss across peak market operating hours.</p>`
    }
  ]
};

// In-memory cache to prevent refetch flickering
let cachedData: PortfolioData | null = null;

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(cachedData || FALLBACK_DATA);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    let mounted = true;

    // Fetch from live /api/portfolio
    fetch('/api/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error('API fetch failed');
        return res.json();
      })
      .then((fetchedData) => {
        if (mounted && fetchedData && typeof fetchedData === 'object') {
          // Merge with fallback to ensure all keys exist
          const merged: PortfolioData = {
            ...FALLBACK_DATA,
            ...fetchedData,
            // Ensure projects has at least the items if empty
            projects: (fetchedData.projects && fetchedData.projects.length > 0)
              ? fetchedData.projects
              : FALLBACK_DATA.projects,
            posts: (fetchedData.posts && fetchedData.posts.length > 0)
              ? fetchedData.posts
              : FALLBACK_DATA.posts
          };
          cachedData = merged;
          setData(merged);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Using cached/local fallback data for portfolio:', err);
        // Try to fetch static public/data/legacy_data.json
        fetch('/data/legacy_data.json')
          .then((res) => res.ok ? res.json() : null)
          .then((staticData) => {
            if (mounted && staticData) {
              const merged: PortfolioData = {
                ...FALLBACK_DATA,
                ...staticData,
                projects: (staticData.projects && staticData.projects.length > 0)
                  ? staticData.projects
                  : FALLBACK_DATA.projects,
                posts: (staticData.posts && staticData.posts.length > 0)
                  ? staticData.posts
                  : FALLBACK_DATA.posts
              };
              cachedData = merged;
              setData(merged);
            }
          })
          .catch(() => {})
          .finally(() => {
            if (mounted) setLoading(false);
          });
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading };
}
