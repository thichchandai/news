"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = () => {
  return (
    <>
      <ProgressBar
        height="4px"
        color="#12e6db"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
