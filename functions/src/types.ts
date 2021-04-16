export type scoreDataItem = {
  music_id?: number;
  diff: number;
  level: number;
  music_name: string;
  artist_name: string;
  genre_name: string;
  boss_level?: number;
  level_name?: string;
  over_damage?: string;
  battle_score?: number;
  technical_score: number;
  is_full_bell?: boolean;
  is_full_combo?: boolean;
  is_all_break?: boolean;
  rank: string | null;
  ab_lamp?: string;
  fb_lamp?: string;
};

export type scoreData = {
  [key: string]: scoreDataItem;
};

export type ratingScoreDataItem = {
  name: string;
  diff: number;
  score: number;
  genre?: string;
  artist?: string;
};

export type ratingScoreData = {
  [key: string]: scoreDataItem[];
  new: scoreDataItem[];
  best: scoreDataItem[];
  recent: scoreDataItem[];
  candidate: scoreDataItem[];
};

export type updateRatingDataRequestBody = {
  [key: string]: string | ratingScoreDataItem[];
  key: string;
  new: ratingScoreDataItem[];
  best: ratingScoreDataItem[];
  recent: ratingScoreDataItem[];
  candidate: ratingScoreDataItem[];
};
