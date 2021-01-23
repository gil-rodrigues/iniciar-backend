import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository
    );
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.run({
      date: new Date(2020, 4, 10, 13),
      user_id: '123456',
      provider_id: '123123123'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 8).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.run({
      date: appointmentDate,
      user_id: '123456',
      provider_id: '123123123'
    });

    await expect(
      createAppointment.run({
        date: appointmentDate,
        user_id: '123456',
        provider_id: '123123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.run({
        date: new Date(2020, 4, 10, 11),
        user_id: '123456',
        provider_id: '123123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.run({
        date: new Date(2020, 4, 10, 13),
        user_id: '123123',
        provider_id: '123123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create an appointment before 8h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 6).getTime();
    });

    await expect(
      createAppointment.run({
        date: new Date(2020, 4, 10, 7),
        user_id: '123123',
        provider_id: '123124'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment after 18h', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 6).getTime();
    });

    await expect(
      createAppointment.run({
        date: new Date(2020, 4, 10, 19),
        user_id: '123123',
        provider_id: '123124'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
