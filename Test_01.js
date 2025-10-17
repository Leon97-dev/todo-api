// Test_01.js : 롤 챔프 API > DB

import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import MT1 from './models/MT_01.js';

// =======================
// MongoDB 연결
// =======================
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.error('Mongo connect error:', err));

// =======================
// Express 기본 설정
// =======================
const Test1 = express();
Test1.use(cors({ origin: '*' }));
Test1.use(express.json());

// =======================
// 에러 핸들링용 async wrapper
// =======================
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

// =======================
// 전역 요청 로거 (모든 요청 로그 확인)
// =======================
Test1.use((req, res, next) => {
  console.log('REQ', req.method, req.path);
  next();
});

// =======================
// 루트 안내 (Render 연결 확인용)
// =======================
Test1.get('/', (req, res) => {
  res.json({
    message: '✅ Server is running on Render!',
    endpoints: [
      '/champions',
      '/champions/:id',
      '/health',
      '/__routes',
      '/champions/ping',
    ],
    time: new Date().toISOString(),
  });
});

// =======================
// 헬스체크용 라우트
// =======================
Test1.get('/health', (req, res) => {
  res.json({ ok: true });
});

// =======================
// /champions 프리픽스 확인용 ping
// =======================
Test1.get('/champions/ping', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// =======================
// 등록된 라우트 확인용 (디버그 전용)
// =======================
Test1.get('/__routes', (req, res) => {
  const routes = [];
  Test1._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      const method = Object.keys(m.route.methods)[0]?.toUpperCase();
      routes.push({ method, path: m.route.path });
    }
  });
  res.json(routes);
});

// =======================
// 실제 챔피언 API
// =======================
Test1.get(
  '/champions',
  asyncHandler(async (req, res) => {
    console.log('HIT /champions');
    const { sort, count } = req.query;
    const limitNum = Math.max(parseInt(count ?? '0', 10) || 0, 0);
    const sortOption = { createdAt: sort === 'oldest' ? 1 : -1 };

    const result = await MT1.find().sort(sortOption).limit(limitNum).lean();
    res.json(result);
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

// =======================
// 서버 시작
// =======================
Test1.listen(process.env.PORT || 3000, () => console.log('Server Started'));
