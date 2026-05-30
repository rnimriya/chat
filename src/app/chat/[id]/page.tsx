import { Chatbots } from "@/lib/db";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/chat/ChatWidget";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = Chatbots.findById(id);
  if (!bot) notFound();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ChatWidget
          chatbotId={bot.id}
          name={bot.name}
          welcomeMessage={bot.welcomeMessage}
          color={bot.color}
          collectLeads={bot.collectLeads}
        />
      </div>
    </div>
  );
}
