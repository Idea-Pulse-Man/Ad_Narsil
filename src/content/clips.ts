/**
 * The app recordings and the iPhone bezel (brief §11). None exist yet: they
 * have to be recorded on a real iPhone or the Simulator from a demo account,
 * and the bezel comes from Apple Design Resources. The site never draws a
 * fake interface, so until `ready` is true Room II shows the moving wall
 * instead of a phone.
 *
 * To switch the phone on:
 * 1. Put each clip in public/clips/ as <name>.mp4 (H.264, ≤ 1.2 MB, no
 *    audio, +faststart), <name>.webm (VP9 or AV1) and <name>.avif (poster),
 *    about 886×1920 at 30 fps.
 * 2. Put Apple's bezel PNG in public/device/ and set its size and the
 *    screen's position inside it (in % of the bezel) below.
 * 3. Set `ready: true`.
 */
export type ClipName = "feed" | "placard" | "artist" | "fill" | "clean";

export const CLIPS = {
  ready: false,
  bezel: {
    src: "/device/iphone-bezel.png",
    width: 1022,
    height: 2082,
    /** The screen's box inside the bezel image, in %. */
    screen: { left: 5.2, top: 2.6, width: 89.6, height: 94.8, radius: "12% / 5.8%" },
  },
  clip: (name: ClipName) => ({ mp4: `/clips/${name}.mp4`, webm: `/clips/${name}.webm`, poster: `/clips/${name}.avif` }),
} as const;

/** Which clip each gesture in Room II plays, in the order of COPY.gallery.gestures. */
export const GESTURE_CLIPS: ClipName[] = ["feed", "placard", "artist", "fill", "clean"];
