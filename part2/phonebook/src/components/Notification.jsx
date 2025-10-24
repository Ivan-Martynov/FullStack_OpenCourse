const Notification = ({ message, notificationClass }) => {
    if (!message) {
        return null;
    }

    return <div className={"notification " + notificationClass}>{message}</div>;
};

export default Notification;
