import { Button } from "@/components/ui/button";
import { ListPlus, NotebookTabs, UserPlus } from "lucide-react";

export default function NavigationBar() {
  return (
    <div className="fixed bottom-0 right-0 flex w-full justify-around bg-accent p-2">
      <Button>
        <NotebookTabs />
      </Button>
      <Button>
        <ListPlus />
      </Button>
      <Button>
        <UserPlus />
      </Button>
    </div>
  );
}
