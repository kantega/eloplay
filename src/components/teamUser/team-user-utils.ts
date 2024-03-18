export function getNameOrInitials(name: string) {
  if (name.length > 10) return getUserInitials(name);
  return name;
}

const getUserInitials = (name: string): string => {
  const names = name.split(" ") || [];

  return names.reduce((acc: string, name: string) => {
    return acc + name.charAt(0).toUpperCase();
  }, "");
};

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 3) + "..." : str;
}
