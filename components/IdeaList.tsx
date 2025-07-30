"use client";

import useSWR from "swr";
import IdeaCard from "./IdeaCard";

interface Props {
  category: "all" | "forfeit" | "reward" | "rule";
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function IdeaList({ category }: Props) {
  const { data, error, isLoading } = useSWR(
    `/api/ideas${category !== "all" ? `?category=${category}` : ""}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  if (isLoading || !data) return <p>Indlæser...</p>;
  if (error) return <p className="text-red-600">Kunne ikke indlæse idéer.</p>;

  const ideas = Array.isArray(data.ideas) ? data.ideas : [];

  return (
    <div className="space-y-4">
      {ideas.length > 0 ? (
        ideas.map((idea: any) => <IdeaCard key={idea.id} idea={idea} />)
      ) : (
        <p>Ingen idéer endnu. Vær den første til at indsende!</p>
      )}
    </div>
  );
}
