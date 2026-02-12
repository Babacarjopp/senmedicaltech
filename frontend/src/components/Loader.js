import React from "react";

const Loader = ({ size = "md", text = "Chargement..." }) => {
  const sizeClass = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-14 h-14 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className={`${sizeClass[size]} border-neutral-200 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="text-neutral-500 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
