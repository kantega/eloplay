/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useState } from "react";
import { InView } from "react-intersection-observer";

export default function AnimationOnScroll({
  children,
  classNameInView,
  classNameNotInView,
  functionToCall,
}: {
  children: React.ReactNode;
  classNameInView: string;
  classNameNotInView: string;
  functionToCall: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <InView
      threshold={1}
      onChange={async (inView) => {
        if (inView) {
          setIsLoading(true);
          await functionToCall();
          setIsLoading(false);
        }
      }}
    >
      {({ inView, ref }) => (
        <div
          ref={ref}
          className={inView ? classNameInView : classNameNotInView}
        >
          {isLoading && children}
        </div>
      )}
    </InView>
  );
}
