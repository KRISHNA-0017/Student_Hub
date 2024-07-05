import React from "react";
import { PiSpinnerGapBold } from "react-icons/pi";

// The Loading component is used to display a loading indicator.
const Loading = () => {
  return (
    // Flex container to center the loading icon and text
    <div className="flex h-full w-full items-center justify-center text-lg">
      <PiSpinnerGapBold className="animate-spin" />
      Getting Things for you...
    </div>
  );
};

export default Loading;
