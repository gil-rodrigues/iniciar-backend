import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it('should be able recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.run({
      email: 'josemaria@exemplo.com'
    });

    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recover a non-existing e-mail', async () => {
    await expect(
      sendForgotPasswordEmail.run({
        email: 'josemaria@exemplo.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Jose Maria',
      email: 'josemaria@exemplo.com',
      password: '123456'
    });

    await sendForgotPasswordEmail.run({ email: 'josemaria@exemplo.com' });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
