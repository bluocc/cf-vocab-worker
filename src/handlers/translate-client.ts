const TRANSLATE_API = 'https://translate.luosc.org/api/aiTranslate';
const TRANSLATE_API_KEY = 'tk_5ae1c489c33c798067191925d5e7214ebd1a5904784b5180ff0ce40a269f90dd';

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

export async function translateWord(text: string): Promise<TranslateResult | null> {
  try {
    const response = await fetch(TRANSLATE_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TRANSLATE_API_KEY}`,
        'Content-Type': 'application/json',
        'CF-Access-Client-Id': '28fb1d41474223550480a99ddded7ad3.access',
        'CF-Access-Client-Secret': '054b5f96910a1a0f491b38a700d95089c651be4fed75af48948bfa12ee1bf0c9',
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
