import { Medal, PlusCircle, UserPlus } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 flex w-full justify-center bg-background">
      <div className=" flex w-[min(500px,100%)]  justify-around bg-background">
        <Link href={"/"} className="p-4">
          <Medal />
        </Link>
        <Link href={"/addMatch"} className="p-4">
          <PlusCircle />
        </Link>
        <Link href={"/addPlayer"} className="p-4">
          <UserPlus />
        </Link>
      </div>
    </div>
  );
}
