import { useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  useMyProfile,
  useUploadProfileImage,
  useDeleteProfileImage,
} from "@/api/hooks/profiles/useMyProfile";
import { useUnreadCount } from "@/api/hooks/messages/useMessages";
import { PATHS } from "@/routes/paths";
import RoleBadge from "@components/common/RoleBadge";
import MemberTypeBadge from "@components/common/MemberTypeBadge";
import { AddAPhotoIcon, DeleteIcon, PersonIcon } from "@assets/icons";
import DeleteConfirmModal from "@components/common/DeleteConfirmModal";

const NAV_ITEMS = [
  { label: "내 정보", to: PATHS.MYPAGE, icon: "manage_accounts", end: true },
  { label: "내가 쓴 글", to: PATHS.MYPAGE_POSTS, icon: "article", end: false },
  { label: "쪽지함", to: PATHS.MYPAGE_MESSAGES, icon: "mail", end: false },
] as const;

export default function MyPageLayout() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile(user?.id);
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);
  const uploadImage = useUploadProfileImage();
  const deleteImage = useDeleteProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    e.target.value = "";
    uploadImage.mutate({ userId: user.id, file });
  }

  function handleDeleteConfirm() {
    if (!user?.id) return;
    deleteImage.mutate(
      { userId: user.id },
      { onSuccess: () => setShowDeleteModal(false) },
    );
  }

  const avatarBusy = uploadImage.isPending || deleteImage.isPending;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 md:pb-12">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          {/* 사이드바 */}
          <aside className="w-full md:w-64 md:shrink-0 space-y-2 md:space-y-3 md:sticky md:top-24">
            {/* 프로필 카드 */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-card p-5">
              {isLoading || !profile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-20 w-20 rounded-full bg-surface-container animate-pulse" />
                  <div className="h-4 w-24 rounded-full bg-surface-container animate-pulse" />
                </div>
              ) : (
                <div className="flex flex-row md:flex-col md:items-center md:text-center gap-3">
                  <div className="relative">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-outline-variant flex items-center justify-center">
                        <PersonIcon className="w-14 h-14 text-white" />
                      </div>
                    )}
                    {profile.avatar_url ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={avatarBusy}
                          className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                          <DeleteIcon className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={avatarBusy}
                          className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-outline text-white flex items-center justify-center shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                          <AddAPhotoIcon className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarBusy}
                        className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-outline text-white flex items-center justify-center shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        <AddAPhotoIcon className="w-3 h-3" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-black font-headline text-on-surface">
                      {profile.name}
                    </h1>
                    <div className="flex flex-wrap gap-1.5 mt-2 md:justify-center">
                      <RoleBadge role={profile.role} showAll />
                      <MemberTypeBadge memberType={profile.member_type} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 세로 네비게이션 */}
            <nav className="bg-surface-container-lowest rounded-2xl shadow-card p-2 flex flex-row md:flex-col gap-1 overflow-x-auto">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-primary-container text-white"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  {item.label}
                  {item.icon === "mail" && unreadCount > 0 && (
                    <span className="ml-auto text-[10px] font-black bg-error text-white rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* 콘텐츠 */}
          <main className="flex-1 min-w-0 w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          title="프로필 사진 삭제"
          description="삭제한 사진은 복구할 수 없습니다. 정말 삭제하시겠습니까?"
          isPending={deleteImage.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
