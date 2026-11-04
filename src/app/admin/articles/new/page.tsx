import { Suspense } from 'react';
import { ArticleEditor } from '@/components/admin/cms/ArticleEditor';

export default function NewArticlePage() {
  return (
    <Suspense fallback={<main className="cms-page"><p>Loading article workspace…</p></main>}>
      <ArticleEditor />
    </Suspense>
  );
}
