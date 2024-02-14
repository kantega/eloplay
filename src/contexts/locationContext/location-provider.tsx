"use client";

import React, { createContext, useState } from "react";
import { type Office } from "@/server/types/officeTypes";
import { getLocalStorageLocation, setLocalStorageLocation } from "./location";

interface LocationProps {
  location: Office;
  setLocation: (location: Office) => void;
}

const LocationContext = createContext<LocationProps>({
  location: getLocalStorageLocation(),
  setLocation: (location: Office) => console.log(location),
});

function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<Office>(
    getLocalStorageLocation(),
  ); // state for current locale

  const setLocation = (location: Office) => {
    setLocationState(location);
    setLocalStorageLocation(location);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export { LocationContext, LocationProvider };
