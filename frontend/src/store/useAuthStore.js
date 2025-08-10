import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      const userData = res.data;
      
      // Store user data in localStorage for persistence
      if (userData) {
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
      
      set({ authUser: userData });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      // Clear localStorage on auth failure
      localStorage.removeItem('authUser');
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

    signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
      
      // Reset selected user to show NoChatSelected component after signup
      const { setSelectedUser } = useChatStore.getState();
      setSelectedUser(null);
      
      // Ensure smooth transition without page refresh
      window.history.replaceState(null, null, '/');
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },


    login: async(data) => {
        set({ isLoggingIn: true });
        try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully");

        get().connectSocket();
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isLoggingIn: false });
        }  
    },

    logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      
      // Clear selected user on logout
      const { setSelectedUser } = useChatStore.getState();
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
        } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response.data.message);
        } finally {
        set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;


        const socket = io(BASE_URL, {
            query: {
            userId: authUser._id,
            },
        });
        socket.connect(); 

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
        set({ socket: null });

    },

}));

