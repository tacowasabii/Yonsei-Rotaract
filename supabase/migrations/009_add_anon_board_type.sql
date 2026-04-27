ALTER TABLE public.posts
  DROP CONSTRAINT posts_board_type_check,
  ADD CONSTRAINT posts_board_type_check
    CHECK (board_type IN ('free', 'promo', 'anon'));
