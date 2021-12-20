import React, { useEffect, useState } from 'react';
import './Navbar.css';
import Message from '../../img/message.svg';
import Settings from '../../img/settings.svg';

const Navbar = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    socket.on('getNotification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });
  }, [socket, notifications]);

  const displayNotification = ({ senderName, type }) => {
    let action;
    if (type === 1) {
      action = 'liked';
    } else if (type === 2) {
      action = 'commented';
    } else {
      action = 'shared';
    }

    return (
      <span className='notification'>{`${senderName} ${action} your post.`}</span>
    );
  };

  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <div className='navbar'>
      <div className='logo'>NotifyApp</div>
      <div className='icons'>
        <div className='icon' onClick={() => setOpen(!open)}>
          <img src='./notification.svg' alt='asd' className='iconImg' />
          {notifications.length > 0 && (
            <div className='counter'>{notifications.length}</div>
          )}
        </div>
        <div className='icon' onClick={() => setOpen(!open)}>
          <img src={Message} alt='asd' className='iconImg' />
        </div>
        <div className='icon'>
          <img src={Settings} alt='asd' className='iconImg' />
        </div>
      </div>
      {open && (
        <div className='notifications'>
          {notifications.map((not) => displayNotification(not))}
          <button className='nButton' onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
