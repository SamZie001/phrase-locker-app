import React from "react";
import Loading from "@/components/Loading";

const loading = () => {
  return (
    <div className="w-full flex justify-center items-center bg-white h-[85vh]">
      <Loading />
    </div>
  );
};

export default loading;
