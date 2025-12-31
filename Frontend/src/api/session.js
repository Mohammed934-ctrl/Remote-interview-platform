import axiosinstance from "../lib/axios.js";

export const SessionApi = {
  createSession: async (data) => {
    const response = await axiosinstance.post("/sessions", data);
    return response.data;
  },
  getActiveSession: async () => {
    const response = await axiosinstance.get("/sessions/active");
    return response.data;
  },
  getRecentSession: async () => {
    const response = await axiosinstance.get("/sessions/my-recent-session");
    return response.data;
  },
  getSessionById: async (id) => {
    const response = await axiosinstance.get(`/sessions/${id}`);
    return response.data;
  },
  joinSession: async (id) => {
    const response = await axiosinstance.post(`/sessions/${id}/join`);
    return response.data;
  },
  EndSession: async (id) => {
    const response = await axiosinstance.post(`/sessions/${id}/end`);
    return response.data;
  },
  getStreamToken: async () => {
    const response = await axiosinstance.get(`/chat/token`);
    return response.data;
  },
};
