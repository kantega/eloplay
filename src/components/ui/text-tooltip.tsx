import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  text: string;
}

export default function TooltipButton({ children, text, onClick }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger onClick={onClick}>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
