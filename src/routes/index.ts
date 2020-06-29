// src/routes/index.ts
import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello handsome' });
});
export default routes;
