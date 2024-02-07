import AddPlayerForm from "./AddPlayerForm";

export default function AddPlayer() {
  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <h1 className="text-5xl font-bold">Legg til spiller</h1>
      <AddPlayerForm />
    </div>
  );
}
