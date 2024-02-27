import Lottie from "lottie-react";
import codingLoader from "./coding.json";
import { useEffect, useState } from "react";

export default function FullPageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Lottie
        animationData={codingLoader}
        loop={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
