import { PortfolioData } from './types';

const API_BASE = '/api';

export const fallbackPortfolioData: PortfolioData = {
  home_heading: "Hi, I'm {{ACCENT}}MD. Kaium Hasan{{/ACCENT}}. A Network Engineer.",
  home_subheading: "I'm a Network Engineer. I love to build functional and resilient networks. Networks are digital roads for deploying applications like Twitter and Google Maps.",
  home_cv_link: "#",
  home_profile_image: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg",
  about_info_heading: "INFORMATION ABOUT ME",
  about_info_text: "I am a highly motivated, skilled and qualified Network Engineer with over 1 years commercial experience working within various private sector and public sector fast paced dynamic environments. My experience includes (but not limited to) Design, Security, Wireless, Project and BAU work.",
  about_cv_link: "https://files.catbox.moe/0juxap.pdf",
  stats: [
    { heading: "CCNA", description: "CISCO CERTIFIED NETWORK ASSOCIATE" },
    { heading: "MIKROTIK", description: "MIKROTIK ROUTER CONFIGURE & MANAGEMENT" },
    { heading: "WINDOWS SERVER", description: "WINDOWS SERVER CONFIGURATION & MANAGEMENT" },
    { heading: "LINUX SERVER", description: "LINUX SERVER CONFIGURATION & MANAGEMENT" },
    { heading: "MTCNA", description: "MIKROTIK CERTIFIED NETWORK ASSOCIATE" },
    { heading: "MTCRE", description: "MIKROTIK CERTIFIED ROUTING ENGINEER" }
  ],
  skills: [
    { category: "Network Engineering", name: "ROUTING", percent: 95 },
    { category: "Network Engineering", name: "SWITCHING", percent: 95 },
    { category: "Network Engineering", name: "CONFIGURE", percent: 90 },
    { category: "Security & Systems", name: "FIREWALL", percent: 80 },
    { category: "Programming & Software", name: "C++", percent: 75 },
    { category: "Programming & Software", name: "PYTHON", percent: 80 }
  ],
  skill_categories: ["Network Engineering", "Security & Systems", "Programming & Software"],
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
  project_categories: [
    "Networking & Security",
    "Mobile & Realtime",
    "Robotics & Hardware",
    "AI & Machine Learning"
  ],
  portfolio_cv_link: "#",
  portfolio__showConstructionMessage: true,
  projects: [
    {
      category: "AI & Machine Learning",
      title: "Mess Management APP (EasyMess)",
      role: "Android & Fullstack Developer",
      technology: "JavaScript, CSS, HTML, Firebase, Android Studio, Kotlin",
      imageUrl: "https://i.ibb.co.com/jmy2C5v/Screenshot-2026-01-04-232855.png",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan",
      shortDesc: "Automated bachelor mess & meal expense tracker for Manager and Members with live meal rates, member balances, and bazaar requests.",
      fullDetails: "<h3>EasyMess - Bachelor Mess & Meal Expense Tracker</h3><p>This app is an account management tool for mess Managers & Members. Easily track deposits, expenses, dues, and monthly reports with real-time automatic meal rate computation and bilingual (Bangla & English) localization.</p><p><a href=\"https://files.catbox.moe/zrgptp.zip\" target=\"_blank\">Download App ZIP</a></p>"
    },
    {
      category: "Networking & Security",
      title: "Enterprise Network",
      role: "Network Architect & Administrator",
      technology: "Cisco IOS, OSPF, VLAN / 802.1Q, NAT / PAT, Stateful ACLs, DHCP Snooping",
      imageUrl: "https://i.ibb.co.com/7tXff9kw/Screenshot-2025-12-31-193032.png",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan",
      shortDesc: "High-Availability redundant network topology for a 600-staff trading floor with multi-area OSPF routing, 802.1Q VLANs, and stateful ACL security.",
      fullDetails: "<h3>High-Availability 600-Staff Trading Floor Network Infrastructure</h3><p>Engineered a fault-tolerant campus and trading floor enterprise network infrastructure for 600 financial operators. Utilized multi-area OSPF for rapid sub-second convergence, strict VLAN isolation between management, trading, and guest traffic, and robust access control lists (ACLs) to mitigate unauthorized lateral movement.</p>"
    },
    {
      category: "Mobile & Realtime",
      title: "Ramadan Journey",
      role: "Android Developer",
      technology: "React.js, Android Studio, Kotlin, Push Notifications",
      imageUrl: "https://files.catbox.moe/bcktxt.png",
      live: "https://files.catbox.moe/b5bgv1.apk",
      github: "https://github.com/mdkaiumhasan",
      shortDesc: "Real-time prayer helper and Islamic companion providing accurate salah reminders, Sahri/Iftar alarms, and offline supplications.",
      fullDetails: "<h3>Ramadan Journey - Real-Time Prayer Helper</h3><p>Using this application you can stay connected with prayer times, accurate Sahri & Iftar countdown alarms, daily Islamic reminders, and offline prayer trackers.</p>"
    },
    {
      category: "Robotics & Hardware",
      title: "Autonomous Line Follower Robot (LFR)",
      role: "Hardware & Robotics Engineer",
      technology: "Arduino / C++, ATmega328P, IR Reflectance Sensor Array, L298N Motor Driver",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035636/portfolio/activities/wh65cwweq8aswishk7cv.webp",
      live: "https://www.mdkaiumhasan.site",
      github: "https://github.com/mdkaiumhasan",
      shortDesc: "Autonomous navigation robot using microsecond IR reflectance sensors and differential motor control for path tracking at the District Science Fair.",
      fullDetails: "<h3>Autonomous Line Follower Robot (LFR)</h3><p>Designed and wired an autonomous ground vehicle capable of high-speed path tracking along complex black-and-white grid courses. Presented and awarded at the District Science Exhibition 2024.</p>"
    }
  ],
  timeline_cv_link: "#",
  timeline__showConstructionMessage: false,
  experiences: [
    {
      title: "Network Support Engineer – FNF Online (ISP)",
      date: "Jan 2026 – Present",
      description: "Managing MikroTik routers, distribution switches, GPON OLTs, PPPoE queues, and subscriber bandwidth management for multi-tenant fiber network connectivity.",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791393912/portfolio_uploads/jlx9jjp4kteugudgvonq.jpg"
    },
    {
      title: "Independent Fullstack & Systems Developer",
      date: "2025 – Present",
      description: "Engineering production-grade web applications, distributed backend services, and native Android mobile apps including EasyMess and Ramadan Journey.",
      imageUrl: "/data/fullstack_dev_logo.svg"
    },
    {
      title: "Cisco CCNA 200-301 & Enterprise Infrastructure Labs",
      date: "2025 – 2026",
      description: "Multi-area OSPF routing, 802.1Q VLAN trunking, STP loop prevention, stateful ACL traffic segmentation, MikroTik RouterOS, and Red Hat Linux server administration.",
      imageUrl: "https://files.catbox.moe/pasmm0.jpg"
    },
    {
      title: "Diploma in Engineering (Computer Science & Technology)",
      date: "Completed 2026",
      description: "Mymensingh Polytechnic Institute. Advanced coursework in network architectures, operating systems, and autonomous robotics presented at District Science Fair 2024.",
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035636/portfolio/activities/wh65cwweq8aswishk7cv.webp"
    }
  ],
  blogs_cv_link: "#",
  blogs__showConstructionMessage: true,
  posts: [
    {
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg",
      date: "Oct 26, 2025",
      category: "Tutorial",
      title: "Access Control List (ACL) – Complete Implementation Guide",
      shortDesc: "Understanding standard and extended Access Control Lists in enterprise Cisco networks with Packet Tracer walkthroughs.",
      fullContent: "<p>Access Control Lists (ACLs) are network traffic filters applied on routers and layer 3 switches. Learn how to secure your network topology and prevent unauthorized access.</p>"
    },
    {
      imageUrl: "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035650/portfolio/blogs/pmao25kvzdb72jnhzjda.svg",
      date: "Oct 25, 2025",
      category: "Web Design",
      title: "Why Cisco CCNA (200-301) is the Ultimate Foundation",
      shortDesc: "Exploring why deep routing, switching, and network automation fundamentals are crucial for any modern systems architect.",
      fullContent: "<p>The CCNA 200-301 curriculum validates essential knowledge in routing, switching, wireless, and network programmability. Here is how it translates into enterprise engineering.</p>"
    }
  ],
  contact_info_heading: "CONTACT ME HERE",
  contact_info_text: "For Network consultancy services, please get in touch.",
  contact_cv_link: "https://files.catbox.moe/0juxap.pdf",
  contactDetails: [
    { type: "Location", value: "Dhanmondi 27, Dhaka" },
    { type: "Email", value: "mdkaiumhasan2005@gmail.com" },
    { type: "Contact Number", value: "+880 1560-014339" },
    { type: "Languages", value: "Bengali, English, Hindi" }
  ],
  socialLinks: [
    { platform: "github", url: "https://github.com/mdkaiumhasan" },
    { platform: "linkedin", url: "https://linkedin.com/in/mdkaiumhasan" },
    { platform: "facebook", url: "https://facebook.com/mdkaiumhasan" }
  ]
};

