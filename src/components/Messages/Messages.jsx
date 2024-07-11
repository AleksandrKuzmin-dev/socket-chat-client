import React from 'react';
import styles from './messages.module.css';

const Messages = ({ messages, name }) => {

  return (
    <div className={styles.messages}>
      {
        messages.map((message, index) => (
          <Message message={message} name={name} key={index} />
        ))
      }
    </div>
  );
};

const Message = ({ message: { user, message }, name }) => {
  const isOurMessage = user.name === name;
  const className = isOurMessage ? styles.me : styles.user;
  
  return(
    <div className={`${styles.message} ${className}`}>
        <span className={styles.user}>{user.name}</span>
        <div className={styles.text}>{message}</div>
    </div>
  )
}

export default Messages;