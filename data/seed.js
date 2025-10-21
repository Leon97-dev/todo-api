import mongoose from 'mongoose';
import data from './seedData.js';
import Task from '../models/task.js';
//
import * as dotenv from 'dotenv';
dotenv.config();
//
mongoose.connect(process.env.DATABASE_URL);
//
await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();
