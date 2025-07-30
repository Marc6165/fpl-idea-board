"use client";

interface Props {
  selected: "all" | "forfeit" | "reward" | "rule";
  onSelect: (v: Props["selected"]) => void;
}

const tabs = [
  { key: "all", label: "Alle" },
  { key: "forfeit", label: "Straffe" },
  { key: "reward", label: "Belønninger" },
  { key: "rule", label: "Regler" },
] as const;

export default function FilterTabs({ selected, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-2 my-4">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition ${
            selected === t.key
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
