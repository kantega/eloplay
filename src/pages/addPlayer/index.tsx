import { AddPlayerForm } from "./AddPlayerForm";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <AddPlayerForm />
    </div>
  );
}
