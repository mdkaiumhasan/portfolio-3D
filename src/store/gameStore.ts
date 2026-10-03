import { create } from 'zustand';
import { Project } from '../data/projects';

import type { Octree } from 'three/examples/jsm/math/Octree.js';

// Zero-latency 60FPS shared position reference for camera & particle tracking
export const playerRealtimePos = { x: 0, y: 0, z: 32 };
export const playerRealtimeHeading = { current: Math.PI };

export type ActivePanel = 
  | 'about' 
  | 'projects' 
  | 'skills' 
  | 'experience' 
  | 'resume' 
  | 'contact' 
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

  // Mobile Controls
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
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
    subtitle: 'Who is MD. Kaium Hasan?',
    panel: 'about',
    position: [-4.0, 0, 26.5],
    color: '#00e5ff',
    icon: 'User'
  },
  {
    id: 'station-projects',
    title: 'Software Lab',
    subtitle: 'GravityEats, Parentra & More',
    panel: 'projects',
    position: [5.6, 0, 13.0],
    color: '#ff007f',
    icon: 'Terminal'
  },
  {
    id: 'station-skills',
    title: 'Tech Matrix',
    subtitle: 'Fullstack, Android & AI Tools',
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
  }
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_steps', title: 'First Steps', description: 'Spawned into the rain-slicked 3D world', unlocked: false, icon: 'Footprints' },
  { id: 'code_explorer', title: 'Code Explorer', description: 'Inspected the Software Engineering Lab', unlocked: false, icon: 'Code' },
  { id: 'network_architect', title: 'Network Architect', description: 'Visited the Network Operations Center (NOC)', unlocked: false, icon: 'Network' },
  { id: 'credential_hunter', title: 'Credential Hunter', description: 'Examined Kaium\'s dual-track resumes', unlocked: false, icon: 'Award' },
  { id: 'transmission_sent', title: 'Frequency Locked', description: 'Reached the Transmission Tower', unlocked: false, icon: 'Radio' },
  { id: 'grand_tourist', title: 'Grand Tour Master', description: 'Discovered all 6 world stations', unlocked: false, icon: 'Sparkles' }
];

export const useGameStore = create<GameState>((set, get) => ({
  mode: '3d',
  setMode: (mode) => set({ mode }),

  activePanel: null,
  setActivePanel: (panel) => {
    set({ activePanel: panel });
    if (panel === 'projects') get().unlockAchievement('code_explorer');
    if (panel === 'experience') get().unlockAchievement('network_architect');
    if (panel === 'resume') get().unlockAchievement('credential_hunter');
    if (panel === 'contact') get().unlockAchievement('transmission_sent');
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
    } catch (e) {
      // ignore
    }
  },
  setAudioEnabled: (audioEnabled) => set({ audioEnabled }),
  audioVolume: 0.5,
  setAudioVolume: (audioVolume) => set({ audioVolume }),

  worldOctree: null,
  setWorldOctree: (worldOctree) => set({ worldOctree }),

  qualityTier: 'high',
  setQualityTier: (tier) => set({ qualityTier: tier }),

  playerPosition: [0, 0, 32],
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

  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
  joystickVector: { x: 0, y: 0 },
  setJoystickVector: (joystickVector) => set({ joystickVector }),
  mobileActionSprint: false,
  setMobileActionSprint: (mobileActionSprint) => set({ mobileActionSprint }),
  mobileActionJump: false,
  setMobileActionJump: (mobileActionJump) => set({ mobileActionJump }),

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
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      set({
        achievements: achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
      });
      showNotification(`🏆 Achievement Unlocked!`, achievement.title, achievement.icon);
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
