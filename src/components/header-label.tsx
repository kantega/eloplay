import React from "react";

export default function HeaderLabel({
  headerText,
  label,
}: {
  headerText: string;
  label?: string;
}) {
  return (
    <span>
      {label && (
        <h2 className=" m-0 text-xs font-bold text-gray-500">{label}</h2>
      )}
      <h1 className="m-0 text-4xl text-primary">{headerText}</h1>
    </span>
  );
}
