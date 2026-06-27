export async function handleLibraryRandom(
  request: Request,
  env: { DB: D1Database },
  headers: Record<string, string>
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || '';
    const level = url.searchParams.get('level') || '';

    let query = 'SELECT id, word, reading, word_type, level FROM word_library WHERE is_added = 0';
    const params: any[] = [];

    if (type) {
      query += ' AND word_type = ?';
      params.push(type);
    }

    if (level) {
      query += ' AND level = ?';
      params.push(parseInt(level));
    }

    query += ' ORDER BY RANDOM() LIMIT 10';

    const result = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      success: true,
      data: result.results,
    }), { headers });
  } catch (error) {
    console.error('Library random error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get random words' }), {
      status: 500,
      headers,
    });
  }
}
