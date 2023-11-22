import { AuthContext } from "@/contexts/auth";
import { SetModel } from "@/models/set";
import { Workout } from "@/models/workout";
import { env } from "@/utils/env";
import {
  ChevronDownIcon,
  HomeIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";
import { motion } from "framer-motion";
import cookies from "js-cookie";
import Link from "next/link";
import { useContext, useState } from "react";

export function WorkoutCard({
  workout,
  t,
  z,
}: {
  workout: Workout;
  t: () => Promise<void>;
  z: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const { user, refreshToken } = useContext(AuthContext);

  const handleRemove = async (id: string) => {
    const at = cookies.get("at");

    await fetch(env.api + `/workout/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${at}`,
      },
    }).finally(async () => {
      if (user?.role === "INSTRUCTOR") t();
      else if (user?.role === "USER") z();
    });
  };

  const handleActiveWorkout = async () => {
    const at = cookies.get("at");
    await fetch(env.api + `/workout/active`, {
      method: "POST",
      body: JSON.stringify({ userId: workout.userId, workoutId: workout.id }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${at}`,
      },
    }).then((res) => refreshToken());
  };

  return (
    <motion.div
      initial={false}
      animate={{
        height: open ? "auto" : "4rem",
      }}
      className="w-full border border-black/20 shadow drop-shadow-md  overflow-hidden bg-dark/70 rounded-md "
    >
      <div className="w-full flex px-4 bg-dark items-center justify-between h-[4rem]">
        <div className="flex items-center gap-5">
          {workout.active === false ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (user?.role !== "USER") {
                  return;
                }
                handleActiveWorkout();
              }}
            >
              <HomeIcon />
            </button>
          ) : (
            <HomeIcon color="#EB1D63" />
          )}
          <Link href={`/app/workouts/edit/${workout.id}`}>
            <Pencil2Icon />
          </Link>

          <h1 className="font-medium  truncate">{workout.name}</h1>
        </div>
        <div className="flex gap-5">
          <div className="text-sm text-end flex justify-center flex-col">
            <h1 className="font-medium hidden lg:block">
              Professor: {workout.instructor.name}
            </h1>
            <h2 className="font-medium text-xs">
              Criado em{" "}
              {workout
                ? new Date(workout?.createdAt).toLocaleDateString("pt-BR")
                : new Date().toLocaleDateString("pt-BR")}
            </h2>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={(e) => setOpen(!open)}>
              <ChevronDownIcon className="scale-150" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemove(workout.id);
              }}
              className=" flex justify-center items-center w-fit p-1   rounded-md "
            >
              <TrashIcon color="#EB1D63" className=" w-5 h-5" />{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full py-4 justify-center gap-10 px-4">
        {/* 'BACK' | 'CHEST' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'ABS'; */}
        <div className="w-full  flex  items-center gap-2 ">
          <ul className="flex h-full w-full flex-col gap-5   flex-1  ">
            {workout?.sets.filter(
              (set) => set.day === "SUNDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex flex-col">
                <h1 className="font-medium text-sm  w-full  text-opacity-70 ">
                  Domingo
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "SUNDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}
            {workout?.sets.filter(
              (set) => set.day === "MONDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex  flex-col">
                <h1 className="font-medium text-sm  w-full text-opacity-70 ">
                  Segunda
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "MONDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}
            {workout?.sets.filter(
              (set) => set.day === "TUESDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex  flex-col">
                <h1 className="font-medium text-sm  w-full text-opacity-70 ">
                  Terça
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "TUESDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}
            {workout?.sets.filter(
              (set) => set.day === "WEDNESDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex  flex-col">
                <h1 className="font-medium text-sm  w-full text-opacity-70 ">
                  Quarta
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "WEDNESDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}

            {workout?.sets.filter(
              (set) => set.day === "THURSDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex  flex-col">
                <h1 className="font-medium text-sm  w-full text-opacity-70 ">
                  Quinta
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "THURSDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}

            {workout?.sets.filter(
              (set) => set.day === "FRIDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex  flex-col">
                <h1 className="font-medium text-sm  w-full text-opacity-70 ">
                  Sexta
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "FRIDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}

            {workout?.sets.filter(
              (set) => set.day === "SATURDAY" && !set.deletedAt
            ).length > 0 && (
              <ul className="space-y-2 flex  flex-col">
                <h1 className="font-medium text-sm  w-full text-opacity-70 ">
                  Sábado
                </h1>
                <div className="flex gap-5 flex-wrap  ">
                  {workout?.sets
                    ?.sort((a, b) => b.type.length - a.type.length)
                    .map((set, i) => {
                      if (set.day === "SATURDAY") {
                        return <SetLi key={i} set={set} />;
                      }
                    })}
                </div>
              </ul>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  );

  function SetLi({ set }: { set: SetModel }) {
    return (
      <li className="flex max-w-[10rem] w-full rounded-md   bg-white/10 px-4 items-center  justify-between text-sm">
        <div className="flex items-center flex-col justify-between w-full  py-1 gap-2">
          <h2 className="font-medium truncate break-keep">
            {set.exercise.name}
          </h2>
          <div className="flex flex-col">
            <div
              className={clsx(
                "text-xs font-semibold flex items-center gap-2  px-2 py-[2px] rounded-md",
                {
                  "text-red-500 bg-black/50": set.type === "ARMS",
                  "text-blue-500 bg-black/50": set.type === "BACK",
                  "text-green-500 bg-black/50": set.type === "LEGS",
                  "text-yellow-500 bg-black/50": set.type === "SHOULDERS",
                  "text-primary bg-black/50 ": set.type === "CHEST",
                  "text-purple-500 bg-black/50": set.type === "ABS",
                }
              )}
            >
              {set.type === "ABS"
                ? "Abdominal".toUpperCase()
                : set.type === "ARMS"
                ? "Braço".toUpperCase()
                : set.type === "BACK"
                ? "Costas".toUpperCase()
                : set.type === "CHEST"
                ? "Peito".toUpperCase()
                : set.type === "LEGS"
                ? "Perna".toUpperCase()
                : set.type === "SHOULDERS"
                ? "Ombro".toUpperCase()
                : "N/A"}
              <span className="text-xs leading-[4px]">
                {set.series}x{set.reps}
              </span>
              {set.weight && (
                <>
                  <span className="text-xs leading-[4px]">/</span>
                  <span className="text-xs leading-[4px]">{set.weight}kg</span>
                </>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  }
}
