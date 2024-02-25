import HeaderLabel from "@/components/header-label";
import CreateTeamForm from "../../../components/team/create-team-form";

export default function CreateTeamPage() {
  return (
    <div className="container flex h-full flex-col justify-center gap-8 px-4 py-4 ">
      <HeaderLabel headerText={"Create Team"} />
      <CreateTeamForm />
    </div>
  );
}
