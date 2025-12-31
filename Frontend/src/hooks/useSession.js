import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SessionApi } from "../api/session.js";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createsession"],
    mutationFn: SessionApi.createSession,
    onError: () =>
      toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSession = () => {
  const result = useQuery({
    queryKey: ["activesession"],
    queryFn: SessionApi.getActiveSession,
  });

  return result;
};
export const useRecentSession = () => {
  const result = useQuery({
    queryKey: ["recentsession"],
    queryFn: SessionApi.getRecentSession,
  });

  return result;
};
export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => SessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  return result;
};

export const useJoinSession = (id) => {
  const result = useMutation({
    mutationKey: ["joinsession"],
    mutationFn: SessionApi.joinSession,
    onSuccess: () => toast.success("joined session successfully"),
    onError: () =>
      toast.error(error.response?.data?.message || "Failed to join session"),
  });
  return result;
};
export const useEndSession = (id) => {
  const result = useMutation({
    mutationKey: ["endsession"],
    mutationFn: SessionApi.EndSession,
    onSuccess: () => toast.success(" session ended successfully"),
    onError: () =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });
  return result;
};
