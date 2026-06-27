import { translateWord, parseJlptLevel } from './translate-client';

// 从词库添加
export async function handleLearningAdd(
  request: Request,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    const body = await request.json<{ library_id: number; word: string; reading: string; word_type: string; level: number }>();
    const { library_id, word, reading, word_type, level } = body;

    if (!word) {
      return new Response(JSON.stringify({ error: 'Missing word' }), {
        status: 400,
        headers,
      });
    }

    // 调用翻译服务
    const translateResult = await translateWord(word);

    // 保存到学习表
    const wordTypeNum = word_type === 'vocab' ? 2 : 3;
    await env.DB.prepare(
      `INSERT INTO learning_words 
        (word, reading, word_type, level, meaning_cn, word_type_detail, example_ja, example_cn, usage_note, speak_url, tspeak_url, minio_speak_url, minio_tspeak_url, dict_url, word_library_id, is_learned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).bind(
      word,
      translateResult?.reading || reading || '',
      wordTypeNum,
      level,
      translateResult?.translated_text || '',
      translateResult?.word_type || '',
      translateResult?.example_ja1 || '',
      translateResult?.example_cn1 || '',
      translateResult?.usage_note || '',
      translateResult?.speak_url || '',
      translateResult?.tspeak_url || '',
      translateResult?.minio_speak_url || '',
      translateResult?.minio_tspeak_url || '',
      translateResult?.dict_url || '',
      library_id
    ).run();

    // 标记词库已添加
    await env.DB.prepare(
      'UPDATE word_library SET is_added = 1 WHERE id = ?'
    ).bind(library_id).run();

    return new Response(JSON.stringify({
      success: true,
      data: {
        meaning_cn: translateResult?.translated_text || '',
        reading: translateResult?.reading || reading || '',
      },
    }), { headers });
  } catch (error) {
    console.error('Learning add error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add word' }), {
      status: 500,
      headers,
    });
  }
}

// 手动添加
export async function handleLearningManual(
  request: Request,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    const body = await request.json<{ word: string }>();
    const { word } = body;

    if (!word) {
      return new Response(JSON.stringify({ error: 'Missing word' }), {
        status: 400,
        headers,
      });
    }

    // 调用翻译服务
    const translateResult = await translateWord(word);
    if (!translateResult) {
      return new Response(JSON.stringify({ error: 'Translation failed' }), {
        status: 400,
        headers,
      });
    }

    const level = parseJlptLevel(translateResult.jlpt_level);

    // 保存到学习表
    await env.DB.prepare(
      `INSERT INTO learning_words 
        (word, reading, word_type, level, meaning_cn, word_type_detail, example_ja, example_cn, usage_note, speak_url, tspeak_url, minio_speak_url, minio_tspeak_url, dict_url, word_library_id, is_learned)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)`
    ).bind(
      word,
      translateResult.reading,
      level,
      translateResult.translated_text,
      translateResult.word_type,
      translateResult.example_ja1,
      translateResult.example_cn1,
      translateResult.usage_note,
      translateResult.speak_url,
      translateResult.tspeak_url,
      translateResult.minio_speak_url,
      translateResult.minio_tspeak_url,
      translateResult.dict_url
    ).run();

    return new Response(JSON.stringify({
      success: true,
      data: {
        meaning_cn: translateResult.translated_text,
        reading: translateResult.reading,
      },
    }), { headers });
  } catch (error) {
    console.error('Learning manual error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add word' }), {
      status: 500,
      headers,
    });
  }
}

// 查询学习词汇列表
export async function handleLearningList(
  request: Request,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = 20;
    const status = url.searchParams.get('status') || '';
    const level = url.searchParams.get('level') || '';
    const type = url.searchParams.get('type') || '';
    const search = url.searchParams.get('search') || '';

    let query = 'SELECT id, word, reading, word_type, level, meaning_cn, is_learned, created_at FROM learning_words';
    let countQuery = 'SELECT COUNT(*) as total FROM learning_words';
    const params: any[] = [];
    const conditions: string[] = [];

    if (status !== '') {
      conditions.push('is_learned = ?');
      params.push(parseInt(status));
    }
    if (level) {
      conditions.push('level = ?');
      params.push(parseInt(level));
    }
    if (type) {
      conditions.push('word_type = ?');
      params.push(parseInt(type));
    }
    if (search) {
      conditions.push('(word LIKE ? OR reading LIKE ? OR meaning_cn LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    const offset = (page - 1) * pageSize;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countResult = await env.DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = countResult?.total || 0;

    const result = await env.DB.prepare(query).bind(...params, pageSize, offset).all();

    return new Response(JSON.stringify({
      success: true,
      data: result.results,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }), { headers });
  } catch (error) {
    console.error('Learning list error:', error);
    return new Response(JSON.stringify({ error: 'Failed to list words' }), {
      status: 500,
      headers,
    });
  }
}

// 切换学习状态
export async function handleLearningStatus(
  id: number,
  request: Request,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    const body = await request.json<{ is_learned: number }>();
    await env.DB.prepare(
      'UPDATE learning_words SET is_learned = ? WHERE id = ?'
    ).bind(body.is_learned, id).run();

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (error) {
    console.error('Learning status error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update status' }), {
      status: 500,
      headers,
    });
  }
}

// 查询详情
export async function handleLearningDetail(
  id: number,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    const result = await env.DB.prepare('SELECT * FROM learning_words WHERE id = ?').bind(id).first();

    if (!result) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers,
      });
    }

    return new Response(JSON.stringify({ success: true, data: result }), { headers });
  } catch (error) {
    console.error('Learning detail error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get detail' }), {
      status: 500,
      headers,
    });
  }
}

// 删除词汇
export async function handleLearningDelete(
  id: number,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    // 查询记录
    const record = await env.DB.prepare(
      'SELECT word_library_id, word_type FROM learning_words WHERE id = ?'
    ).bind(id).first<{ word_library_id: number | null; word_type: number }>();

    if (!record) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers,
      });
    }

    // 如果来自词库，恢复 is_added 状态
    if (record.word_library_id && (record.word_type === 2 || record.word_type === 3)) {
      await env.DB.prepare(
        'UPDATE word_library SET is_added = 0 WHERE id = ?'
      ).bind(record.word_library_id).run();
    }

    // 删除记录
    await env.DB.prepare('DELETE FROM learning_words WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (error) {
    console.error('Learning delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete word' }), {
      status: 500,
      headers,
    });
  }
}
