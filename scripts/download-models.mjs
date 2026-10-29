#!/usr/bin/env node
/**
 * Automated 3D Asset Downloader (`npm run download-models`)
 * Downloads all required .glb 3D assets (Map, Character, Pedestal Station, Iron Throne)
 * from GitHub Releases into `public/models/` for local development & deployment.
 *
 * Original Engine Author: MD. Kaium Hasan (https://github.com/mdkaiumhasan/portfolio-3D)
 */

import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.resolve(__dirname, '..', 'public', 'models');

const DEFAULT_RELEASE_BASE =
  process.env.MODEL_RELEASE_BASE_URL ||
  'https://github.com/mdkaiumhasan/portfolio-3D/releases/download/1.0.0';

const MODEL_ASSETS = [
  {
    file: 'after_the_rain_2k.glb',
    role: 'Desktop 3D Street Map Environment (2K PBR)',
    minBytes: 10 * 1024 * 1024,
  },
  {
    file: 'after_the_rain_mobile.glb',
    role: 'Mobile Optimized 3D Street Map Environment',
    minBytes: 1 * 1024 * 1024,
  },
  {
    file: 'cool_man.glb',
    role: 'Playable Third-Person Character Avatar & Animations',
    minBytes: 1 * 1024 * 1024,
  },
  {
    file: 'Project_tower.glb',
    role: 'Interactive Cyber Station Pedestal Tower',
    minBytes: 200 * 1024,
  },
  {
    file: 'throne_of_iron__stone.glb',
    role: 'Desktop Iron Throne Centerpiece',
    minBytes: 5 * 1024 * 1024,
  },
  {
    file: 'throne_mobile.glb',
    role: 'Mobile Optimized Iron Throne Centerpiece',
    minBytes: 200 * 1024,
  },
];

const forceDownload = process.argv.includes('--force');

function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function downloadAsset(asset) {
  const destPath = path.join(MODELS_DIR, asset.file);
  const tempPath = `${destPath}.part`;
  const url = `${DEFAULT_RELEASE_BASE.replace(/\/+$/, '')}/${asset.file}`;

  if (!forceDownload && fs.existsSync(destPath)) {
    const stats = fs.statSync(destPath);
    if (stats.size >= asset.minBytes) {
      console.log(`  [SKIP] ${asset.file} already exists (${formatMB(stats.size)})`);
      return;
    }
  }

  console.log(`  [DOWN] Downloading ${asset.file} (${asset.role})...`);
  console.log(`         URL: ${url}`);

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} ${res.statusText} while fetching ${url}`);
  }

  const totalBytes = Number(res.headers.get('content-length') || 0);
  let downloaded = 0;
  let lastLoggedPct = -10;

  const reader = Readable.fromWeb(res.body);
  reader.on('data', (chunk) => {
    downloaded += chunk.length;
    if (totalBytes > 0) {
      const pct = Math.floor((downloaded / totalBytes) * 100);
      if (pct >= lastLoggedPct + 20 || pct === 100) {
        lastLoggedPct = pct;
        process.stdout.write(
          `\r         Progress: ${pct}% (${formatMB(downloaded)} / ${formatMB(totalBytes)})   `
        );
      }
    }
  });

  await pipeline(reader, fs.createWriteStream(tempPath));
  if (totalBytes > 0) process.stdout.write('\n');

  fs.renameSync(tempPath, destPath);
  const finalStats = fs.statSync(destPath);
  console.log(`  [DONE] Saved ${asset.file} (${formatMB(finalStats.size)})\n`);
}

async function main() {
  console.log('\n=======================================================');
  console.log(' ⚡ 3D Portfolio Asset Downloader — MD. Kaium Hasan');
  console.log('=======================================================\n');

  fs.mkdirSync(MODELS_DIR, { recursive: true });

  for (const asset of MODEL_ASSETS) {
    try {
      await downloadAsset(asset);
    } catch (err) {
      console.error(`\n  [ERROR] Failed to download ${asset.file}: ${err.message}`);
      console.error(
        `          Manual download page: https://github.com/mdkaiumhasan/portfolio-3D/releases`
      );
      process.exitCode = 1;
    }
  }

  if (!process.exitCode) {
    console.log('All 6 3D (.glb) assets are ready inside public/models/!');
    console.log('Run `npm run dev` to launch the 3D & 2D portfolio locally.\n');
  }
}

main();
