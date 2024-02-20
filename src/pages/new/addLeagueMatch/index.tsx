import AddMatchForm from "./AddMatchForm";

export default function AddMatch() {
  return (
    <div className="container flex h-full flex-col items-center justify-center gap-8 px-4 py-4 ">
      <h1 className=" text-5xl font-bold">Legg til kamp</h1>
      <AddMatchForm />
    </div>
  );
}
