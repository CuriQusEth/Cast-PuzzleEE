export type TileType = 'empty' | 'wall' | 'water' | 'brambles' | 'goal' | 'ice' | 'burnt';

export interface Entity {
  id: string;
  type: 'player' | 'box' | 'manaOrb';
  x: number;
  y: number;
}

export interface LevelData {
  id: number;
  grid: TileType[][];
  initialEntities: Entity[];
  targetStars: { [stars: number]: number }; // steps required to get stars (e.g. 3 stars = 5 casts)
  startMana: number;
}

export const LEVELS: Record<number, LevelData> = {
  1: {
    id: 1,
    startMana: 10,
    targetStars: { 3: 1, 2: 2, 1: 3 },
    grid: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'empty', 'empty', 'brambles', 'empty', 'goal', 'wall'],
      ['wall', 'empty', 'wall', 'wall', 'empty', 'empty', 'wall'],
      ['wall', 'empty', 'brambles', 'brambles', 'empty', 'empty', 'wall'],
      ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    initialEntities: [
      { id: 'p1', type: 'player', x: 1, y: 1 }
    ]
  },
  2: {
    id: 2,
    startMana: 15,
    targetStars: { 3: 2, 2: 4, 1: 5 },
    grid: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'empty', 'water', 'water', 'goal', 'wall'],
      ['wall', 'empty', 'empty', 'water', 'wall', 'wall'],
      ['wall', 'brambles', 'empty', 'empty', 'empty', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    initialEntities: [
      { id: 'p1', type: 'player', x: 1, y: 3 },
      { id: 'box1', type: 'box', x: 2, y: 3 }
    ]
  }
};
