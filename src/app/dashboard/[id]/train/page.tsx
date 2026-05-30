import { getSession } from "@/lib/auth";
import { Chatbots } from "@/lib/db";
import { getChunkCount } from "@/lib/vectorStore";
import { notFound } from "next/navigation";
import TrainClient from "@/components/dashboard/TrainClient";

export default async function TrainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const bot = Chatbots.findById(id);
  if (!bot || bot.userId !== session!.userId) notFound();
  const chunkCount = getChunkCount(id);

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {bot.name} <span className="text-sky-500">Knowledge</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {chunkCount > 0 ? `${chunkCount} knowledge chunks indexed` : "No training data yet — add a source below"}
        </p>
      </div>
      <TrainClient botId={id} initialChunkCount={chunkCount} />
    </div>
  );
}
