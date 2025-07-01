import { Reorder, motion } from "framer-motion";
import React from "react";
import clsx from "clsx"; // optional, for conditional classNames

interface DraggableCardProps {
  children: React.ReactNode;
  value: any;
  className?: string;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ children, value, className }) => {
  return (
    <Reorder.Item
      value={value}
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={clsx("rounded-xl", className)}
    >
      {children}
    </Reorder.Item>
  );
};

export default DraggableCard;
