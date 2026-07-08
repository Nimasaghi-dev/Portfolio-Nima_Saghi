"use client";

import { motion } from "motion/react";
import { site } from "@/data/portfolio";

/* Restrained syntax palette — brand accent + two muted code hues. */
const C = {
  kw: "text-accent", // keywords
  prop: "text-fg/85", // object keys
  str: "text-[#8ad0a0]", // strings
  val: "text-accent-bright", // booleans / numbers
  punc: "text-faint", // punctuation
  comment: "text-faint italic",
};

const lineVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.7 },
  },
};

/** The hero's signature element: a typed-in "developer" object. */
export function TerminalCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      className="surface-card w-full overflow-hidden rounded-xl shadow-2xl shadow-black/40"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-line bg-elevated/60 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-muted">developer.ts</span>
        <span className="ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-accent">
          TS
        </span>
      </div>

      {/* Code body */}
      <motion.pre
        variants={container}
        initial="hidden"
        animate="show"
        className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed sm:text-sm"
      >
        <code className="grid">
          <motion.span variants={lineVariants}>
            <span className={C.kw}>const</span>{" "}
            <span className="text-fg">developer</span>{" "}
            <span className={C.punc}>= {"{"}</span>
          </motion.span>

          <motion.span variants={lineVariants}>
            {"  "}
            <span className={C.prop}>name</span>
            <span className={C.punc}>:</span>{" "}
            <span className={C.str}>&quot;{site.name}&quot;</span>
            <span className={C.punc}>,</span>
          </motion.span>

          <motion.span variants={lineVariants}>
            {"  "}
            <span className={C.prop}>role</span>
            <span className={C.punc}>:</span>{" "}
            <span className={C.str}>&quot;{site.roles[0]}&quot;</span>
            <span className={C.punc}>,</span>
          </motion.span>

          <motion.span variants={lineVariants}>
            {"  "}
            <span className={C.prop}>stack</span>
            <span className={C.punc}>: [</span>
            <span className={C.str}>&quot;React&quot;</span>
            <span className={C.punc}>, </span>
            <span className={C.str}>&quot;Next.js&quot;</span>
            <span className={C.punc}>, </span>
            <span className={C.str}>&quot;TypeScript&quot;</span>
            <span className={C.punc}>],</span>
          </motion.span>

          <motion.span variants={lineVariants}>
            {"  "}
            <span className={C.prop}>focus</span>
            <span className={C.punc}>:</span>{" "}
            <span className={C.str}>&quot;performance · a11y · DX&quot;</span>
            <span className={C.punc}>,</span>
          </motion.span>

          <motion.span variants={lineVariants}>
            {"  "}
            <span className={C.prop}>openToWork</span>
            <span className={C.punc}>:</span>{" "}
            <span className={C.val}>true</span>
            <span className={C.punc}>,</span>
          </motion.span>

          <motion.span variants={lineVariants} className="caret">
            <span className={C.punc}>{"};"}</span>
          </motion.span>
        </code>
      </motion.pre>
    </motion.div>
  );
}
