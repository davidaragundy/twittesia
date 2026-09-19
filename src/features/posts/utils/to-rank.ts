import { RANK_SCORE_WEIGHT } from "@/features/posts/constants/rank-score-weight";

interface Props {
  score: number;
  // Milliseconds since the epoch
  createdAt: number;
}

// Popularity and recency in one number the search index can sort on: score first, then the
// newest. It stays exact in a double for scores up to about 900,000.
export const toRank = ({ score, createdAt }: Props) =>
  score * RANK_SCORE_WEIGHT + Math.floor(createdAt / 1_000);
