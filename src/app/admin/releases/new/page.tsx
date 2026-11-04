import { Suspense } from 'react';
import { ReleaseEditor } from '@/components/admin/cms/ReleaseEditor';

export default function NewReleasePage() {
  return (
    <Suspense fallback={<main className="cms-page"><p>Loading release editor…</p></main>}>
      <ReleaseEditor />
    </Suspense>
  );
}
