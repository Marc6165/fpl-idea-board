import useSWR from "swr";
import IdeaCard from "./IdeaCard";

interface Props {
  category: "forfeit" | "reward" | "rule";
}

const labels: Record<Props["category"], string> = {
  forfeit: "⚔️ Forfeits",
  reward: "🎁 Vinderpræmie",
  rule: "📜 Regler",
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoryColumn({ category }: Props) {
  const { data, error, isLoading } = useSWR(
    `/api/ideas?category=${category}`,
    fetcher,
    {
      refreshInterval: 10000,
    }
  );

  return (
    <div className="w-full bg-white rounded-md border p-4 flex flex-col gap-4 min-h-[260px]">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {labels[category]}
      </h3>
      {isLoading || !data ? (
        <p className="text-center">Indlæser...</p>
      ) : error ? (
        <p className="text-red-600 text-center">Kunne ikke hente data.</p>
      ) : (data.ideas?.length ?? 0) === 0 ? (
        <p className="text-center">Ingen idéer endnu.</p>
      ) : (
        <>
          {data.ideas?.slice(0, 3).map((idea: any, idx: number) => (
            <IdeaCard key={idea.id} idea={idea} rank={idx} />
          ))}
          {(data.ideas?.length ?? 0) > 3 && <div className="border-t my-2" />}
          {data.ideas?.slice(3).map((idea: any, idx: number) => (
            <IdeaCard key={idea.id} idea={idea} rank={idx + 3} />
          ))}
        </>
      )}
    </div>
  );
}
