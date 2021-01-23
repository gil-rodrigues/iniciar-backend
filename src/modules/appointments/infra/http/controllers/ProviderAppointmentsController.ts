import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import AppError from '@shared/errors/AppError';

export default class ProviderAppointmentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const provider_id = req.user.id;
    const { day, month, year } = req.query;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService
    );

    const appointments = await listProviderAppointments.run({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year)
    });

    if (!appointments) throw new AppError('Error on getting appointments');

    return res.json(appointments);
  }
}
