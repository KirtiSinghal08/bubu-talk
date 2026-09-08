import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mic, MicOff, Send, Trash2, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import bubuAsset from "@/assets/bubu.png.asset.json";
import { SiteHeader } from "@/components/bubu/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { clearBubuChat, talkToBubu } from "@/lib/bubu.functions";
import { LANGUAGES, languageByName } from "@/lib/languages";

export const Route = createFileRoute("/_authenticated/talk")({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: typeof search.lang === "string" ? search.lang : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Talk with Bubu — Live Language Practice" },
      { name: "description", content: "Speak out loud with Bubu and get friendly replies in real time." },
      { property: "og:title", content: "Talk with Bubu — Live Language Practice" },
      { property: "og:description", content: "Live voice conversations with a kind AI language buddy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TalkPage,
});

type Msg = { role: "user" | "assistant"; content: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function TalkPage() {
  const { lang } = Route.useSearch();
  const { user } = useSession();
  const send = useServerFn(talkToBubu);
  const clear = useServerFn(clearBubuChat);

  const [language, setLanguage] = useState(lang ?? "Spanish");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_messages")
      .select("role, content")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data.map((m) => ({ role: m.role as Msg["role"], content: m.content })));
      });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [thinking]);

  const speakOut = useCallback(
    (text: string) => {
      if (!voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text.replace(/\(([^)]*)\)/g, ""));
      u.lang = languageByName(language).code;
      u.rate = 0.9;
      u.pitch = 1.4;
      window.speechSynthesis.speak(u);
    },
    [voiceOn, language],
  );

  const submit = async (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setThinking(true);
    try {
      const res = await send({ data: { message: text, language } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      speakOut(res.reply);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bubu could not reply.");
    } finally {
      setThinking(false);
    }
  };

  const toggleMic = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      toast.error("This browser can't listen yet — try Chrome, or type instead.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = languageByName(language).code;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      if (transcript) void submit(transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const starters = ["Hello Bubu!", "Teach me 3 animal words", "Let's play a colour game", "How do I say thank you?"];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <img src={bubuAsset.url} alt="Bubu" className="size-16 rounded-2xl bg-secondary object-cover" />
          <div>
            <h1 className="text-2xl font-extrabold text-ink">Talk with Bubu</h1>
            <p className="text-sm text-muted-foreground">
              {listening ? "Bubu is listening…" : thinking ? "Bubu is thinking…" : "Tap the microphone and say hello!"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Practice language"
              className="rounded-xl border border-input bg-card px-3 py-2 text-sm font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
            <Button variant="outline" size="icon" aria-label="Toggle Bubu's voice" onClick={() => setVoiceOn((v) => !v)}>
              {voiceOn ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Clear conversation"
              onClick={async () => {
                await clear({});
                setMessages([]);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        <div className="bubu-card mt-6 flex h-[60vh] flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="text-center">
                <img src={bubuAsset.url} alt="Bubu waiting" className="animate-bubu-float mx-auto w-40" />
                <p className="mt-2 font-semibold text-ink">Say hi to Bubu in {language}!</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => void submit(s)}
                      className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-ink hover:bg-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
                {m.role === "assistant" && (
                  <img src={bubuAsset.url} alt="" className="size-9 shrink-0 rounded-full bg-secondary object-cover" />
                )}
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[75%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
                      : "max-w-[75%] text-foreground"
                  }
                >
                  {m.content}
                </p>
              </div>
            ))}
            {thinking && <p className="animate-pulse text-sm text-muted-foreground">Bubu is thinking…</p>}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Button
              type="button"
              onClick={toggleMic}
              variant={listening ? "default" : "outline"}
              size="icon"
              aria-label="Talk to Bubu"
              className="rounded-full"
            >
              {listening ? <MicOff /> : <Mic />}
            </Button>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Say something in ${language}…`}
              maxLength={1000}
              className="rounded-full"
            />
            <Button type="submit" size="icon" className="rounded-full" disabled={thinking || !input.trim()} aria-label="Send">
              <Send />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
