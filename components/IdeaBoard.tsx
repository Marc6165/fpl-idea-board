"use client";

import CategoryColumn from "./CategoryColumn";

export default function IdeaBoard() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <CategoryColumn category="forfeit" />
        <CategoryColumn category="reward" />
        <CategoryColumn category="rule" />
      </div>
    </>
  );
}
