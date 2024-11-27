"use client";
import { useSocket } from "@/context/SocetContext";
import { useUser } from "@clerk/nextjs";
import Avatar from "@/components/Avatar";

const ListOnlineUsers = () => {
  const { user } = useUser();
  const { onlineUsers } = useSocket();

  if (!onlineUsers || onlineUsers.length === 0) {
    return <p className="text-center text-gray-500">Hozirda hech kim onlayn emas</p>;
  }

  return (
    <section className="flex border-b border-b-primary/10 w-full items-center pb-2">
      {onlineUsers.map((onlineUser) => {
        if (onlineUser.profile.id === user?.id) return null;
        return (
          <div
            key={onlineUser.userId}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <Avatar src={onlineUser.profile.imageUrl} />
            <div className="text-sm">
              {onlineUser.profile.fullName?.split(" ")[0] || "Ism mavjud emas"}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ListOnlineUsers;
