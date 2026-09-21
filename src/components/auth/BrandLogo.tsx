import React from "react";

export const BrandLogo: React.FC = () => (
  <div className="w-[110px] h-[110px] flex items-center justify-center transition-transform duration-300 hover:scale-105">
    <img
      src={`${import.meta.env.BASE_URL}logo.jpg`}
      alt="VITidy Mascot"
      className="w-full h-full object-contain mix-blend-multiply"
    />
  </div>
);
