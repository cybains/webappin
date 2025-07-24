import React, { Suspense } from 'react';
import JobsPage from './JobsClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading jobs...</div>}>
      <JobsPage />
    </Suspense>
  );
}
