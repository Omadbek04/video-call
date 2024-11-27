"use client";

import { SocketContextProvider } from "@/context/SocetContext";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};

export default SocketProvider;
