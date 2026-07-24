import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIStorageService } from '@/lib/services/ai/storage.service';

export async function GET() {
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

    const docs = await AIStorageService.listDocuments(profile.account_id);
    return NextResponse.json({ documents: docs });
  } catch (error: any) {
    console.error('Error in documents GET:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isZip = file.name.endsWith('.zip') || file.type.includes('zip');
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'text/csv',
      'application/zip',
      'application/x-zip-compressed'
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md') && !file.name.endsWith('.csv') && !isZip) {
       return NextResponse.json({ error: 'Unsupported file type. Use PDF, DOCX, TXT, MD, CSV, or ZIP archives.' }, { status: 400 });
    }

    if (isZip) {
      const AdmZip = (await import('adm-zip')).default;
      const arrayBuffer = await file.arrayBuffer();
      const zip = new AdmZip(Buffer.from(arrayBuffer));
      const zipEntries = zip.getEntries();

      const uploadedDocs = [];

      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;
        const entryName = entry.entryName.split('/').pop() || entry.entryName;
        if (entryName.startsWith('.') || entry.entryName.includes('__MACOSX')) continue;

        const ext = entryName.split('.').pop()?.toLowerCase();
        if (!['txt', 'md', 'pdf', 'docx', 'csv'].includes(ext || '')) continue;

        const entryBuffer = entry.getData();
        const fileType = ext === 'pdf' ? 'application/pdf' : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain';
        const mockFile = new File([new Uint8Array(entryBuffer)], entryName, { type: fileType });

        try {
          const doc = await AIStorageService.uploadKnowledgeDocument(profile.account_id, mockFile);

          let extractedText = '';
          if (ext === 'pdf') {
            const pdfParse = require('pdf-parse');
            const pdfData = await pdfParse(entryBuffer);
            extractedText = pdfData.text;
          } else {
            extractedText = entryBuffer.toString('utf-8');
          }

          if (extractedText && extractedText.trim().length > 0) {
            const { AIEmbeddingService } = await import('@/lib/services/ai/embedding.service');
            await AIEmbeddingService.processAndStoreDocument(
              profile.account_id,
              doc.id,
              extractedText,
              'document'
            );
          }
          uploadedDocs.push(doc);
        } catch (e) {
          console.error(`Failed processing zip entry ${entryName}:`, e);
        }
      }

      return NextResponse.json({ success: true, count: uploadedDocs.length, documents: uploadedDocs });
    }

    const doc = await AIStorageService.uploadKnowledgeDocument(profile.account_id, file);

    // Extract text and generate embeddings
    try {
      let extractedText = '';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.type === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } else {
        // Text based files
        extractedText = buffer.toString('utf-8');
      }

      if (extractedText && extractedText.trim().length > 0) {
        const { AIEmbeddingService } = await import('@/lib/services/ai/embedding.service');
        await AIEmbeddingService.processAndStoreDocument(
          profile.account_id,
          doc.id,
          extractedText,
          'document'
        );
      }
    } catch (parseError) {
      console.error('Failed to parse or embed document, but file was uploaded:', parseError);
    }

    return NextResponse.json({ document: doc });
  } catch (error: any) {
    console.error('Error in documents POST:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    await AIStorageService.deleteDocument(profile.account_id, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in documents DELETE:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
