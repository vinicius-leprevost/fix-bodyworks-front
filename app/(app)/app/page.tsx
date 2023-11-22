"use client";

import { CardSet } from "@/components/ui/card-set";
import { AuthContext } from "@/contexts/auth";
import { SetModel } from "@/models/set";
import { env } from "@/utils/env";
import { AnimatePresence, motion } from "framer-motion";
import cookies from "js-cookie";
import Image from "next/image";
import { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export default function Page() {
  const { user } = useContext(AuthContext);
  const [sets, setSets] = useState<SetModel[]>();
  async function t() {
    const at = cookies.get("at");
    await fetch(env.api + `/set/user/${user!.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${at}`,
      },
    })
      .then(async (res) => {
        if(res.status !== 200){
          return toast.error("Erro ao buscar os treinos do dia!")
        }
        const data = await res.json();
        setSets(
          data.data.filter(
            (set: SetModel) => !set.deletedAt && set.workout?.active === true
          )
        );
      });
  }
  useEffect(
    () => {
      if (user && user.role === "USER" && sets === undefined) t();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  function Hour() {
    const [date, setDate] = useState(
      new Date()
        .toLocaleString("pt-BR", {
          dateStyle: "full",
          timeStyle: "medium",
        })[0]
        .toUpperCase() +
        new Date()
          .toLocaleString("pt-BR", {
            dateStyle: "full",
            timeStyle: "medium",
          })
          .slice(1)
    );

    useEffect(() => {
      setTimeout(() => {
        setDate(
          new Date()
            .toLocaleString("pt-BR", {
              dateStyle: "full",
              timeStyle: "medium",
            })[0]
            .toUpperCase() +
            new Date()
              .toLocaleString("pt-BR", {
                dateStyle: "full",
                timeStyle: "medium",
              })
              .slice(1)
        );
      }, 1000);
    }, [date]);
    return <>{date}</>;
  }

  useEffect(() => {
    console.log(user);
  }, [user]);
  const DT = memo(Hour);

  return (
    <div className="w-full flex-col flex space-y-10 min-h-full py-20 px-10 justify-center">
      {user && user.role === "USER" && (
        <h1 className="w-full  font-medium text-2xl">
          <DT />
        </h1>
      )}
      {user && user.role === "USER" && (
        <>
          <AnimatePresence mode="wait" presenceAffectsLayout>
            <motion.div className="flex justify-center sm:justify-between lg:justify-normal items-center flex-wrap gap-5 lg:gap-10 ">
              {sets?.map((set, i) => {
                const find = user.history.find(
                  (h) =>
                    h.setId === set.id &&
                    new Date(h.createdAt).toDateString() ===
                      new Date(set.createdAt).toDateString()
                );
                console.log(set.id, "find");
                console.log(new Date(set.createdAt).toDateString());
                if (find) {
                  return (
                    <CardSet
                      history={find}
                      finished
                      key={Math.random() * 1000}
                      set={set}
                    />
                  );
                }

                if (set.day === days[new Date().getDay()]) {
                  return <CardSet key={Math.random() * 1000} set={set} />;
                }
                return <></>;
              })}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {user?.role === "INSTRUCTOR" && (
        <>
          {/* INSTRUCTOR */}

          <div className="min-h-screen pb-36 flex flex-col justify-center items-center ">
            <Image
              className=""
              src="/assets/logoAdmInst.png"
              alt="logo"
              width={500}
              height={500}
              quality={100}
            />
            <h1 className="font-bold">Aqui você é a inspiração!</h1>
            <p className="max-w-sm  text-center ">
              Desperte o potencial máximo dos seus alunos e transforme cada
              sessão em uma experiência única e motivadora.
            </p>
          </div>
        </>
      )}

      {user?.role === "ADMIN" && (
        <div className="flex flex-col justify-center items-center">
          <Image
            className=""
            src="/assets/logo.png"
            alt="logo"
            width={600}
            height={600}
            quality={100}
          />
        </div>
      )}
    </div>
  );
}
