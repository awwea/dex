import { useWeb3 } from 'libs/web3';
import { FC, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getLSUserNotifications } from 'libs/notifications/utils';
import { useNotifications } from 'hooks/useNotifications';
import { useInterval } from 'hooks/useInterval';
import { NotificationLine } from './NotificationLine';

export const NotificationAlerts: FC = () => {
  const { user } = useWeb3();
  const { alerts, notifications, checkStatus, setNotifications } =
    useNotifications();

  useInterval(async () => {
    notifications
      .filter((n) => n.type === 'tx' && n.status === 'pending')
      .forEach((n) => checkStatus(n));
  }, 2000);

  useEffect(() => {
    if (user) {
      const lsNotifications = getLSUserNotifications(user);
      if (lsNotifications) {
        setNotifications(lsNotifications);
      }
    }
  }, [user, setNotifications]);

  return (
    <ul className="fixed top-80 right-10 z-50" data-testid="notification-list">
      <AnimatePresence mode="popLayout">
        {alerts.map((n) => (
          <motion.li
            key={n.id}
            layout
            variants={notificationVariants}
            whileHover="hover"
            initial="initial"
            animate="animate"
            exit="exit"
            className="mb-20 block w-[350px] overflow-hidden rounded-10 border border-white/60  bg-background-900 px-16 py-12"
            data-testid={`notification-${n.testid}`}
          >
            <NotificationLine isAlert notification={n} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

const notificationVariants = {
  initial: {
    opacity: 0,
    scale: 0.2,
    transition: { type: 'spring' },
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: { type: 'spring' },
  },
  hover: { scale: 1.05, transition: { type: 'spring' } },
};
