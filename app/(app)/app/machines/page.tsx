"use client";
import { CardMachines } from "@/components/ui/card-machines";
import { Machine } from "@/models/machine";
import { env } from "@/utils/env";
import cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [machines, setMachines] = useState<Machine[]>();

  useEffect(() => {
    async function t() {
      const at = cookies.get("at");
      await fetch(env.api + "/machine", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      })
        .then(async (res) =>{
          if(res.status !== 200){
           return toast.error("Erro ao buscar maquina!") 
          }
          const data: { data: Machine[] } = await res.json()
          setMachines(data.data.filter((e) => !e.deletedAt))
        }
        );
    }
    t();
  }, []);
  return (
    <div className="min-h-screen flex px-4 items-center justify-center">
      <div className="flex items-center w-full gap-10 flex-wrap justify-center">
        {machines &&
          machines.map((e, i) => {
            return <CardMachines setMachines={setMachines} data={e} key={i} />;
          })}
      </div>
    </div>
  );
}
