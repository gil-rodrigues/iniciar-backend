import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });
  it('should be able to update the users avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update users avatar with non-existing user', async () => {
    await expect(
      updateUserAvatar.run({
        user_id: 'non-existing',
        avatarFilename: 'avatar.jpg'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete avatar when updating', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    await updateUserAvatar.run({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    expect(user.avatar).toBe('avatar2.jpg');
  });
});
