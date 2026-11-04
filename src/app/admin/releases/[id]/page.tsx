import { Suspense } from 'react';
import { ReleaseEditor } from '@/components/admin/cms/ReleaseEditor';

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReleaseEditor id={id} />;
}

export default function EditReleasePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="cms-page"><p>Loading release editor…</p></main>}>
      <Editor params={params} />
    </Suspense>
  );
}
