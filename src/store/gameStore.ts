import { create } from 'zustand';
import type { ProjectItem } from '../hooks/usePortfolioData';
export type Project = ProjectItem;

import type { Octree } from 'three/examples/jsm/math/Octree.js';
import { isMobileDevice } from '../utils/orientation';

// Zero-latency 60/120FPS shared position & heading references for camera & particle tracking
export const playerRealtimePos = { x: 1.35, y: 0, z: 41 };
export const playerRealtimeHeading = { current: Math.PI };

// Zero-re-render 60/120Hz mobile touch input buffer read directly inside Player.tsx useFrame
export const mobileInputState = {
  joystickX: 0,
  joystickY: 0,
  sprint: false,
  jump: false,
};

export type ActivePanel =
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'resume'
  | 'contact'
  | 'blog'
  | 'settings'
  | 'tutorial'
  | null;

export type QualityTier = 'high' | 'medium' | 'low';

export interface StationInfo {
  id: string;
  title: string;
  subtitle: string;
  panel: ActivePanel;
  position: [number, number, number];
  color: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface GameState {
  // Mode
  mode: '3d' | '2d';
  setMode: (mode: '3d' | '2d') => void;
  isIntroLoading: boolean;
  setIsIntroLoading: (loading: boolean) => void;

  // Single-stream resolved ObjectURL for the 3D street model (prevents duplicate downloads)
  resolvedEnvModelUrl: string | null;
  setResolvedEnvModelUrl: (url: string | null) => void;

  // Active UI Panel
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;

  // Proximity & Interactions
  nearbyStation: StationInfo | null;
  setNearbyStation: (station: StationInfo | null) => void;

  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  audioVolume: number;
  setAudioVolume: (volume: number) => void;

  // Physics Collision
  worldOctree: Octree | null;
  setWorldOctree: (octree: Octree | null) => void;

  // Graphics Quality
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;

  // Player State
  playerPosition: [number, number, number];
  setPlayerPosition: (pos: [number, number, number]) => void;
  playerHeading: number; // yaw angle
  setPlayerHeading: (heading: number) => void;
  isMoving: boolean;
  setIsMoving: (isMoving: boolean) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  isJumping: boolean;
  setIsJumping: (isJumping: boolean) => void;
  activeEmote: 'idle' | 'walk' | 'run' | 'salute' | 'shakehand' | 'sit' | 'cough';
  setActiveEmote: (emote: 'idle' | 'walk' | 'run' | 'salute' | 'shakehand' | 'sit' | 'cough') => void;
  isSeatedOnThrone: boolean;
  setIsSeatedOnThrone: (isSeated: boolean) => void;

  // Mobile Controls & Orientation
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  isPortrait: boolean;
  setIsPortrait: (isPortrait: boolean) => void;
  joystickVector: { x: number; y: number };
  setJoystickVector: (vec: { x: number; y: number }) => void;
  mobileActionSprint: boolean;
  setMobileActionSprint: (sprint: boolean) => void;
  mobileActionJump: boolean;
  setMobileActionJump: (jump: boolean) => void;

  // Gamification & Quests
  discoveredStations: string[];
  markStationDiscovered: (id: string) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  activeNotification: { title: string; subtitle: string; icon?: string } | null;
  showNotification: (title: string, subtitle: string, icon?: string) => void;
  clearNotification: () => void;
}

export const STATIONS: StationInfo[] = [
  {
    id: 'station-about',
    title: 'Welcome Plaza',
    subtitle: 'Home & About Profile',
    panel: 'about',
    position: [-4.0, 0, 26.5],
    color: '#28a745',
    icon: 'User'
  },
  {
    id: 'station-projects',
    title: 'Software Lab',
    subtitle: 'Dynamic Projects & Systems',
    panel: 'projects',
    position: [5.6, 0, 13.0],
    color: '#ff007f',
    icon: 'Terminal'
  },
  {
    id: 'station-skills',
    title: 'Tech Matrix',
    subtitle: 'Fullstack, Networking & AI Tools',
    panel: 'skills',
    position: [-4.0, 0, 1.0],
    color: '#39ff14',
    icon: 'Cpu'
  },
  {
    id: 'station-experience',
    title: 'Network Ops Center (NOC)',
    subtitle: 'ISP Engineering & Certifications',
    panel: 'experience',
    position: [5.6, 0, -10.0],
    color: '#ffb703',
    icon: 'Radio'
  },
  {
    id: 'station-resume',
    title: 'Resume & Vault',
    subtitle: 'Direct PDF Downloads',
    panel: 'resume',
    position: [0.6, 0, -22.0],
    color: '#a855f7',
    icon: 'FileText'
  },
  {
    id: 'station-contact',
    title: 'Transmission Tower',
    subtitle: 'Get in Touch & Social Uplink',
    panel: 'contact',
    position: [5.2, 0, -32.0],
    color: '#06b6d4',
    icon: 'Send'
  },
  {
    id: 'station-blog',
    title: 'Cyber Chronicles',
    subtitle: 'Network Guides & Tech Articles',
    panel: 'blog',
    position: [10.5, 0, -40.5],
    color: '#f43f5e',
    icon: 'BookOpen'
  }
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', title: 'First Steps', description: 'Spawned into the rain-slicked 3D world', unlocked: false, icon: 'Footprints' },
  { id: 'code_explorer', title: 'Code Explorer', description: 'Inspected the Software Engineering Lab', unlocked: false, icon: 'Code' },
  { id: 'network_architect', title: 'Network Architect', description: 'Visited the Network Operations Center (NOC)', unlocked: false, icon: 'Network' },
  { id: 'credential_hunter', title: 'Credential Hunter', description: "Examined Kaium's dual-track resumes", unlocked: false, icon: 'Award' },
  { id: 'transmission_sent', title: 'Frequency Locked', description: 'Reached the Transmission Tower', unlocked: false, icon: 'Radio' },
  { id: 'chronicler', title: 'Cyber Chronicler', description: 'Accessed the Cyber Chronicles blog tower', unlocked: false, icon: 'BookOpen' },
  { id: 'grand_tourist', title: 'Grand Tour Master', description: 'Discovered all 7 world stations', unlocked: false, icon: 'Sparkles' }
];

const getInitialMode = (): '3d' | '2d' => {
  if (typeof window === 'undefined') return '3d';
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === '2d' || window.location.hash === '#2d' || window.location.hash === '#classic') {
    return '2d';
  }
  return '3d';
};

