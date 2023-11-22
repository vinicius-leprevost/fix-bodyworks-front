"use client";

import { WorkoutCard } from "@/components/ui/card-workouts";
import { AuthContext } from "@/contexts/auth";
import { Workout } from "@/models/workout";
import { env } from "@/utils/env";
import { AnimatePresence, motion } from "framer-motion";
import cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState<Workout[]>();

  const t = async function () {
    const at = cookies.get("at");
    await fetch(env.api + `/workout/instructor/${user!.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${at}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setWorkouts(res.data);
      });
  };
  const z = async function () {
    const at = cookies.get("at");
    await fetch(env.api + `/workout/user/${user!.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${at}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setWorkouts(res.data);
      });
  };

  useEffect(
    () => {
      if (user && user.role === "INSTRUCTOR") t();
      else if (user && user.role === "USER") z();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );
  return (
    <div className="flex flex-col w-full py-20 lg:px-20 sm:px-10 px-4">
      <h1 className="text-2xl ">Meus treinos</h1>
      <motion.div layout className="mt-10 space-y-5">
        <AnimatePresence mode="popLayout">
          {workouts &&
            workouts.map((workout, i) => {
              return <WorkoutCard key={i} t={t} z={z} workout={workout} />;
            })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
