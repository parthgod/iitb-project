"use client";

import { useEffect, useState } from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  const words = [
    {
      text: "Welcome",
      className: "text-white text-6xl",
    },
    {
      text: "to",
      className: "text-white text-6xl",
    },
    {
      text: "VoltVault!",
      className: "text-yellow-500 text-6xl",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 2200);
  }, []);

  const subText = `Seamlessly organize and manage critical data for your power systems including buses, generators, transformers,
  and more. Simplify grid operations and optimize efficiency with our intuitive platform. Let's power up your
  infrastructure together!`;

  return (
    <div className="w-[70vw] flex flex-col gap-0 px-10 items-center">
      <TypewriterEffectSmooth words={words} />
      {isMounted ? <TextGenerateEffect words={subText} /> : <div className="h-[6.2rem]" />}
    </div>
  );
};

export default HeroSection;
