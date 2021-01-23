import { ObjectID } from 'mongodb';

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '../INotificationsRepository';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    recipient_id,
    content
  }: ICreateNotificationDTO): Promise<Notification> {
    const newNotification = new Notification();

    Object.assign(newNotification, {
      id: new ObjectID(),
      content,
      recipient_id
    });

    this.notifications.push(newNotification);

    return newNotification;
  }
}
