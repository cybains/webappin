import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || 'jobsdb';
    const db = client.db(dbName);

    const jobs = await db.collection('jobs').find({}).limit(50).toArray();

    const jobsWithId = jobs.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    return NextResponse.json({ jobs: jobsWithId });
  } catch (error: unknown) {
    // Narrow error type safely
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
      console.error('🔴 Mongo Fetch Error:', message);
    } else {
      console.error('🔴 Mongo Fetch Error:', error);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
