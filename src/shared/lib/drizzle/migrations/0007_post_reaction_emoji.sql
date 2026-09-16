-- Reactions stored the key of one of eight fixed emoji; they now store the emoji itself
UPDATE "post_reaction" SET "reaction" = CASE "reaction"
  WHEN 'thumbs-up' THEN '👍'
  WHEN 'heart' THEN '❤️'
  WHEN 'laugh' THEN '😂'
  WHEN 'fire' THEN '🔥'
  WHEN 'eyes' THEN '👀'
  WHEN 'party' THEN '🎉'
  WHEN 'mind-blown' THEN '🤯'
  WHEN 'sad' THEN '😢'
  ELSE "reaction"
END;
