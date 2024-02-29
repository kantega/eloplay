import HeaderLabel from "@/components/header-label";
import CreateSwissForm from "@/components/tournaments/create-swiss-form";

export default function SwissTournamentPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4">
      <HeaderLabel label="TOURNAMENT" headerText="Swiss tournament" />
      <CreateSwissForm />
      <p className="p-10"></p>
    </div>
  );
}
