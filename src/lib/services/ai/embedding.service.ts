import { embed, embedMany } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { supabaseAdmin } from '@/lib/flows/admin-client';
import { AIStorageService } from './storage.service';

export class AIEmbeddingService {
  private static getGoogleKey(): string | null {
    return process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || null;
  }

  /**
   * Generates embeddings for a single string using Google text-embedding-004.
   */
  static async generateEmbedding(text: string): Promise<number[] | null> {
    const key = this.getGoogleKey();
    if (!key) return null;

    try {
      const google = createGoogleGenerativeAI({ apiKey: key });
      const { embedding } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: text,
      });
      return embedding;
    } catch (err) {
      console.warn('[AIEmbeddingService] generateEmbedding failed:', err);
      return null;
    }
  }

  /**
   * Generates embeddings for an array of strings using Google text-embedding-004.
   */
  static async generateEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
    const key = this.getGoogleKey();
    if (!key) return texts.map(() => null);

    try {
      const google = createGoogleGenerativeAI({ apiKey: key });
      const { embeddings } = await embedMany({
        model: google.textEmbeddingModel('text-embedding-004'),
        values: texts,
      });
      return embeddings;
    } catch (err) {
      console.warn('[AIEmbeddingService] generateEmbeddings failed:', err);
      return texts.map(() => null);
    }
  }

  /**
   * Chunk text into meaningful paragraphs or sections (~1000 characters).
   */
  static chunkText(text: string, maxChunkLength: number = 1000): string[] {
    if (!text || !text.trim()) return [];

    // Split first by markdown headers (##, ###) or double newlines to keep sections intact
    const sections = text.split(/\n\s*\n|(?=^#{1,4}\s)/m);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      if ((currentChunk.length + trimmed.length) > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      if (trimmed.length > maxChunkLength) {
        // Break large single section by sentences
        const sentences = trimmed.split(/(?<=[.?!])\s+/);
        for (const s of sentences) {
          if ((currentChunk.length + s.length) > maxChunkLength && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
          }
          currentChunk += s + ' ';
        }
      } else {
        currentChunk += trimmed + '\n\n';
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Automatically ingests and indexes all uploaded documents for an account if chunks are missing.
   */
  static async autoIndexMissingDocuments(accountId: string): Promise<number> {
    const supabase = supabaseAdmin();
    try {
      // Check existing documents
      const { data: docs } = await supabase
        .from('ai_knowledge_documents')
        .select('*')
        .eq('account_id', accountId);

      if (!docs || docs.length === 0) return 0;

      let indexedCount = 0;

      for (const doc of docs) {
        // Check if chunks already exist for this doc
        const { count } = await supabase
          .from('ai_knowledge_chunks')
          .select('id', { count: 'exact', head: true })
          .eq('document_id', doc.id);

        if (count && count > 0) continue;

        // Download and chunk document content
        const content = await AIStorageService.getDocumentContent(doc.file_path);
        if (content && content.trim().length > 0) {
          await this.processAndStoreDocument(
            accountId,
            doc.id,
            `Document: ${doc.file_name}\n\n${content}`,
            'document'
          );
          indexedCount++;
        }
      }

      return indexedCount;
    } catch (err) {
      console.error('[AIEmbeddingService] autoIndexMissingDocuments error:', err);
      return 0;
    }
  }

  /**
   * Search knowledge base with hybrid search (vector similarity + keyword fallback).
   * Strictly isolated per client `accountId`. Dynamic limit across all uploaded files.
   */
  static async searchKnowledgeBase(accountId: string, query: string = '', limit: number = 15) {
    if (!accountId) return [];
    const supabase = supabaseAdmin();

    try {
      // 1. Auto-index any un-indexed documents strictly for this specific account
      const { count: totalChunks } = await supabase
        .from('ai_knowledge_chunks')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', accountId);

      if (!totalChunks || totalChunks === 0) {
        await this.autoIndexMissingDocuments(accountId);
      }

      let matchedChunks: any[] = [];

      // 2. Vector search attempt strictly scoped to this client's account_id
      if (query && query.trim().length > 0) {
        const queryEmbedding = await this.generateEmbedding(query);
        if (queryEmbedding && Array.isArray(queryEmbedding)) {
          const embeddingVector = `[${queryEmbedding.join(',')}]`;
          const { data, error } = await supabase.rpc('match_knowledge_chunks', {
            query_embedding: embeddingVector,
            match_threshold: 0.45, // Broad threshold to capture all relevant client files
            match_count: limit,
            p_account_id: accountId
          });

          if (!error && data && data.length > 0) {
            matchedChunks = data;
          }
        }
      }

      // 3. Keyword / Text-based extraction fallback/augmentation strictly for this account
      if (matchedChunks.length < limit) {
        const searchTerms = (query || '')
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(t => t.length > 2 && !['what', 'when', 'where', 'how', 'which', 'tell', 'about', 'the', 'and', 'for', 'are', 'you'].includes(t));

        if (searchTerms.length > 0) {
          for (const term of searchTerms.slice(0, 8)) {
            const { data: termMatches } = await supabase
              .from('ai_knowledge_chunks')
              .select('id, content, source_type, source_url')
              .eq('account_id', accountId)
              .ilike('content', `%${term}%`)
              .limit(limit);

            if (termMatches) {
              for (const chunk of termMatches) {
                if (!matchedChunks.some(m => m.id === chunk.id)) {
                  matchedChunks.push(chunk);
                }
              }
            }
          }
        }
      }

      // 4. If query is broad or general, load the client's documents chunks up to the limit
      if (matchedChunks.length === 0) {
        const { data: defaultChunks } = await supabase
          .from('ai_knowledge_chunks')
          .select('id, content, source_type, source_url')
          .eq('account_id', accountId)
          .order('created_at', { ascending: true })
          .limit(limit);

        matchedChunks = defaultChunks || [];
      }

      return matchedChunks.slice(0, limit);
    } catch (error) {
      console.error('[AIEmbeddingService] searchKnowledgeBase failed:', error);
      return [];
    }
  }

  /**
   * Process and store a document's content into chunks.
   */
  static async processAndStoreDocument(
    accountId: string, 
    documentId: string, 
    content: string,
    sourceType: 'document' | 'website' = 'document',
    sourceUrl?: string
  ) {
    const chunks = this.chunkText(content);
    if (chunks.length === 0) return;

    try {
      const supabase = supabaseAdmin();
      let embeddings: (number[] | null)[] = [];

      try {
        embeddings = await this.generateEmbeddings(chunks);
      } catch (embErr) {
        console.warn('[AIEmbeddingService] Failed generating embeddings for chunks, storing text only:', embErr);
        embeddings = chunks.map(() => null);
      }

      const insertData = chunks.map((chunk, index) => {
        const emb = embeddings[index];
        return {
          account_id: accountId,
          document_id: documentId || null,
          source_type: sourceType,
          source_url: sourceUrl || null,
          content: chunk,
          embedding: emb ? `[${emb.join(',')}]` : null,
        };
      });

      // Insert in batches of 20
      for (let i = 0; i < insertData.length; i += 20) {
        const batch = insertData.slice(i, i + 20);
        const { error } = await supabase.from('ai_knowledge_chunks').insert(batch);
        if (error) {
          // If vector column errored on null or dimension, try inserting without embedding column
          const textOnlyBatch = batch.map(({ embedding, ...rest }) => rest);
          await supabase.from('ai_knowledge_chunks').insert(textOnlyBatch);
        }
      }
    } catch (e) {
      console.error('[AIEmbeddingService] Failed to process and store chunks:', e);
    }
  }
}

