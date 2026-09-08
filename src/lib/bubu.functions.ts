import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const MODEL = "google/gemini-3.8-flash";

async function askGateway(messages: Array<{ role: string; content: string }>) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Bubu is a bit busy right now. Try again in a moment.");
    if (res.status === 402) throw new Error("Bubu needs more AI credits before he can keep chatting.");
    throw new Error(text || "Bubu could not answer right now.");
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

const ChatInput = z.object({
  message: z.string().trim().min(1).max(1000),
  language: z.string().min(2).max(40),
  learnerName: z.string().max(60).optional(),
});

export const talkToBubu = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(30);

    const system = `You are Bubu, a warm, giggly, fluffy little creature who helps children (ages 4-12) learn ${data.language}.
Rules:
- Keep replies to 1-3 short sentences a child can read aloud.
- Speak mostly in simple ${data.language}, then give the English meaning in brackets.
- Always end with one tiny question to keep the child talking.
- Be encouraging, never scold. Gently repeat the correct phrasing instead of correcting harshly.
- Never discuss unsafe, scary or adult topics. Stay playful and kind.
${data.learnerName ? `The child's name is ${data.learnerName}.` : ""}`;

    const reply = await askGateway([
      { role: "system", content: system },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: data.message },
    ]);

    await supabase.from("chat_messages").insert([
      { user_id: userId, role: "user", content: data.message, language: data.language },
      { user_id: userId, role: "assistant", content: reply, language: data.language },
    ]);

    return { reply };
  });

export const clearBubuChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("chat_messages").delete().eq("user_id", context.userId);
    return { ok: true };
  });

const TranslateInput = z.object({
  text: z.string().trim().min(1).max(600),
  from: z.string().min(2).max(40),
  to: z.string().min(2).max(40),
});

export const translateForKids = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data }) => {
    const raw = await askGateway([
      {
        role: "system",
        content:
          "You translate for children. Reply with exactly three lines and no extra text:\nTRANSLATION: <translation>\nPRONOUNCE: <simple English-letter pronunciation>\nTIP: <one short kid-friendly tip>",
      },
      { role: "user", content: `Translate from ${data.from} to ${data.to}: "${data.text}"` },
    ]);

    const line = (label: string) =>
      raw
        .split("\n")
        .find((l) => l.toUpperCase().startsWith(label))
        ?.slice(label.length + 1)
        .trim() ?? "";

    return {
      translation: line("TRANSLATION:") || raw,
      pronounce: line("PRONOUNCE:"),
      tip: line("TIP:"),
    };
  });
