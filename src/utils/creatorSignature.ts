/**
 * Official Creator & Open-Source Engine Attribution
 * Project: 3D Interactive Cyberpunk + 2D Hybrid Portfolio Engine
 * Original Author: MD. Kaium Hasan (https://github.com/mdkaiumhasan/portfolio-3D)
 * License: MIT
 */

export const CREATOR_SIGNATURE = {
  author: 'MD. Kaium Hasan',
  repoUrl: 'https://github.com/mdkaiumhasan/portfolio-3D',
  websiteUrl: 'https://www.mdkaiumhasan.site',
  version: '2.0.0',
} as const;

export function printCreatorSignature(
  surface: '3D World' | '2D Classic' | 'Admin Console' = '3D World'
): void {
  if (typeof window === 'undefined') return;
  const win = window as unknown as { __KH_SIGNATURE_PRINTED__?: boolean };
  if (win.__KH_SIGNATURE_PRINTED__) return;
  win.__KH_SIGNATURE_PRINTED__ = true;

  try {
    console.log(
      `%c ⚡ 3D/2D HYBRID PORTFOLIO ENGINE v${CREATOR_SIGNATURE.version} %c ${surface} `,
      'background: linear-gradient(90deg, #00e5ff, #10b981); color: #050814; font-weight: 800; padding: 5px 10px; border-radius: 6px 0 0 6px; font-family: monospace;',
      'background: #0f172a; color: #38bdf8; font-weight: 700; padding: 5px 10px; border: 1px solid #1e293b; border-radius: 0 6px 6px 0; font-family: monospace;'
    );
    console.log(
      `%cDeveloped & Open-Sourced by ${CREATOR_SIGNATURE.author} • ${CREATOR_SIGNATURE.repoUrl}`,
      'color: #94a3b8; font-family: monospace; font-size: 11px; padding-top: 2px;'
    );
  } catch {
    // Ignore restricted console environments
  }
}
