import Appointment from '../infra/typeorm/entities/Appointment';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });
  it('should be able to list the month availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 1).getTime();
    });

    const p = [] as Promise<Appointment>[];

    for (let i = 8; i <= 17; i += 1) {
      p.push(
        fakeAppointmentsRepository.create({
          provider_id: 'user',
          user_id: 'user2',
          date: new Date(2020, 4, 20, i, 0, 0)
        })
      );
    }

    await Promise.all(p);

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user2',
      date: new Date(2020, 4, 21, 8, 0, 0)
    });

    const availability = await listProviderMonthAvailability.run({
      provider_id: 'user',
      year: 2020,
      month: 5
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true }
      ])
    );
  });
});
