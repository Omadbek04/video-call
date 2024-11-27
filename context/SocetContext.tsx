import { SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {
  onlineUsers : SocketUser[] | null
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUser] = useState<SocketUser[] | null>(null);
  
  // initializing a socket
  useEffect(() => {
    const newSocet = io();
    setSocket(newSocet);
    return () => {
      newSocet.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;

    if (socket.connected) {
      onConnected();
    }

    function onConnected() {
      setIsSocketConnected(true);
    }

    function onDisconnected() {
      setIsSocketConnected(false);
    }

    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnected);

    return () => {
      socket.off("connect", onConnected);
      socket.off("disconnect", onDisconnected);
    };
  }, [socket]);

  //set online users
  useEffect(() => {
    if (!socket || !isSocketConnected) {
      return;
    }
    socket.emit("addNewUser", user);
    socket.on("getUsers", (res) => {
      setOnlineUser(res);
    });
    return () => {
      socket.on("getUsers", (res) => {
        setOnlineUser(res);
      });
    }
  }, [socket, isSocketConnected, user]);

  return <SocketContext.Provider value={{ onlineUsers }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error(" useSocket must be used within a socketProvider");
  }
  return context;
};
