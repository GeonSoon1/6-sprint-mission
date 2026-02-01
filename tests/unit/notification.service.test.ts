import { NotificationService } from '../../src/modules/notifications/notification.service';
import { NotificationRepository } from '../../src/modules/notifications/notification.repository';
import * as socketUtils from '../../src/socket';

jest.mock('../../src/modules/notifications/notification.repository');
jest.mock('../../src/socket');

describe('NotificationService Unit Test', () => {
  let notificationService: NotificationService;
  let notificationRepository: jest.Mocked<NotificationRepository>;

  beforeEach(() => {
    notificationRepository =
      new NotificationRepository() as jest.Mocked<NotificationRepository>;
    notificationService = new NotificationService(notificationRepository);
    jest.clearAllMocks();
  });

  test('create - 알림 생성 및 소켓 전송', async () => {
    const userId = 'user-uuid';
    const message = 'test message';
    const createdNotification = {
      id: 'noti-id',
      userId,
      message,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    notificationRepository.create.mockResolvedValue(createdNotification);
    const notifyUserSpy = jest.spyOn(socketUtils, 'notifyUser');

    const result = await notificationService.create(userId, message);

    expect(notificationRepository.create).toHaveBeenCalledWith(userId, message);
    expect(notifyUserSpy).toHaveBeenCalledWith(userId, 'notification', message);
    expect(result).toEqual(createdNotification);
  });

  test('getMyNotifications - 알림 목록 조회', async () => {
    const userId = 'user-uuid';
    const query = { cursor: 'cursor-id', limit: '20' };
    const notifications = [{ id: '1' }, { id: '2' }];
    notificationRepository.findByUserId.mockResolvedValue(notifications as any);

    const result = await notificationService.getMyNotifications(
      { id: userId },
      query
    );

    expect(notificationRepository.findByUserId).toHaveBeenCalledWith({
      userId,
      cursor: 'cursor-id',
      limit: 20,
    });
    expect(result).toEqual(notifications);
  });

  test('getMyNotifications - limit 기본값 테스트', async () => {
    const userId = 'user-uuid';
    const query = {};
    notificationRepository.findByUserId.mockResolvedValue([]);

    await notificationService.getMyNotifications({ id: userId }, query);

    expect(notificationRepository.findByUserId).toHaveBeenCalledWith({
      userId,
      cursor: undefined,
      limit: 10,
    });
  });

  test('getUnreadCount - 읽지 않은 알림 개수 조회', async () => {
    const userId = 'user-uuid';
    notificationRepository.countUnread.mockResolvedValue(5);

    const result = await notificationService.getUnreadCount({ id: userId });

    expect(notificationRepository.countUnread).toHaveBeenCalledWith(userId);
    expect(result).toBe(5);
  });

  test('readNotification - 알림 읽음 처리', async () => {
    const userId = 'user-uuid';
    const notificationId = 'noti-id';
    notificationRepository.updateRead.mockResolvedValue({ count: 1 } as any);

    const result = await notificationService.readNotification(notificationId, {
      id: userId,
    });

    expect(notificationRepository.updateRead).toHaveBeenCalledWith(
      notificationId,
      userId
    );
  });
});
