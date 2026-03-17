import * as THREE from 'three';
import type { CameraShot } from './shots';
import type { EasingFunction } from './easing';
import { defaultEasing } from './easing';

// ============================================================================
// Camera Director
// ============================================================================

export interface CameraDirectorOptions {
  /** Whether to automatically advance through shots. Default: true */
  autoAdvance?: boolean;
  /** Whether to loop back to first shot after last. Default: true */
  loop?: boolean;
  /** Enable keyboard controls for manual shot switching. Default: true */
  enableKeyboard?: boolean;
}

interface TransitionState {
  fromPosition: THREE.Vector3;
  fromLookAt: THREE.Vector3;
  toShot: CameraShot;
  startTime: number;
  duration: number;
  easing: EasingFunction;
}

/**
 * Manages camera shots and smooth transitions between them.
 * 
 * Usage:
 * ```typescript
 * const director = new CameraDirector(camera, shots);
 * // In animation loop:
 * director.update(elapsedTime);
 * ```
 */
export class CameraDirector {
  private camera: THREE.PerspectiveCamera;
  private shots: CameraShot[];
  private options: Required<CameraDirectorOptions>;

  private currentShotIndex = 0;
  private shotStartTime = 0;
  private transition: TransitionState | null = null;
  private isPlaying = true;

  // For smooth lookAt interpolation
  private currentLookAt = new THREE.Vector3();

  constructor(
    camera: THREE.PerspectiveCamera,
    shots: CameraShot[],
    options: CameraDirectorOptions = {}
  ) {
    this.camera = camera;
    this.shots = shots;
    this.options = {
      autoAdvance: options.autoAdvance ?? true,
      loop: options.loop ?? true,
      enableKeyboard: options.enableKeyboard ?? true,
    };

    if (shots.length === 0) {
      throw new Error('CameraDirector requires at least one shot');
    }

    // Initialize to first shot (no transition)
    this.applyShot(this.shots[0]);
    this.currentLookAt.copy(this.shots[0].lookAt);

    if (this.options.enableKeyboard) {
      this.setupKeyboardControls();
    }
  }

  /**
   * Update camera position/rotation. Call this every frame.
   * @param time - Elapsed time in seconds (from clock.getElapsedTime())
   */
  update(time: number): void {
    if (!this.isPlaying) return;

    // Handle active transition
    if (this.transition) {
      this.updateTransition(time);
      return;
    }

    // Check if current shot duration has elapsed
    if (this.options.autoAdvance) {
      const currentShot = this.shots[this.currentShotIndex];
      const elapsed = time - this.shotStartTime;

      if (elapsed >= currentShot.duration) {
        this.advanceToNextShot(time);
      }
    }
  }

  /**
   * Manually go to a specific shot by index
   */
  goToShot(index: number, time: number): void {
    if (index < 0 || index >= this.shots.length) return;
    this.startTransition(index, time);
  }

  /**
   * Manually go to a specific shot by name
   */
  goToShotByName(name: string, time: number): void {
    const index = this.shots.findIndex((s) => s.name === name);
    if (index !== -1) {
      this.goToShot(index, time);
    }
  }

  /**
   * Go to next shot
   */
  nextShot(time: number): void {
    this.advanceToNextShot(time);
  }

  /**
   * Go to previous shot
   */
  previousShot(time: number): void {
    let prevIndex = this.currentShotIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.options.loop ? this.shots.length - 1 : 0;
    }
    this.startTransition(prevIndex, time);
  }

  /**
   * Pause automatic shot advancement
   */
  pause(): void {
    this.isPlaying = false;
  }

  /**
   * Resume automatic shot advancement
   */
  play(): void {
    this.isPlaying = true;
  }

  /**
   * Get current shot info
   */
  getCurrentShot(): CameraShot {
    return this.shots[this.currentShotIndex];
  }

  /**
   * Check if currently transitioning
   */
  isTransitioning(): boolean {
    return this.transition !== null;
  }

  // ===========================================================================
  // Private Methods
  // ===========================================================================

  private advanceToNextShot(time: number): void {
    let nextIndex = this.currentShotIndex + 1;

    if (nextIndex >= this.shots.length) {
      if (this.options.loop) {
        nextIndex = 0;
      } else {
        return; // Stay on last shot
      }
    }

    this.startTransition(nextIndex, time);
  }

  private startTransition(toIndex: number, time: number): void {
    const toShot = this.shots[toIndex];
    const transitionDuration = toShot.transitionIn ?? 1.5;

    this.transition = {
      fromPosition: this.camera.position.clone(),
      fromLookAt: this.currentLookAt.clone(),
      toShot,
      startTime: time,
      duration: transitionDuration,
      easing: toShot.easing ?? defaultEasing,
    };

    this.currentShotIndex = toIndex;
  }

  private updateTransition(time: number): void {
    if (!this.transition) return;

    const { fromPosition, fromLookAt, toShot, startTime, duration, easing } =
      this.transition;
    const elapsed = time - startTime;
    const rawT = Math.min(elapsed / duration, 1);
    const t = easing(rawT);

    // Interpolate position
    this.camera.position.lerpVectors(fromPosition, toShot.position, t);

    // Interpolate lookAt target
    this.currentLookAt.lerpVectors(fromLookAt, toShot.lookAt, t);
    this.camera.lookAt(this.currentLookAt);

    // Transition complete
    if (rawT >= 1) {
      this.transition = null;
      this.shotStartTime = time;
      this.applyShot(toShot);
    }
  }

  private applyShot(shot: CameraShot): void {
    this.camera.position.copy(shot.position);
    this.camera.lookAt(shot.lookAt);
    this.currentLookAt.copy(shot.lookAt);
  }

  private setupKeyboardControls(): void {
    window.addEventListener('keydown', (e) => {
      // We need the current time, but we don't have clock access here.
      // Use performance.now() converted to seconds as a workaround.
      // Note: This assumes the animation clock started at page load.
      // For more accuracy, you could pass a getTime callback to the constructor.
      const time = performance.now() / 1000;

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
          this.nextShot(time);
          break;
        case 'ArrowLeft':
        case 'p':
          this.previousShot(time);
          break;
        case ' ':
          e.preventDefault();
          if (this.isPlaying) {
            this.pause();
            console.log(`[CameraDirector] Paused on: ${this.getCurrentShot().name}`);
          } else {
            this.play();
            console.log(`[CameraDirector] Playing`);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const shotIndex = parseInt(e.key) - 1;
          if (shotIndex < this.shots.length) {
            this.goToShot(shotIndex, time);
          }
          break;
      }
    });

    console.log('[CameraDirector] Keyboard controls enabled:');
    console.log('  Arrow Right / N: Next shot');
    console.log('  Arrow Left / P: Previous shot');
    console.log('  Space: Pause/Play');
    console.log('  1-9: Jump to shot by number');
  }
}
