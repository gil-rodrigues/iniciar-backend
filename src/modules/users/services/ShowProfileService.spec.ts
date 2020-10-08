import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    const profile = await showProfile.run({
      user_id: user.id
    });

    expect(profile.name).toBe('Jose Maria');
    expect(profile.email).toBe('josemaria@exemplo.com');
  });
  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfile.run({
        user_id: 'non-existing'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
