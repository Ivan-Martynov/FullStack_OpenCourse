import "./Notification.css";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification;
  });

  return (
    notification.message && (
      <div className={`notification notification-${notification.class}`}>
        {notification.message}
      </div>
    )
  );
};

export default Notification;
