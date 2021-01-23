import Appointment from '../infra/typeorm/entities/Appointment';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository
    );
  });
  it('should be able to list the appointments of a given provider in a given day', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 1).getTime();
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 14, 0, 0)
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user2',
      date: new Date(2020, 4, 20, 15, 0, 0)
    });

    const appointments = await listProviderAppointments.run({
      provider_id: 'user',
      year: 2020,
      month: 5,
      day: 20
    });

    await expect(appointments).toEqual([appointment1, appointment2]);
  });
});
