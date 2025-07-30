import IdeaBoard from "@/components/IdeaBoard";
import HeroBar from "@/components/HeroBar";

export default function Home() {
  return (
    <>
      <HeroBar />
      <main className="container mx-auto max-w-7xl px-8 py-14">
        <IdeaBoard />
      </main>
    </>
  );
}
