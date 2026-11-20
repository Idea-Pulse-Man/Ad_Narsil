/**
 * Web stand-in for museum-app/src/data/index.ts. The app's barrel loads the
 * whole member catalog; the admin needs only the Artwork type and the eras.
 */
export type { Artwork } from "./types";
export { historyEras } from "./history";
