"use client";
import { AuthContext } from "@/contexts/auth";
import { env } from "@/utils/env";
import { motion } from "framer-motion";
import cookies from "js-cookie";
import { Dispatch, SetStateAction, useContext } from "react";
import { toast } from "react-toastify";

export const SVGStar = ({
  stars,
  index,
  setStars,
  id,
}: {
  stars: number;
  index: number;
  id: string;
  setStars: Dispatch<SetStateAction<number>>;
}) => {
  const { refreshToken } = useContext(AuthContext);
  async function updateStars() {
    if (stars === index) {
      setStars(0);
      const at = cookies.get("at");
      await fetch(env.api + `/history`, {
        method: "PATCH",
        body: JSON.stringify({ stars: 0, id }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      });
      await refreshToken();
    } else {
      setStars(index);
      const at = cookies.get("at");
      await fetch(env.api + `/history`, {
        method: "PATCH",
        body: JSON.stringify({ stars: index, id }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${at}`,
        },
      }).then((res) => {
        console.log(res);
        if (res.status !== 200) {
          return toast.error("Erro ao atualizar o feedback!");
        }
        toast.success("Feedback atualizado com sucesso!");

        refreshToken();
        return;
      });
    }
  }
  return (
    <motion.svg
      onClick={(e) => {
        e.preventDefault();
        updateStars();
      }}
      layout
      initial={{ opacity: 0, scale: 1.3, width: "2rem", height: "2rem" }}
      animate={{ opacity: 1, scale: 1.5, width: "2rem", height: "2rem" }}
      transition={{ duration: 0.3, type: "spring" }}
      className="appearance-none focus:outline-none focus:border-none"
      viewBox="-5 -5 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        layout
        initial={{ opacity: 0 }}
        animate={{
          fill: stars >= index ? "#eb1d63" : "#ffffff00",
          opacity: 1,
          strokeWidth: 0.5,
          stroke: stars >= index ? "#eb1d63" : "#fff",
          transition: {
            duration: 0.2,
            delay: stars >= index ? index * 0.01 : index > stars ? 0 : 0.2,
            type: "spring",
            bounce: 0.5,
          },
        }}
        whileTap={{
          fill: ["#fff", "#eb1d63"],
          stroke: ["#fff", "#eb1d63"],
          scale: [1, 1.5],
          transition: { duration: 0.3 },
        }}
        className="appearance-none focus:outline-none focus:border-none"
        whileHover={{
          fill: ["#eb1d63"],
          stroke: ["#eb1d63"],
          scale: [1, 1.2, 1],
          transition: { duration: 0.3 },
        }}
        d="M7.22303 0.665992C7.32551 0.419604 7.67454 0.419604 7.77702 0.665992L9.41343 4.60039C9.45663 4.70426 9.55432 4.77523 9.66645 4.78422L13.914 5.12475C14.18 5.14607 14.2878 5.47802 14.0852 5.65162L10.849 8.42374C10.7636 8.49692 10.7263 8.61176 10.7524 8.72118L11.7411 12.866C11.803 13.1256 11.5206 13.3308 11.2929 13.1917L7.6564 10.9705C7.5604 10.9119 7.43965 10.9119 7.34365 10.9705L3.70718 13.1917C3.47945 13.3308 3.19708 13.1256 3.25899 12.866L4.24769 8.72118C4.2738 8.61176 4.23648 8.49692 4.15105 8.42374L0.914889 5.65162C0.712228 5.47802 0.820086 5.14607 1.08608 5.12475L5.3336 4.78422C5.44573 4.77523 5.54342 4.70426 5.58662 4.60039L7.22303 0.665992Z"
      ></motion.path>
    </motion.svg>
  );
};
