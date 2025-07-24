import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || 'jobsdb';
    const db = client.db(dbName);

    // Get search params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Fetch paginated jobs
    const jobs = await db.collection('jobs')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    // Total number of jobs in the collection
    const totalJobs = await db.collection('jobs').countDocuments();

    // Format the jobs to replace _id with id
    const jobsWithId = jobs.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    }));

    return NextResponse.json({
      jobs: jobsWithId,
      page,
      limit,
      totalJobs, // ✅ Include totalJobs here
    });
  } catch (error: unknown) {
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
