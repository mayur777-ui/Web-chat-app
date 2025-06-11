import auth from "../middleware/auth.js";
import {getAllNotifications, getUnreadNotificationsCount, markNotificationAsRead} from '../controllers/notification.controllers.js';
import {Router} from 'express';
const router = Router();

router.get('/Allnotifications', auth, getAllNotifications);
router.get('/unreadCount', auth, getUnreadNotificationsCount);
router.patch('/markAsRead/:notificatoinid', auth, markNotificationAsRead);
export default router;