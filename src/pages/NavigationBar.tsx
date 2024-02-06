import { Button } from "@/components/ui/button";
import { Medal, PlusCircle, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 flex w-full justify-around bg-accent p-2">
      <Button>
        <Link href={"/"}>
          <Medal />
        </Link>
      </Button>
      <Button>
        <Link href={"/addMatch"}>
          <PlusCircle />
        </Link>
      </Button>
      <Button>
        <Link href={"/addPlayer"}>
          <UserPlus />
        </Link>
      </Button>
    </div>
  );
}
