import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UploadUserAvatarService from '@modules/users/services/UploadUserAvatarService';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const uploadUserAvatar = container.resolve(UploadUserAvatarService);

    const user = await uploadUserAvatar.run({
      user_id: req.user.id,
      avatarFilename: req.file.filename
    });

    return res.json(user);
  }
}
