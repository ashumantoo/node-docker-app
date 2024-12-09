import express from 'express';
import { deleteUser, getUser, signin, signup } from '../controllers/user.controller.js';

const UserRouter = express.Router();

UserRouter.post('/user/signup', signup);
UserRouter.post('/user/signin', signin);
UserRouter.get('/user/:id', getUser);
UserRouter.delete('/user/:id', deleteUser);

export default UserRouter;