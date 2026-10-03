/**
 * Plain mutable objects read inside useFrame — avoids React re-renders at 60fps.
 */
export const heroState = {
  /** 0 → 1 across the hero's scroll distance */
  progress: 0,
  /** Normalised pointer, -1 → 1 */
  mouseX: 0,
  mouseY: 0,
};
