import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReceivedMessages,
  fetchSentMessages,
  fetchUnreadCount,
  sendMessage,
  markAsRead,
  deleteMessageBySender,
  deleteMessageByRecipient,
  searchMembers,
} from "../../messages";
import type { Message, MemberSearchResult } from "../../types/message";

export function useReceivedMessages(userId: string | undefined) {
  return useQuery<Message[]>({
    queryKey: ["messages", "received", userId],
    queryFn: () => fetchReceivedMessages(userId!),
    enabled: !!userId,
  });
}

export function useSentMessages(userId: string | undefined) {
  return useQuery<Message[]>({
    queryKey: ["messages", "sent", userId],
    queryFn: () => fetchSentMessages(userId!),
    enabled: !!userId,
  });
}

export function useUnreadCount(userId: string | undefined) {
  return useQuery<number>({
    queryKey: ["messages", "unread", userId],
    queryFn: () => fetchUnreadCount(userId!),
    enabled: !!userId,
    refetchInterval: 60_000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      senderId,
      recipientId,
      title,
      content,
    }: {
      senderId: string;
      recipientId: string;
      title: string;
      content: string;
    }) => sendMessage(senderId, recipientId, title, content),
    onSuccess: (_data, { senderId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", "sent", senderId] });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId }: { messageId: string; userId: string }) =>
      markAsRead(messageId),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", "received", userId] });
      queryClient.invalidateQueries({ queryKey: ["messages", "unread", userId] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      box,
    }: {
      messageId: string;
      box: "received" | "sent";
      userId: string;
    }) =>
      box === "received"
        ? deleteMessageByRecipient(messageId)
        : deleteMessageBySender(messageId),
    onSuccess: (_data, { box, userId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", box, userId] });
      if (box === "received") {
        queryClient.invalidateQueries({ queryKey: ["messages", "unread", userId] });
      }
    },
  });
}

export function useSearchMembers(query: string) {
  return useQuery<MemberSearchResult[]>({
    queryKey: ["member-search", query],
    queryFn: () => searchMembers(query),
    enabled: query.trim().length >= 1,
    staleTime: 10_000,
  });
}
