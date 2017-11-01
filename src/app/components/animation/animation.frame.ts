export class AnimationFrame {

  x: number;
  y: number;
  w: number;
  h: number;
  ox: number;
  oy: number;
  d: number;

  constructor(x: number, y: number, w: number, h: number, ox: number, oy: number, d: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.ox = ox;
    this.oy = oy;
    this.d = d;
  }

}
