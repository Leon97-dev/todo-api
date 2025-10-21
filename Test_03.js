/* 기본 틀 구조 
import express from 'express';
const app = express();

app.get('/hello', (req, res) => {
  res.send('안녕하세요! 여기는 Express 학습방입니다:)');
});

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 대기 중입니다!');
});
*/
import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import Task from './models/task.js';

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Mongo connect error:', err));

const app = express();
app.use(express.json());

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

// GET
app.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

// // POST
// app.post('/tasks', (req, res) => {
//   const data = req.body;
//   const ids = tasks.map((task) => task.id);
//   const nextId = Math.max(...ids) + 1;
//   const now = new Date();
//   const newTask = {
//     ...data,
//     id: nextId,
//     createdAt: now,
//     updatedAt: now,
//     isComplete: false,
//   };
//   tasks.push(newTask);

//   res.status(201).send(newTask);
// });

// // Dynamic URL
// app.get('/tasks/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const task = tasks.find((task) => task.id === id);
//   if (task) {
//     res.send(task);
//   } else {
//     res.status(404).send({ message: 'Cannot find given id' });
//   }
// });

// // PATCH
// app.patch('/tasks/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const task = tasks.find((task) => task.id === id);
//   if (task) {
//     Object.keys(req.body).forEach((key) => {
//       task[key] = req.body[key];
//     });
//     task.updatedAt = new Date();
//     res.send(task);
//   } else {
//     res.status(404).send({ message: 'Cannot find given id' });
//   }
// });

// // DELETE
// app.delete('/tasks/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const taskIdx = tasks.findIndex((task) => task.id === id);
//   if (taskIdx !== -1) {
//     const [deletedTask] = tasks.splice(taskIdx, 1);
//     res.send(deletedTask);
//   } else {
//     res.status(404).send({ message: 'Cannot find given id.' });
//   }
// });

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
