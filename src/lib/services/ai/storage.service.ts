import { createClient } from '@/lib/supabase/server';
import fs from 'fs/promises';
import path from 'path';

export class AIStorageService {
  /**
   * Uploads a document to the local server file system and records metadata in the database.
   */
  static async uploadKnowledgeDocument(accountId: string, file: File) {
    const supabase = await createClient();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const storagePath = `${accountId}/${fileName}`;

    try {
      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from('knowledge-documents')
        .upload(storagePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
    } catch (uploadError) {
      console.error('[AIStorageService] Supabase upload failed:', uploadError);
      throw new Error('Failed to save file to server');
    }

    const dbPath = storagePath;

    // 2. Save metadata to database
    const { data: doc, error: dbError } = await supabase
      .from('ai_knowledge_documents')
      .insert({
        account_id: accountId,
        file_name: file.name,
        file_path: dbPath,
        file_size: file.size,
        file_type: file.type || 'unknown'
      })
      .select()
      .single();

    if (dbError) {
      console.error('[AIStorageService] DB insert failed:', dbError);
      // Attempt to clean up orphaned file
      await supabase.storage.from('knowledge-documents').remove([storagePath]).catch(() => {});
      throw new Error('Failed to save document metadata');
    }

    return doc;
  }

  static async listDocuments(accountId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ai_knowledge_documents')
      .select('*')
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) throw new Error('Failed to fetch documents');
    return data;
  }

  static async deleteDocument(accountId: string, documentId: string) {
    const supabase = await createClient();
    
    // Get file path first
    const { data: doc } = await supabase
      .from('ai_knowledge_documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('account_id', accountId)
      .single();
      
    if (!doc) throw new Error('Document not found');

    // Remove from storage
    try {
       await supabase.storage.from('knowledge-documents').remove([doc.file_path]);
    } catch (err) {
       console.warn('[AIStorageService] Failed to delete storage file (might already be missing):', err);
    }

    // Remove from DB
    const { error } = await supabase
      .from('ai_knowledge_documents')
      .delete()
      .eq('id', documentId)
      .eq('account_id', accountId);

    if (error) throw new Error('Failed to delete document metadata');
    return true;
  }
}
