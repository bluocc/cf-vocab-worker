const TRANSLATE_API = 'https://translate.luosc.org/api/aiTranslate';

export interface Env {
  DB: D1Database;
  TRANSLATE_API_KEY: string;
  CF_ACCESS_CLIENT_ID: string;
  CF_ACCESS_CLIENT_SECRET: string;
}

export interface TranslateResult {
  translated_text: string;
  reading: string;
  word_type: string;
  example_ja1: string;
  example_cn1: string;
  usage_note: string;
  jlpt_level: string;
  speak_url: string;
  tspeak_url: string;
  minio_speak_url: string;
  minio_tspeak_url: string;
  dict_url: string;
}

export async function translateWord(text: string, env: Env): Promise<TranslateResult | null> {
  try {
    const response = await fetch(TRANSLATE_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.TRANSLATE_API_KEY}`,
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': env.CF_ACCESS_CLIENT_ID,
        'CF-Access-Client-Secret': env.CF_ACCESS_CLIENT_SECRET,
      },
      body: JSON.stringify({
        text,
        from: 'ja',
        to: 'zh',
        with_audio: true,
      }),
    });

    const data = await response.json<any>();

    if (!data.success) {
      console.error('Translate failed:', data);
      return null;
    }

    const d = data.data;
    return {
      translated_text: d.translated_text || '',
      reading: d.reading || '',
      word_type: d.word_type || '',
      example_ja1: d.example_ja1 || '',
      example_cn1: d.example_cn1 || '',
      usage_note: d.usage_note || '',
      jlpt_level: d.jlpt_level || '',
      speak_url: d.speak_url || '',
      tspeak_url: d.tspeak_url || '',
      minio_speak_url: d.minio_speak_url || '',
      minio_tspeak_url: d.minio_tspeak_url || '',
      dict_url: d.dict_url || '',
    };
  } catch (error) {
    console.error('Translate error:', error);
    return null;
  }
}

export function parseJlptLevel(jlpt: string): number {
  if (!jlpt) return 0;
  const match = jlpt.match(/N(\d)/i);
  return match ? parseInt(match[1]) : 0;
}
