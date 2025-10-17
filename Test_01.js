// Test_01 : 롤 챔프 API > DB

import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import MT1 from './models/MT_01.js';

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Mongo connect error:', err));

const Test1 = express();
Test1.use(cors());
Test1.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

Test1.get(
  '/champions',
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;
    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
    const result = await MT1.find().sort(sortOption).limit(count);

    res.send(result);
  })
);

Test1.get(
  '/champions/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const test1 = await MT1.findById(id);
    if (test1) {
      res.send(test1);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

Test1.post(
  '/champions',
  asyncHandler(async (req, res) => {
    const newTest1 = await MT1.create(req.body);
    res.status(201).send(newTest1);
  })
);

Test1.patch(
  '/champions/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const test1 = await MT1.findById(id);
    if (test1) {
      Object.keys(req.body).forEach((key) => {
        test1[key] = req.body[key];
      });
      await test1.save();
      res.send(test1);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

Test1.delete(
  '/champions/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const test1 = await MT1.findByIdAndDelete(id);
    if (test1) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

Test1.listen(process.env.PORT || 3000, () => console.log('Server Started'));
