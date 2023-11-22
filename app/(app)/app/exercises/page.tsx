"use client";
import { CardExercise } from "@/components/ui/card-exercises";
import { Input } from "@/components/ui/input";
import { Exercise } from "@/models/exercise";
import { env } from "@/utils/env";
import cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Page() {
  const [exercise, setExercise] = useState<Exercise[]>();

  useEffect(() => {
    async function t() {
      const at = cookies.get("at");
      await fetch(env.api + "/exercise", {
        method: "GET",
        headers: {
          authorization: "Bearer " + at,
        },
      })
        .then((res) => res.json())
        .then((res: { data: Exercise[] }) =>
          setExercise(res.data.filter((e) => !e.deletedAt))
        );
    }
    t();
  }, []);

  const [filter, setFilter] = useState<string>("");

  return (
    <div className="w-full min-h-screen  flex flex-col justify-center items-center space-y-4  px-4 py-20 ">
      <div className="w-full flex items-center justify-center ">
        <Input
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar exercício"
          className="!bg-dark w-full sm:max-w-sm "
        />
      </div>
      <div className="w-full flex flex-wrap justify-center gap-4 ">
        {filter.length === 0 &&
          exercise &&
          exercise.map((e, i) => {
            return <CardExercise key={i} data={e} setExercise={setExercise} />;
          })}
        {filter.length > 0 &&
          exercise &&
          exercise.map((e, i) => {
            if (e.name.includes(filter)) {
              return (
                <CardExercise key={i} data={e} setExercise={setExercise} />
              );
            }
          })}

        {filter.length > 0 &&
          exercise &&
          exercise.filter((e) => e.name.includes(filter)).length === 0 && (
            <div className="w-full text-center  text-white">
              Nenhum exercício encontrado
            </div>
          )}
      </div>
    </div>
  );
}
