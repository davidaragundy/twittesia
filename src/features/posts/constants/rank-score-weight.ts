// Popularity is worth more than any creation time in seconds, which stays under 10¹⁰ until the
// year 2286, so a rank orders by score first and by recency among equal scores
export const RANK_SCORE_WEIGHT = 10_000_000_000;
