"use client";

import IdeaForm from "./IdeaForm";

export default function HeroBar() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b shadow-sm">
      <div className="container mx-auto max-w-7xl px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <h1 className="text-3xl font-bold whitespace-nowrap">FPL Idétavle</h1>
        <div className="flex-1">
          <IdeaForm compact />
        </div>
      </div>
    </header>
  );
}
