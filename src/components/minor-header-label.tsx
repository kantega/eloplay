export default function MinorHeaderLabel({
  headerText,
  label,
}: {
  headerText?: string;
  label?: string;
}) {
  return (
    <span>
      {label && (
        <h2 className="m-0 text-xs font-bold text-gray-500">{label}</h2>
      )}
      {headerText && <h1 className="m-0 text-xl text-primary">{headerText}</h1>}
    </span>
  );
}
