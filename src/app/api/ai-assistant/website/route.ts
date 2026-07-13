import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIEmbeddingService } from '@/lib/services/ai/embedding.service';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.account_id) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 1. Fetch website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: 400 });
    }

    const html = await response.text();

    // 2. Extract text using Cheerio
    const $ = cheerio.load(html);
    
    // Remove unnecessary elements
    $('script, style, noscript, iframe, img, svg, nav, footer, header').remove();
    
    // Extract main text
    let text = $('body').text();
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    if (text.length < 50) {
      return NextResponse.json({ error: 'Not enough readable text found on this page.' }, { status: 400 });
    }

    // 3. Store embeddings
    await AIEmbeddingService.processAndStoreDocument(
      profile.account_id,
      '', // No document ID for websites
      text,
      'website',
      url
    );

    return NextResponse.json({ success: true, url, chars_extracted: text.length });
  } catch (error: any) {
    console.error('Error in website crawling POST:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
