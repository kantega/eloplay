export default function MessageBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mx-1 rounded-sm bg-background-tertiary p-4">{children}</p>
  );
}
