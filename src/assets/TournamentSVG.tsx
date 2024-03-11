import { type SvgProps } from "./svgUtils";

export default function TournamentSVG({
  size = 1,
  relativeSize = true,
  className = "",
  color1 = "fill-primary",
}: SvgProps) {
  if (relativeSize) size *= 24;

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M9 2H2v2h5v4H2v2h7V7h5v10H9v-3H2v2h5v4H2v2h7v-3h7v-6h6v-2h-6V5H9V2z"
        className={color1}
      />
    </svg>
  );
}
