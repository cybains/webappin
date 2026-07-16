import mongoose from 'mongoose';
import fetch from 'node-fetch';

// 1. Define the Job schema
const jobSchema = new mongoose.Schema({
  source: { type: String, required: true },
  source_id: { type: String, required: true },
  apply_url: String,
  title: String,
  company: mongoose.Schema.Types.Mixed,
  tags: [String],
  employment_type: String,
  posted_at: Date,
  locations: [mongoose.Schema.Types.Mixed],
  description_html: String,
  fetched_at: Date,
});
jobSchema.index({ source: 1, source_id: 1 }, { unique: true });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema, 'jobs');

async function main() {
  // 2. Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/refjobs', { dbName: 'refjobs' });
  console.log('Connected to job source storage');

  // 3. Fetch jobs from external API
  const res = await fetch('https://remotive.com/api/remote-jobs');
  if (!res.ok) {
    console.error('Failed to fetch jobs:', res.status);
    return;
  }
  const data = await res.json();

  // 4. Upsert jobs into MongoDB
  for (const job of data.jobs) {
    const sourceId = String(job.id ?? '');
    if (!sourceId) continue;
    const record = {
      source: 'remotive', source_id: sourceId, apply_url: job.url, title: job.title,
      company: { name: job.company_name }, tags: job.tags, employment_type: job.job_type,
      posted_at: job.publication_date, locations: job.candidate_required_location ? [job.candidate_required_location] : [],
      description_html: job.description, fetched_at: new Date(),
    };
    try {
      await Job.updateOne(
        { source: 'remotive', source_id: sourceId },
        { $set: record },
        { upsert: true }
      );
      console.log('Upserted Remotive job', { sourceId });
    } catch {
      console.error('Failed to upsert Remotive job', { sourceId, category: 'source_upsert_failed' });
    }
  }

  console.log('Jobs fetch & save complete');
  mongoose.disconnect();
}

main().catch(() => {
  console.error('Remotive import failed', { category: 'source_import_failed' });
  process.exitCode = 1;
});
