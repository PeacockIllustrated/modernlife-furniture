/**
 * Renders the social reel to MP4.
 *
 *   node scripts/render-social.mjs [--square] [--fps 30]
 *
 * The film is made from the real thing: the real chair silhouettes falling
 * through the real solver, and the exported logo asset playing its own CSS
 * animation. Nothing is reimplemented for video, so the reel cannot drift from
 * what the site does.
 *
 * The harness page (scripts/reel/page.tsx) is copied into app/ for the run and
 * removed afterwards, so no dev-only route ships. Time is driven from outside
 * through window.__seek, so every frame is the frame that was asked for
 * however long the machine took to draw it, and two runs are identical.
 *
 * Needs a Chromium and an ffmpeg. Point CHROMIUM_PATH at a browser if the
 * default is not there, and install ffmpeg with:
 *   pip install imageio-ffmpeg
 */
import { chromium } from "playwright-core";
import { execFileSync, spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROUTE_DIR = "app/reel-render";
const OUT_DIR = "public/social";
const PORT = 3399;

const args = process.argv.slice(2);
const square = args.includes("--square");
const fps = Number(args[args.indexOf("--fps") + 1]) || 30;
const size = square ? { width: 1080, height: 1080 } : { width: 1080, height: 1920 };
const outFile = join(OUT_DIR, square ? "house-of-chairs-square.mp4" : "house-of-chairs-reel.mp4");

const ffmpeg = execFileSync("python3", [
  "-c",
  "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())",
])
  .toString()
  .trim();

const sh = (cmd, cmdArgs) =>
  execFileSync(cmd, cmdArgs, { stdio: "inherit", env: process.env });

function cleanup() {
  rmSync(ROUTE_DIR, { recursive: true, force: true });
  // Next leaves generated route types behind. They outlive the route and make
  // the next `tsc --noEmit` fail on a module that no longer exists, which is a
  // confusing thing to hand someone.
  rmSync(".next/types", { recursive: true, force: true });
}

let server;
try {
  // 1. Put the harness where Next can compile it.
  cleanup();
  mkdirSync(ROUTE_DIR, { recursive: true });
  cpSync("scripts/reel/page.tsx", join(ROUTE_DIR, "page.tsx"));

  console.log("building...");
  sh("npx", ["next", "build"]);

  server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    stdio: "ignore",
    detached: true,
  });

  // 2. Step the page frame by frame and keep every frame as a PNG.
  const frames = ".reel-frames";
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });

  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium",
  });
  const page = await browser.newPage({
    viewport: size,
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });

  // Wait for the server rather than guessing at a sleep.
  for (let i = 0; i < 60; i++) {
    try {
      const res = await page.goto(`http://localhost:${PORT}/reel-render`, {
        waitUntil: "domcontentloaded",
        timeout: 2000,
      });
      if (res && res.ok()) break;
    } catch {
      await page.waitForTimeout(1000);
    }
  }
  await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
  const end = await page.evaluate(() => window.__end ?? 6600);
  const count = Math.ceil((end / 1000) * fps);
  console.log(`rendering ${count} frames at ${fps}fps, ${size.width}x${size.height}`);

  for (let i = 0; i < count; i++) {
    const ms = (i / fps) * 1000;
    await page.evaluate((t) => window.__seek?.(t), ms);
    await page.screenshot({
      path: join(frames, `f-${String(i).padStart(5, "0")}.png`),
      clip: { x: 0, y: 0, ...size },
    });
    if (i % 30 === 0) process.stdout.write(`  ${i}/${count}\r`);
  }
  await browser.close();

  // 3. Encode. yuv420p and even dimensions, or half the platforms refuse it.
  mkdirSync(OUT_DIR, { recursive: true });
  console.log("\nencoding...");
  sh(ffmpeg, [
    "-y",
    "-framerate", String(fps),
    "-i", join(frames, "f-%05d.png"),
    "-c:v", "libx264",
    "-profile:v", "high",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outFile,
  ]);
  rmSync(frames, { recursive: true, force: true });
  console.log(`wrote ${outFile}`);
} finally {
  if (server) {
    try {
      process.kill(-server.pid);
    } catch {
      // already gone
    }
  }
  cleanup();
  if (existsSync(ROUTE_DIR)) console.warn(`could not remove ${ROUTE_DIR}`);
}
