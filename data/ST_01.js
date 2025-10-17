// ST_01.js : seed

import mongoose from 'mongoose';
import data from './DT_01.js';
import MT1 from '../models/MT_01.js'; // ← 상위 폴더면 경로 수정
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to DB');

    await MT1.deleteMany({});
    await MT1.insertMany(data);
    console.log('✅ Data inserted successfully');

    mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seed();
