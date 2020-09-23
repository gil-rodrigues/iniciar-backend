import { Router } from 'express';
import multer from 'multer';
import util from 'util';
import { verify } from 'jsonwebtoken';
import uploadConfig from '@config/upload';
import CreateUserService from '@modules/users/services/CreateUserService';

import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

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
