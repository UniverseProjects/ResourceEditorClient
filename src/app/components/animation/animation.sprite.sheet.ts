import {AnimationFrame} from './animation.frame';
import {C} from '../../common/common';

export class AnimationSpriteSheet {

  readonly image: HTMLImageElement = new Image();

  private frames: { [sequenceKey: string]: AnimationFrame[] } = {};
  private imageUrl: string;

  constructor(imageUrl: string) {
    if (C.emptyStr(imageUrl)) {
      throw new Error('Image URL must be provided');
    }
    this.imageUrl = imageUrl;
  }

  loadImage(onReady?: () => void, onError?: () => void) {
    this.image.onload = () => {
      if (onReady) {
        onReady();
      }
    };
    this.image.onerror = () => {
      console.error("Failed to load image: " + this.imageUrl);
      if (onError) {
        onError();
      }
    };
    this.image.src = this.imageUrl;
  }

  addFrames(sequenceKey: string, frames: AnimationFrame[]) {
    frames.forEach((frame) => this.addFrame(sequenceKey, frame));
  }

  addFrame(sequenceKey: string, frame: AnimationFrame) {
    if (C.emptyStr(sequenceKey)) {
      throw new Error('Sequence key can\'t be empty');
    }
    if (!C.defined(frame)) {
      throw new Error('Frame can\'t be undefined');
    }
    if (!this.frames[sequenceKey]) {
      this.frames[sequenceKey] = [frame];
    }
    else {
      this.frames[sequenceKey].push(frame);
    }
  }

  getFrame(sequenceKey: string, frameIndex: number): AnimationFrame {
    if (C.emptyStr(sequenceKey)) {
        throw new Error('Sequence key can\'t be empty');
    }
    let sequence = this.frames[sequenceKey];
    if (!sequence) {
      throw new Error('Sequence not found: ' + sequenceKey);
    }
    if (frameIndex < 0 || frameIndex > sequence.length - 1) {
      throw new Error('Invalid frame index (' + frameIndex + ') in sequence: ' + sequenceKey)
    }
    return sequence[frameIndex];
  }

  getFrameCount(sequenceKey: string): number {
    if (C.emptyStr(sequenceKey)) {
      throw new Error('Sequence key can\'t be empty');
    }
    let sequence = this.frames[sequenceKey];
    if (!sequence) {
      throw new Error('Sequence not found: ' + sequenceKey);
    }
    return sequence.length;
  }

}
