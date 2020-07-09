import { Router } from 'express';
import multer from 'multer';
import util from 'util';
import { verify } from 'jsonwebtoken';
import CreateUserService from '../services/CreateUserService';
import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UploadUserAvatarService from '../services/UploadUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.run({
    name,
    email,
    password
  });

  delete user.password;

  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const uploadUserAvatar = new UploadUserAvatarService();

    const user = await uploadUserAvatar.run({
      user_id: req.user.id,
      avatarFilename: req.file.filename
    });

    delete user.password;

    return res.json(user);
  }
);

export default usersRouter;
