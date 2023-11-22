"use client";
import { History } from "@/models/history";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { SVGStar } from "./svg-star";
export function StarsHistory({ history }: { history: History }) {
  const [stars, setStars] = useState(history.stars || 0);

  return (
    <AnimatePresence mode="popLayout" initial={false} presenceAffectsLayout>
      <motion.div
        layout
        initial={{ opacity: 0, width: "auto" }}
        animate={{ opacity: 1, width: "auto" }}
        transition={{ duration: 1, delay: 0.3, type: "spring" }}
        className="flex overflow-hidden w-full justify-start space-x-2 "
      >
        <SVGStar id={history.id} setStars={setStars} stars={stars} index={1} />
        <SVGStar id={history.id} setStars={setStars} stars={stars} index={2} />
        <SVGStar id={history.id} setStars={setStars} stars={stars} index={3} />
        <SVGStar id={history.id} setStars={setStars} stars={stars} index={4} />
        <SVGStar id={history.id} setStars={setStars} stars={stars} index={5} />
      </motion.div>
    </AnimatePresence>
  );
}
