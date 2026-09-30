export type RecipeVideo = {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** Seconds. */
  seconds: number;
  label: string;
};

export type Recipe = {
  slug: string;
  title: string;
  /** Meta description, ~150 chars. */
  summary: string;
  framework: "HyperFrames" | "Remotion";
  uploadDate: string;
  videos: RecipeVideo[];
  intro: string;
  prompt: string;
  promptNote: string;
  steps: string[];
  metrics: [string, string][];
  notes: string[];
  faqs: { q: string; a: string }[];
  repoPath: string;
  transcript?: string;
};

export const OPUS_VIDEO_BASE = "/ai/opus-video";
export const COMPARE_SLUG = "hyperframes-vs-remotion-vs-manim";
export const REPO_URL = "https://github.com/bilaldemirerr/opus-video-recipes";
export const recipePath = (slug: string) => `${OPUS_VIDEO_BASE}/${slug}`;
export const isoDuration = (s: number) => `PT${Math.round(s)}S`;

const v = (name: string, width: number, height: number, seconds: number, label: string): RecipeVideo => ({
  src: `${OPUS_VIDEO_BASE}/${name}.mp4`,
  poster: `${OPUS_VIDEO_BASE}/${name}.jpg`,
  width,
  height,
  seconds,
  label,
});

export const RECIPES: Recipe[] = [
  {
    slug: "app-store-preview-video",
    title: "App Store preview video with one prompt",
    summary:
      "A real App Store preview for an indie iOS app, made by Claude Opus 5.5 from one prompt: the exact prompt, what the agent did, token cost and Apple's specs.",
    framework: "Remotion",
    uploadDate: "2026-09-29",
    videos: [
      v("lovely-app-store-preview-iphone", 590, 1278, 25, "iPhone preview (886×1920 original)"),
      v("lovely-app-store-preview-ipad", 900, 1200, 25, "iPad preview (1200×1600 original)"),
    ],
    intro:
      "Lovely is my couples app. Its US App Store preview video, both the iPhone and the iPad version, came out of one prompt to Claude Opus 5.5 in Claude Code. The agent re-captured real app screens in the iOS Simulator, swapped the copy to English, fixed what looked wrong and rendered both files with Remotion.",
    prompt:
      "simdi us  icin gereken her icerigi verdim, us store gorselelriin ve videosunu hazirlayabilir miins? baska eksik va rmi?\n\n[12 images attached: the US demo couple's photos]\n\nEnglish: \"I've now given you everything needed for the US. Can you prepare the US store screenshots and video? Is anything else missing?\"",
    promptNote:
      "That is the whole prompt, typos included, in Turkish as I typed it. It is short because the project already had a pipeline: a brief, a Remotion composition for the Turkish preview, and simulator capture scripts, all built earlier with the same model. The prompt turned that pipeline into a new locale. If you start from zero, give the agent a brief like the one in the repo first.",
    steps: [
      "Read the existing marketing pipeline: demo seed data, simulator capture scripts and the SwiftUI marketing scenes.",
      "Saved the 12 attached photos as per-locale assets and changed the seed and scene code to load photos by locale.",
      "Wrote the en-US App Store metadata (name, subtitle, keywords).",
      "Ran the capture pipeline for en-US. It noticed the iPad status bar still showed a Turkish date, made the script set the simulator language per locale and captured again.",
      "Copied the English screens into the Remotion project and switched the on-screen copy to English.",
      "Checked frames and found the map pin crops were empty (US places sit elsewhere on the map), so it added English-specific pin coordinates.",
      "Rendered the iPhone (886×1920) and iPad (1200×1600) files, checked them with ffprobe and updated the project's CLAUDE.md.",
    ],
    metrics: [
      ["Model", "claude-opus-5-5 in Claude Code"],
      ["Wall-clock time", "40.5 min from prompt to both files (about 33 min of it was simulator capture)"],
      ["Model calls", "83"],
      ["Tokens", "43,592 output · 170 uncached input · 11,255,497 cache read · 242,290 cache write (1h)"],
      ["Cost at API list price", "≈ $5.06 (covers the screenshots and both videos)"],
      ["iPhone file", "886×1920, 30 fps, H.264 + AAC, 25.0 s, 17.4 MB"],
      ["iPad file", "1200×1600, 30 fps, H.264 + AAC, 25.0 s, 14.9 MB"],
    ],
    notes: [
      "Apple's rules (App Store Connect → App preview specifications): 15–30 seconds, up to 30 fps, 500 MB max, H.264 or ProRes 422 HQ, .mov/.m4v/.mp4. iPhone 6.9\" and 6.5\" accept 886×1920 portrait; 13\" iPad accepts 1200×1600 portrait. The default poster frame is at 5 seconds.",
      "Audio is optional; if present, Apple lists stereo 256 kbps AAC at 44.1 or 48 kHz.",
      "Use real screen captures of the app. My first Turkish cut animated static screenshots; I had it replaced with simulator recordings because a slideshow risks rejection.",
      "The poster frame (5 s) is what most people see. Keep it sharp: in an early cut a dim overlay made it look grey.",
      "The embedded videos here are compressed web copies. The uploaded files are the originals listed above.",
    ],
    faqs: [
      {
        q: "Was it really one prompt?",
        a: "For the US version, yes: one message plus 12 photos, then \"looks great, upload it\". The pipeline it reused (brief, Remotion composition, capture scripts) was built in earlier sessions, also with Claude Opus 5.5.",
      },
      {
        q: "Why Remotion and not HyperFrames here?",
        a: "The content project already had a Remotion setup from an earlier video, so the agent extended it. The other recipes on this page use HyperFrames; the comparison page covers when each fits.",
      },
      {
        q: "What does it cost?",
        a: "This run used about 11.3M cache-read tokens and 44K output tokens. At Opus 5.5 list prices ($4 input, $20 output, $0.20 cache read, $8 1h cache write per million) that is about $5, including the screenshots.",
      },
    ],
    repoPath: "app-store-preview",
  },
  {
    slug: "kinetic-typography-explainer",
    title: "Kinetic typography explainer: what's new in Opus 5.5",
    summary:
      "A 16-second 1080p kinetic typography explainer written by Claude Opus 5.5 as one HTML file and rendered with HyperFrames in 11 seconds. Prompt and source included.",
    framework: "HyperFrames",
    uploadDate: "2026-09-30",
    videos: [v("whats-new-opus-5-5", 1280, 720, 16, "1920×1080 original, 16 s")],
    intro:
      "Big type, one fact per beat, a progress bar. Every number comes from Anthropic's announcement and the model docs, and the source line stays on screen. It is one HTML file with a GSAP timeline, no assets.",
    prompt:
      "Make a 16-second 1920×1080 kinetic typography video with HyperFrames: \"What's new in Claude Opus 5.5\". One fact per ~2 s beat, big bold numbers, warm off-white background, one accent color, a progress bar along the bottom and a source line. Facts only from anthropic.com/claude-opus-5-5 and platform.claude.com: released Sep 22 2026; $4 / $20 per million input/output tokens (20% less than Opus 5); cache reads $0.20 (60% less); ~40% cheaper on typical workloads; 30%+ faster output; 1M context, 128K max output; adaptive thinking always on, default effort medium; model ID claude-opus-5-5. Run hyperframes check, then render.",
    promptNote:
      "This is the prompt to reproduce it. I built it inside a longer multi-task agent session, so there is no per-recipe token count to report.",
    steps: [
      "Checked the model ID and prices on platform.claude.com and the announcement on anthropic.com.",
      "Scaffolded with npx hyperframes init, then wrote seven timed beats as .clip elements in index.html.",
      "Animated each beat with one paused GSAP timeline (kicker, number, sub-line) plus a 16 s progress bar.",
      "Ran npx hyperframes check: lint, layout and contrast (24/24 WCAG AA) passed.",
      "Rendered with npx hyperframes render --quality delivery.",
    ],
    metrics: [
      ["Render time", "11.0 s on an M4 MacBook (hardware GPU)"],
      ["Output", "1920×1080, 30 fps, H.264, 16.0 s, 2.2 MB"],
      ["Source", "1 HTML file, ~90 lines, no assets"],
      ["Tokens / cost", "Not measured: built inside a larger agent session with no per-recipe counter"],
    ],
    notes: [
      "Don't set a CSS transform on an element you also animate with GSAP; HyperFrames lint flags it (gsap_css_transform_conflict). Use fromTo.",
      "Render length is the root data-duration, not the timeline length.",
      "Put the source on screen. A stats video without one is easy to dismiss.",
    ],
    faqs: [
      {
        q: "Can I swap in my own facts?",
        a: "Yes. Each beat is a div with a kicker, a big line and a sub-line. Edit the text and the data-start times; the animation loop picks them up.",
      },
      {
        q: "Why 16 seconds?",
        a: "Seven beats at about 2.2 s each is enough to read the big number and the sub-line once. Shorter beats felt like a blink.",
      },
      {
        q: "Does it need a GPU?",
        a: "No. HyperFrames renders in headless Chrome and encodes with FFmpeg. On my M4 it used the hardware GPU path; software rendering works but is slower.",
      },
    ],
    repoPath: "kinetic-typography-explainer",
  },
  {
    slug: "captioned-vertical-video-tts",
    title: "Captioned vertical clip with local TTS voiceover",
    summary:
      "A 15-second 9:16 clip with voiceover and word-by-word captions, made by Claude Opus 5.5 with HyperFrames, macOS say and local Whisper. Fully offline render.",
    framework: "HyperFrames",
    uploadDate: "2026-09-30",
    videos: [v("vertical-captioned-clip", 720, 1280, 15, "1080×1920 original, 15 s, with sound")],
    intro:
      "A short script becomes a vertical clip for X, Reels or Shorts: a local text-to-speech voice, word timings from local Whisper, captions that light up word by word, and a code card that types in. Nothing leaves the machine.",
    prompt:
      "Make a 15-second 1080×1920 vertical clip with HyperFrames from this script: \"I made this video without opening a video editor. I gave Claude Opus 5.5 one prompt. It wrote HTML, and HyperFrames rendered it to MP4. The captions, the voice, the motion. All local. Here is the exact recipe.\" Generate the voiceover locally, get word timestamps with npx hyperframes transcribe, and show big centered captions in the lower third, 3–6 words per group, highlighting each word as it is spoken. Above them, a code card whose lines fade in. Dark background, one warm accent. Run check, then render.",
    promptNote:
      "This is the prompt to reproduce it. I built it inside a longer multi-task agent session, so there is no per-recipe token count to report.",
    steps: [
      "Generated the voiceover with macOS say (voice Samantha, rate 175) and converted it to WAV with FFmpeg. HyperFrames' own Kokoro TTS needs a Python package that would not install on the system Python here, so the agent used the built-in voice.",
      "Ran npx hyperframes transcribe (whisper.cpp, small.en) for word timestamps. Whisper heard \"5.5 one\" as \"5.51\", so that word was fixed by hand.",
      "Wrote index.html: caption groups built from the word list, each word switching to full white at its start time.",
      "Placed the audio as an <audio> clip with an id (without one the render is silent).",
      "Ran npx hyperframes check (84/84 contrast checks passed), trimmed the audio slot to the 14.76 s voice length, rendered.",
    ],
    metrics: [
      ["Render time", "14.5 s on an M4 MacBook (hardware GPU)"],
      ["Output", "1080×1920, 30 fps, H.264 + AAC, 15.0 s, 1.6 MB"],
      ["Transcription", "whisper.cpp small.en, local, 37 words"],
      ["Tokens / cost", "Not measured: built inside a larger agent session with no per-recipe counter"],
    ],
    notes: [
      "Check the transcript before you trust it. Numbers and product names are where Whisper slips.",
      "Every <audio> needs an id or the HyperFrames mixer skips it.",
      "Keep captions in the middle-lower area. The bottom ~15% sits under platform UI on Reels and Shorts.",
    ],
    faqs: [
      {
        q: "Can I use a better voice?",
        a: "Yes. Swap assets/vo.wav for any recording or TTS output, rerun npx hyperframes transcribe on it, and paste the new word timings into the W array.",
      },
      {
        q: "Are the captions burned in?",
        a: "Yes, they are part of the video. The transcript is also on this page as text.",
      },
      {
        q: "Does this need an API key?",
        a: "Not for rendering. The voice, the transcription and the render all run locally. You only need a model to write the HTML.",
      },
    ],
    repoPath: "captioned-vertical-clip",
    transcript:
      "I made this video without opening a video editor. I gave Claude Opus 5.5 one prompt. It wrote HTML, and HyperFrames rendered it to MP4. The captions, the voice, the motion. All local. Here is the exact recipe.",
  },
];

export const getRecipe = (slug: string) => RECIPES.find((r) => r.slug === slug);

export function videoJsonLd(r: Recipe, video: RecipeVideo, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${r.title} (${video.label})`,
    description: r.summary,
    contentUrl: `${siteUrl}${video.src}`,
    thumbnailUrl: `${siteUrl}${video.poster}`,
    uploadDate: r.uploadDate,
    duration: isoDuration(video.seconds),
    width: video.width,
    height: video.height,
  };
}
