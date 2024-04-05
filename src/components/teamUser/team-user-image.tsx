import Image from "next/image";

export default function TeamUserImage({
  image,
  index,
}: {
  image: string;
  index?: number;
}) {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      {index !== undefined && (
        <p className="absolute top-0 z-30 text-3xl text-primary">{index + 1}</p>
      )}
      <div className="absolute z-20 h-full w-full bg-[#0000002D]" />
      <Image
        className="rounded-full"
        src={image}
        alt="Team user profile image"
        width={40}
        height={40}
        quality={100}
      />
    </div>
  );
}
