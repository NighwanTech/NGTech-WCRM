import { embed, embedMany } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';

export class AIEmbeddingService {
  /**
   * Generates embeddings for a single string.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing. Embeddings require Google AI.');
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: text,
    });
    return embedding;
  }

  /**
   * Generates embeddings for an array of strings.
   */
  static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing. Embeddings require Google AI.');
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('text-embedding-004'),
      values: texts,
    });
    return embeddings;
  }

  /**
   * Simple function to chunk large text into ~500 character chunks for embedding.
   */
  static chunkText(text: string, maxChunkLength: number = 800): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    const sentences = text.split(/(?<=[.?!])\s+/);

    for (const sentence of sentences) {
      if ((currentChunk.length + sentence.length) > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      currentChunk += sentence + ' ';
    }
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    return chunks;
  }

  /**
   * Search knowledge base
   */
  static async searchKnowledgeBase(accountId: string, query: string, limit: number = 3) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      // Need to format array as Postgres vector string '[1, 2, 3]'
      const embeddingVector = `[${queryEmbedding.join(',')}]`;

      const { data, error } = await supabase.rpc('match_knowledge_chunks', {
        query_embedding: embeddingVector,
        match_threshold: 0.7, // 70% similarity minimum
        match_count: limit,
        p_account_id: accountId
      });

      if (error) {
        console.error('Vector search error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to search knowledge base:', error);
      return [];
    }
  }

  /**
   * Process and store a document's content
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
      const embeddings = await this.generateEmbeddings(chunks);
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const insertData = chunks.map((chunk, index) => ({
        account_id: accountId,
        document_id: documentId || null,
        source_type: sourceType,
        source_url: sourceUrl || null,
        content: chunk,
        embedding: `[${embeddings[index].join(',')}]`,
      }));

      const { error } = await supabase.from('ai_knowledge_chunks').insert(insertData);
      
      if (error) throw error;
    } catch (e) {
      console.error('Failed to process and store embeddings:', e);
      throw e;
    }
  }
}
