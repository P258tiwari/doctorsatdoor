import { Suspense } from 'react';
import { ArticleEditor } from '@/components/admin/cms/ArticleEditor';

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleEditor id={id} />;
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="cms-page"><p>Loading article workspace…</p></main>}>
      <Editor params={params} />
    </Suspense>
  );
}
