// Test_02,js : 내가 가장 좋아하는 영화 API
import express from 'express';
import movies from './data/DT_02.js';

const PORT = 3001;
const app = express();
app.use(express.json());

// CRUD
app.get('/movies', (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);
  const compareFun =
    sort === 'oldest'
      ? (a, b) => a.createdAt - b.createdAt
      : (a, b) => b.createdAt - a.createdAt;
  let newMovies = movies.sort(compareFun);

  if (count) {
    newMovies = newMovies.slice(0, count);
  }
  res.send(newMovies);
});

app.post('/movies', (req, res) => {
  const data = req.body;
  const ids = movies.map((movie) => movie.id);
  const nextId = Math.max(...ids) + 1;
  const now = new Date();
  const newMovie = {
    ...data,
    id: nextId,
    createdAt: now,
    updatedAt: now,
    isFavorite: false,
  };
  movies.push(newMovie);
  res.status(201).send(newMovie);
});

app.get('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((movie) => movie.id === id);
  if (movie) {
    res.send(movie);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.patch('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movie = movies.find((movie) => movie.id === id);
  if (movie) {
    Object.keys(req.body).forEach((key) => {
      movie[key] = req.body[key];
    });
    movie.updatedAt = new Date();
    res.send(movie);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.delete('/movies/:id', (req, res) => {
  const id = Number(req.params.id);
  const movieIdx = movies.findIndex((movie) => movie.id === id);
  if (movieIdx !== -1) {
    const [deletedMovie] = movies.splice(movieIdx, 1);
    res.send(deletedMovie);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

app.listen(PORT, (err) => {
  console.log(`Server Started ${PORT}`);
  console.error(err);
});
