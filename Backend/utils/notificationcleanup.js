import cron from 'node-cron';
import  NOTIFICATION from '../models/notification.model.js';
import { NOTIFICATION_TYPES } from '../utils/notification.types.js';    

const cleanOldReadNotifications = async () => {
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h

  try {
    const result = await NOTIFICATION.deleteMany({
      createdAt: { $lt: cutoffTime },
      status: 'read',
    });

    // console.log(`[CRON] Cleaned ${result.deletedCount} read notifications older than 24h`);
  } catch (err) {
    console.error('[CRON ERROR]:', err.message);
  }
};

cron.schedule('0 * * * *', cleanOldReadNotifications);

