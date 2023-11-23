"use client";
import { AuthContext } from "@/contexts/auth";
import { History } from "@/models/history";
import { SetModel } from "@/models/set";
import { env } from "@/utils/env";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./button";
import { SVGStar } from "./svg-star";
export function CardSet({
  finished,
  set,
  history,
}: {
  finished?: boolean;
  history?: History;
  set: SetModel;
}) {
  const handleSet = async () => {
    const at = cookies.get("at");
    await fetch(env.api + `/history`, {
      method: "POST",
      body: JSON.stringify({ setId: set.id, userId: set.userId }),
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        authorization: `Bearer ${at}`,
      },
    }).then((res) => {
      console.log(res);
      if (res.status !== 201) {
        return toast.error("Erro ao finalizar exercício!");
      }
      toast.success("Exercício finalizado com sucesso!");
      setMFinished(true);
      return;
    });
  };

  const [mFinished, setMFinished] = useState(finished);

  const [stars, setStars] = useState(0);
  const { refreshToken } = useContext(AuthContext);

  useEffect(() => {
    if (history) {
      setStars(history.stars || 0);
    }
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
      className={clsx(
        " rounded-md w-60 h-60 flex flex-col items-center justify-between p-2 transition-all duration-1000",
        {
          "bg-gray1": !mFinished,
          "bg-dark/90": mFinished,
        }
      )}
    >
      <h1
        className={clsx("font-medium text-xl mt-2 ", {
          "text-white": !mFinished,
          "text-primary": mFinished,
        })}
      >
        {set.exercise.name}
      </h1>
      <AnimatePresence mode="popLayout" presenceAffectsLayout>
        {mFinished && (
          <div className="w-full flex flex-col items-center space-y-6">
            <CheckCircledIcon className="text-primary accent-primary stroke-primary stroke-1 fill-primary w-24 h-24" />
            <motion.div
              layout
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 1, delay: 0.3, type: "spring" }}
              className="flex overflow-hidden w-full justify-center space-x-2 "
            >
              <SVGStar
                id={history ? history.id : ""}
                setStars={setStars}
                stars={stars}
                index={1}
              />
              <SVGStar
                id={history ? history.id : ""}
                setStars={setStars}
                stars={stars}
                index={2}
              />
              <SVGStar
                id={history ? history.id : ""}
                setStars={setStars}
                stars={stars}
                index={3}
              />
              <SVGStar
                id={history ? history.id : ""}
                setStars={setStars}
                stars={stars}
                index={4}
              />
              <SVGStar
                id={history ? history.id : ""}
                setStars={setStars}
                stars={stars}
                index={5}
              />
            </motion.div>
          </div>
        )}
        {mFinished && <div></div>}
        {!mFinished && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <p className="text-gray-400 text-sm">
                {set.series}x{set.reps}
              </p>
              {set.weight && (
                <p className="text-gray-400 text-sm">
                  {set.weight.toFixed(1)}kg
                </p>
              )}
            </motion.div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSet();
                setMFinished(true);
                refreshToken();
              }}
              intent="white"
              className="w-full"
            >
              Finalizar
            </Button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
