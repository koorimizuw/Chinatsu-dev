export interface PlaylogDataItem {
  diff: number;
  is_over_damage_new_record: boolean;
  damage_count: number;
  fb_lamp: string | null;
  is_battle_new_record: boolean;
  battle_score: number;
  rank: string | null;
  boss_level: number;
  is_technical_new_record: boolean;
  bell_count: number;
  is_full_combo: boolean;
  genre_name: string;
  ab_lamp?: string | null;
  boss_chara: string;
  is_full_bell: boolean;
  max_combo: number;
  over_damage: string;
  play_date: string;
  rate_hold: string;
  rate_side_hold: string;
  is_all_break: boolean;
  music_name: string;
  technical_score: number;
  total_bell_count: number;
  judge_break: number;
  judge_hit: number;
  level: number;
  rate_side_tap: string;
  judge_critical_break: number;
  level_name: string;
  judge_miss: number;
  place_name: string;
  rate_tap: string;
  music_id: number;
  rate_flick: string;
}

export type PlaylogData = PlaylogDataItem[];
