import { type SvgProps } from "./svgUtils";

export default function AddMatchSVG({
  size = 1,
  relativeSize = true,
  className = "",
  color1 = "fill-primary",
}: SvgProps) {
  if (relativeSize) size *= 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.125 8.73071C17.125 9.27759 16.6953 9.66821 16.1875 9.66821H9.9375V15.9182C9.9375 16.4651 9.50781 16.8948 9 16.8948C8.45312 16.8948 8.0625 16.4651 8.0625 15.9182V9.66821H1.8125C1.26562 9.66821 0.875 9.27759 0.875 8.76978C0.875 8.2229 1.26562 7.79321 1.8125 7.79321H8.0625V1.54321C8.0625 1.0354 8.45312 0.644775 9 0.644775C9.50781 0.644775 9.9375 1.0354 9.9375 1.54321V7.79321H16.1875C16.6953 7.79321 17.125 8.2229 17.125 8.73071Z"
        className={color1}
      />
    </svg>
  );
}
