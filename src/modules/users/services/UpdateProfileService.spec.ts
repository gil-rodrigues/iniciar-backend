import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'Jose Manel',
      email: 'josemanel@exemplo.com'
    });

    expect(updatedUser.name).toBe('Jose Manel');
    expect(updatedUser.email).toBe('josemanel@exemplo.com');
  });

  it('should be able to change the email to an already used email', async () => {
    await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'Jose Manel',
        email: 'josemaria@exemplo.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.run({
      user_id: user.id,
      name: 'Jose Manel',
      email: 'josemanel@exemplo.com',
      old_password: '123456',
      password: '645321'
    });

    expect(updatedUser.password).toBe('645321');
  });
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'Jose Manel',
        email: 'josemanel@exemplo.com',
        password: '645321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    await expect(
      updateProfile.run({
        user_id: user.id,
        name: 'Jose Manel',
        email: 'josemanel@exemplo.com',
        old_password: 'wrong-old-password',
        password: '645321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.run({
        user_id: 'non-existing',
        name: 'Test',
        email: 'test@test.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
