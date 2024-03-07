export default function MessageBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mx-1 flex w-[calc(100%-0.5rem)] flex-wrap gap-2 rounded-sm bg-background-tertiary p-4">
      {children}
    </p>
  );
}
