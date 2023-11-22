"use client";
import { CardUsers } from "@/components/ui/card-users";
import { User } from "@/models/user";
import { env } from "@/utils/env";
import cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    async function t() {
      const at = cookies.get("at");
      await fetch(env.api + "/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      })
        .then(async (res) => {
            if(res.status !== 200){
            return toast.error("Erro ao buscar usuários!")
          }
          const data: { data: User[] } = await res.json();
          setUsers(data.data.filter((e) => e.role === "USER" && !e.deletedAt))
        });
      };  
    t();
  }, []);

  return (
    <div className="min-h-screen flex items-center px-4 justify-center">
      <div className="flex items-center flex-wrap w-full gap-10 justify-center">
        {users &&
          users.map((e, i) => {
            return <CardUsers data={e} key={i} setUsers={setUsers} />;
          })}
      </div>
    </div>
  );
}
