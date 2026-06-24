import InlineChatPanel from "@/components/chat/InlineChatPanel";

export const metadata = {
  title: "Chat with Phantex Tech AI | Phantex Tech",
  description: "Ask our AI assistant anything about Phantex Tech services, pricing, or schedule a meeting with our team.",
};

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Talk to Our AI Assistant</h1>
        <p className="text-muted-foreground text-lg">
          Get instant answers about our services, pricing, and team — or book a meeting directly.
        </p>
      </div>

      {/* Full-screen inline chat */}
      <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            PT
          </div>
          <div>
            <p className="text-white font-semibold">Phantex Tech AI</p>
            <p className="text-indigo-200 text-sm">Powered by Claude · Always available</p>
          </div>
        </div>
        <InlineChatPanel />
      </div>
    </main>
  );
}
