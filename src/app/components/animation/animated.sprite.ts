import {AnimationSpriteSheet} from './animation.sprite.sheet';
import {C} from '../../common/common';

export class AnimatedSprite {

  x: number = 0;
  y: number = 0;

  private spriteSheet: AnimationSpriteSheet;
  private sequenceName: string;
  private currentFrameIdx = 0;

  constructor(spriteSheet: AnimationSpriteSheet, sequenceName: string) {
    this.spriteSheet = C.checkDefined(spriteSheet);
    this.sequenceName = C.checkNotEmpty(sequenceName);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    this.currentFrameIdx++;
    if (this.currentFrameIdx >= this.spriteSheet.getFrameCount(this.sequenceName)) {
      this.currentFrameIdx = 0;
    }
    let fr = this.spriteSheet.getFrame(this.sequenceName, this.currentFrameIdx);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(this.spriteSheet.image, fr.x, fr.y, fr.w, fr.h, fr.ox, fr.oy, fr.w, fr.h);
    ctx.restore();
  }

}
