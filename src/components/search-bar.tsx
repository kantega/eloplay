import { Search, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
}: Props) {
  return (
    <div className="sticky top-2 z-10 w-full">
      <Input
        tabIndex={-1}
        autoFocus={false}
        placeholder={placeholder}
        value={searchQuery}
        className="border-background-input bg-background-input w-full text-foreground"
        onChange={(value) => {
          setSearchQuery(value.currentTarget.value);
        }}
      />
      <Button
        className="absolute right-0 top-0 z-20"
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => {
          setSearchQuery("");
        }}
      >
        {searchQuery === "" ? (
          <Search className=" text-muted-foreground" />
        ) : (
          <XCircle className="text-red-500" />
        )}
      </Button>
    </div>
  );
}