const getInitialQualityTier = (): QualityTier => {
  if (typeof window === 'undefined') return 'high';
  try {
    const saved = localStorage.getItem('quality_tier');
    if (saved === 'low' || saved === 'medium' || saved === 'high') return saved;
  } catch {
    // ignore storage errors
  }
  return isMobileDevice() ? 'medium' : 'high';
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: getInitialMode(),
  setMode: (mode) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (mode === '2d') {
        url.searchParams.set('view', '2d');
      } else {
        url.searchParams.delete('view');
        if (url.hash === '#2d' || url.hash === '#classic') url.hash = '';
      }
      window.history.replaceState({}, '', url.toString());
    }
    set({ mode });
  },
  isIntroLoading: true,
  setIsIntroLoading: (isIntroLoading) => set({ isIntroLoading }),

  resolvedEnvModelUrl: null,
  setResolvedEnvModelUrl: (resolvedEnvModelUrl) => set({ resolvedEnvModelUrl }),

  activePanel: null,
  setActivePanel: (panel) => {
    set({ activePanel: panel });
    if (panel === 'projects') get().unlockAchievement('code_explorer');
    if (panel === 'experience') get().unlockAchievement('network_architect');
    if (panel === 'resume') get().unlockAchievement('credential_hunter');
    if (panel === 'contact') get().unlockAchievement('transmission_sent');
    if (panel === 'blog') get().unlockAchievement('chronicler');
  },
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  nearbyStation: null,
  setNearbyStation: (station) => {
    set({ nearbyStation: station });
    if (station) {
      get().markStationDiscovered(station.id);
    }
  },

  audioEnabled: false,
  toggleAudio: () => {
    const next = !get().audioEnabled;
    set({ audioEnabled: next });
    try {
      localStorage.setItem('audio_enabled', String(next));
    } catch {
      // ignore
    }
  },
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
  audioVolume: 0.5,
  setAudioVolume: (audioVolume) => set({ audioVolume }),

  worldOctree: null,
  setWorldOctree: (worldOctree) => set({ worldOctree }),

  qualityTier: getInitialQualityTier(),
  setQualityTier: (tier) => {
    set({ qualityTier: tier });
    try {
      localStorage.setItem('quality_tier', tier);
    } catch {
      // ignore
    }
  },

  playerPosition: [1.35, 0, 41],
  setPlayerPosition: (playerPosition) => set({ playerPosition }),
  playerHeading: Math.PI,
  setPlayerHeading: (playerHeading) => set({ playerHeading }),
  isMoving: false,
  setIsMoving: (isMoving) => {
    set({ isMoving });
    if (isMoving) {
      get().unlockAchievement('first_steps');
    }
  },
  isRunning: false,
  setIsRunning: (isRunning) => set({ isRunning }),
  isJumping: false,
  setIsJumping: (isJumping) => set({ isJumping }),
  activeEmote: 'idle',
  setActiveEmote: (activeEmote) => set({ activeEmote }),
  isSeatedOnThrone: true,
  setIsSeatedOnThrone: (isSeatedOnThrone) => set({ isSeatedOnThrone }),

  isMobile: typeof window !== 'undefined' ? isMobileDevice() : false,
  setIsMobile: (isMobile) => set({ isMobile }),
  isPortrait: typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false,
  setIsPortrait: (isPortrait) => set({ isPortrait }),
  joystickVector: { x: 0, y: 0 },
  setJoystickVector: (joystickVector) => {
    mobileInputState.joystickX = joystickVector.x;
    mobileInputState.joystickY = joystickVector.y;
    set({ joystickVector });
  },
  mobileActionSprint: false,
  setMobileActionSprint: (mobileActionSprint) => {
    mobileInputState.sprint = mobileActionSprint;
    set({ mobileActionSprint });
  },
  mobileActionJump: false,
  setMobileActionJump: (mobileActionJump) => {
    mobileInputState.jump = mobileActionJump;
    set({ mobileActionJump });
  },

  discoveredStations: [],
  markStationDiscovered: (id) => {
    const { discoveredStations, unlockAchievement } = get();
    if (!discoveredStations.includes(id)) {
      const next = [...discoveredStations, id];
      set({ discoveredStations: next });
      if (next.length >= STATIONS.length) {
        unlockAchievement('grand_tourist');
      }
    }
  },

  achievements: INITIAL_ACHIEVEMENTS,
  unlockAchievement: (id) => {
    const { achievements, showNotification } = get();
    const achievement = achievements.find((a) => a.id === id);
    if (achievement && !achievement.unlocked) {
      set({
        achievements: achievements.map((a) => (a.id === id ? { ...a, unlocked: true } : a))
      });
      showNotification('🏆 Achievement Unlocked!', achievement.title, achievement.icon);
    }
  },

  activeNotification: null,
  showNotification: (title, subtitle, icon) => {
    set({ activeNotification: { title, subtitle, icon } });
    setTimeout(() => {
      if (get().activeNotification?.title === title) {
        set({ activeNotification: null });
      }
    }, 4500);
  },
  clearNotification: () => set({ activeNotification: null })
}));
