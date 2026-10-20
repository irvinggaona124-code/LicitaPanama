import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[19rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-300 shadow-input p-6 border border-slate-800 bg-[#0F172A]/90 backdrop-blur-md justify-between flex flex-col space-y-4 hover:border-emerald-500/30",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="mb-2 text-emerald-400">{icon}</div>
        <div className="font-bold text-white mb-1.5 mt-2 font-[family-name:var(--font-heading)] text-lg">
          {title}
        </div>
        <div className="text-slate-400 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