export const authStorageKey = 'admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(authStorageKey);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(authStorageKey, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(authStorageKey);
}

export async function loginWithPassword(password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Authentication failed');
  }
  setAdminToken(data.token);
  return data.token;
}

export async function fetchPortfolio(): Promise<PortfolioData> {
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (res.ok) {
      const data = await res.json();
      return {
        ...fallbackPortfolioData,
        ...data,
        stats: Array.isArray(data.stats) ? data.stats : fallbackPortfolioData.stats,
        skills: Array.isArray(data.skills) ? data.skills : fallbackPortfolioData.skills,
        skill_categories: Array.isArray(data.skill_categories) && data.skill_categories.length > 0
          ? data.skill_categories
          : fallbackPortfolioData.skill_categories,
        projects: Array.isArray(data.projects) ? data.projects : fallbackPortfolioData.projects,
        project_categories: Array.isArray(data.project_categories) && data.project_categories.length > 0
          ? data.project_categories
          : fallbackPortfolioData.project_categories,
        experiences: Array.isArray(data.experiences) ? data.experiences : fallbackPortfolioData.experiences,
        activities: Array.isArray(data.activities) ? data.activities : fallbackPortfolioData.activities,
        posts: Array.isArray(data.posts) ? data.posts : fallbackPortfolioData.posts,
        contactDetails: Array.isArray(data.contactDetails) ? data.contactDetails : fallbackPortfolioData.contactDetails,
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : fallbackPortfolioData.socialLinks
      };
    }
  } catch (err) {
    console.warn('API fetch warning, using fallback data:', err);
  }
  return fallbackPortfolioData;
}

export async function savePortfolio(data: PortfolioData): Promise<{ success: boolean; message: string }> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.error || 'Failed to save portfolio data');
  }
  return { success: true, message: result.message || 'Saved to MongoDB successfully' };
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const token = getAdminToken();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token || ''}`
          },
          body: JSON.stringify({
            image: reader.result,
            folder: 'portfolio_uploads'
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          resolve(data.url);
        } else {
          reject(new Error(data.error || 'Image upload failed'));
        }
      } catch (e: any) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
