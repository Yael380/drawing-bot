export type ShapeType = 'rectangle' | 'triangle' | 'circle' | 'line';

export interface Command {
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  radius: number;
  y2: number;
  x2: number;
  strokeWidth:number;
}
