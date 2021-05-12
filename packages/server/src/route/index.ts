import { Express } from 'express';
import HttpStatusCode from '../types';
import { CustomError } from '../util';

import {
  checkCreateCategory,
  checkDeleteCategory,
  checkUpdateCategory,
  createCategory,
  deleteCategory,
  queryCategories,
  updateCategory,
} from './category';
import { checkGetTransaction, getTransactions } from './transaction';

export default function createRouter(app: Express) {
  app.post('/api/categories', checkCreateCategory, createCategory);
  app.get('/api/categories', queryCategories);
  app.put('/api/categories', checkUpdateCategory, updateCategory);
  app.delete('/api/categories', checkDeleteCategory, deleteCategory);

  app.get('/api/transaction', checkGetTransaction, getTransactions);

  app.use(function (_, __, next) {
    next(new CustomError(HttpStatusCode.NOT_FOUND, { message: 'route did not exist' }));
  });
}
