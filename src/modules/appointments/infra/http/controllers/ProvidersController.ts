import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import AppError from '@shared/errors/AppError';

export default class AppointmentsController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { user } = req;

    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.run({
      user_id: user.id
    });

    if (!providers) throw new AppError('Error on getting providers');

    return res.json(classToClass(providers));
  }
}
