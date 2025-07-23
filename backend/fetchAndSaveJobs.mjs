import mongoose from 'mongoose';
import fetch from 'node-fetch';

// 1. Define the Job schema
const jobSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  url: String,
  title: String,
  company_name: String,
  company_logo: String,
  category: String,
  tags: [String],
  job_type: String,
  publication_date: Date,
  candidate_required_location: String,
  salary: String,
  description: String,
});

const Job = mongoose.model('Job', jobSchema);

async function main() {
  // 2. Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsdb');
  console.log('Connected to MongoDB');

  // 3. Fetch jobs from external API
  const res = await fetch('https://remotive.com/api/remote-jobs');
  if (!res.ok) {
    console.error('Failed to fetch jobs:', res.status);
    return;
  }
  const data = await res.json();

  // 4. Upsert jobs into MongoDB
  for (const job of data.jobs) {
    try {
      await Job.updateOne(
        { id: job.id },
        { $set: job },
        { upsert: true }
      );
      console.log(`Upserted job ID: ${job.id} - ${job.title}`);
    } catch (e) {
      console.error(`Failed to upsert job ID: ${job.id}`, e);
    }
  }

  console.log('Jobs fetch & save complete');
  mongoose.disconnect();
}

main().catch(console.error);
