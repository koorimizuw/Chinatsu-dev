export type scoreDataItem = {
  music_id?: number;
  diff: number;
  level: number;
  name: string;
  artist_name: string;
  genre_name: string;
  boss_level: number;
  level_name: string;
  over_damage: string;
  battle_score: number;
  technical_score: number;
  is_full_bell: boolean;
  is_full_combo: boolean;
  is_all_break: boolean;
  rank: string;
  ab_lamp: string;
  fb_lamp: string;
};

export type scoreData = {
  [key: string]: scoreDataItem;
};
