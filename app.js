import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import Task from './models/task.js';

//------------------------------------------------------------------------------------------------
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Mongo connect error:', err));
//------------------------------------------------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

//------------------------------------------------------------------------------------------------

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

app.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    /**
     *  쿼리 파라미터
     *  sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
     *  count: 태스크 개수
     **/
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);
/* 
request 핸들러: 파라미터를 2개 받는다.
req: 첫번째로 들어온 request 객체
res: 두번째로 들어온 response 객체
res.send: 객체를 제이슨 형태로 보내준다
*/

// 다이나믹 URL
// GET 리퀘스트
app.get(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

// POST 리퀘스트
app.post(
  '/tasks',
  asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
  })
);

// PATCH 리퀘스트
app.patch(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

// DELETE 리퀘스트
app.delete(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    if (task) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

//-------------------------------------------------------------------------------------------

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
/*
3000: 포트 번호, 컴퓨터 내 실행되는 프로세스를 구분짓기 위한 번호 
컨트롤+c: 수정한 것을 다시 보내는 커맨드로, 서버를 다시 꺼야함, 하지만 노드몬이 있으면 자동으로 해줌
*/
