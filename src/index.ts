export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API routes
      if (path.startsWith('/api/')) {
        return await handleApi(request, env, path, corsHeaders);
      }

      // Frontend
      return new Response(getPageHtml(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

async function handleApi(request: Request, env: Env, path: string, corsHeaders: Record<string, string>): Promise<Response> {
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  // Library routes
  if (path === '/api/library/random' && request.method === 'GET') {
    return await handleLibraryRandom(request, env, headers);
  }

  // Learning routes
  if (path === '/api/learning/cards' && request.method === 'GET') {
    return await handleLearningCards(request, env, headers);
  }
  if (path === '/api/learning/add' && request.method === 'POST') {
    return await handleLearningAdd(request, env, headers);
  }
  if (path === '/api/learning/manual' && request.method === 'POST') {
    return await handleLearningManual(request, env, headers);
  }
  if (path === '/api/learning/list' && request.method === 'GET') {
    return await handleLearningList(request, env, headers);
  }
  if (path.match(/^\/api\/learning\/\d+\/status$/) && request.method === 'PUT') {
    const id = parseInt(path.split('/')[3]);
    return await handleLearningStatus(id, request, env, headers);
  }
  if (path.match(/^\/api\/learning\/\d+$/) && request.method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    return await handleLearningDetail(id, env, headers);
  }
  if (path.match(/^\/api\/learning\/\d+$/) && request.method === 'DELETE') {
    const id = parseInt(path.split('/')[3]);
    return await handleLearningDelete(id, env, headers);
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers,
  });
}

import { handleLibraryRandom } from './handlers/library';
import { handleLearningCards, handleLearningAdd, handleLearningManual, handleLearningList, handleLearningStatus, handleLearningDetail, handleLearningDelete } from './handlers/learning';
import { getPageHtml } from './pages/page';
