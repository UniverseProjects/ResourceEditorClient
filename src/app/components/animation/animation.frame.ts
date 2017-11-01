export class AnimationFrame {

  x: number;
  y: number;
  w: number;
  h: number;
  ox: number;
  oy: number;

  constructor(x: number, y: number, w: number, h: number, ox: number, oy: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ox = ox;
    this.oy = oy;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

}
