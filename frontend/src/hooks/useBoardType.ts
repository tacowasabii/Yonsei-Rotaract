import { useLocation } from "react-router-dom";

export type BoardType = "free" | "promo" | "anon" | "notice";

interface BoardTypeResult {
  boardType: BoardType;
  boardLabel: string;
  boardDesc: string;
  isAnon: boolean;
  isPromo: boolean;
  isNoticeBoard: boolean;
}

const BOARD_META: Record<BoardType, { label: string; desc: string }> = {
  anon:   { label: "익명게시판", desc: "익명으로 자유롭게 소통하는 공간입니다." },
  promo:  { label: "홍보게시판", desc: "모집·홍보·나눔 등 공유하고 싶은 소식을 올려보세요." },
  notice: { label: "공지사항",   desc: "동아리 공지사항을 확인하세요." },
  free:   { label: "자유게시판", desc: "회원들과 자유롭게 소통하는 공간입니다." },
};

export function useBoardType(): BoardTypeResult {
  const { pathname } = useLocation();

  const isNoticeBoard = pathname.startsWith("/notice");
  const isAnon  = pathname.includes("/anon");
  const isPromo = pathname.includes("/promo");

  const boardType: BoardType = isNoticeBoard
    ? "notice"
    : isAnon
      ? "anon"
      : isPromo
        ? "promo"
        : "free";

  const { label: boardLabel, desc: boardDesc } = BOARD_META[boardType];

  return { boardType, boardLabel, boardDesc, isAnon, isPromo, isNoticeBoard };
}
