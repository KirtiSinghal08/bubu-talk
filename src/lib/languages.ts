export type Language = {
  name: string;
  native: string;
  flag: string;
  code: string;
  blurb: string;
};

export const LANGUAGES: Language[] = [
  { name: "Spanish", native: "Español", flag: "🇪🇸", code: "es-ES", blurb: "Playful stories and market games" },
  { name: "French", native: "Français", flag: "🇫🇷", code: "fr-FR", blurb: "Café chats and bakery words" },
  { name: "German", native: "Deutsch", flag: "🇩🇪", code: "de-DE", blurb: "Animal names and counting fun" },
  { name: "Italian", native: "Italiano", flag: "🇮🇹", code: "it-IT", blurb: "Pizza talk and family words" },
  { name: "Hindi", native: "हिन्दी", flag: "🇮🇳", code: "hi-IN", blurb: "Festival rhymes and greetings" },
  { name: "Mandarin", native: "中文", flag: "🇨🇳", code: "zh-CN", blurb: "Tones through songs and games" },
  { name: "Japanese", native: "日本語", flag: "🇯🇵", code: "ja-JP", blurb: "Kind greetings and counting" },
  { name: "Korean", native: "한국어", flag: "🇰🇷", code: "ko-KR", blurb: "Hangul letters, step by step" },
  { name: "Arabic", native: "العربية", flag: "🇸🇦", code: "ar-SA", blurb: "Letters, colors and kindness" },
  { name: "Portuguese", native: "Português", flag: "🇧🇷", code: "pt-BR", blurb: "Beach words and happy songs" },
  { name: "Russian", native: "Русский", flag: "🇷🇺", code: "ru-RU", blurb: "Cyrillic letters made easy" },
  { name: "English", native: "English", flag: "🇬🇧", code: "en-US", blurb: "Confident everyday speaking" },
];

export function languageByName(name: string): Language {
  return LANGUAGES.find((l) => l.name === name) ?? LANGUAGES[0]!;
}
