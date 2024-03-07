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
      <div
        data-before=""
        className="before:content before:animate-loading-bounce-effect after:animate-loading-step-effect 
      relative m-0 h-[90px] w-[120px] before:absolute before:bottom-[30px] before:left-[50px] before:z-50 
      before:h-[30px] before:w-[30px] before:rounded-full before:bg-teal-600 before:content-[attr(data-before)] 
      after:absolute after:right-0 after:top-0 after:h-[7px] after:w-[45px] after:rounded 
      after:content-[attr(data-before)]"
      />
    </div>
  );
}
