import React from 'react';
import { useState, useEffect, useRef } from 'react';

import EmojiPicker from "emoji-picker-react";

import icon from '../../assets/emoji.svg';
import styles from './messageInput.module.css';

const MessageInput = ({ onSendMessage }) => {
    const [enteredMessage, setEnteredMessage] = useState('');
    const [isEmojiListOpen, setIsEmojiListOpen] = useState(false);

    const emojiListRef = useRef();

    useEffect(() => {
        const emojiList = emojiListRef.current;
        if(!emojiList) return;
   
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsEmojiListOpen(false);
        };

        const handleClick = (e) => {
            if (!emojiList.contains(e.target)) {
                setIsEmojiListOpen(false);
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleEscape);
        }

    }, [emojiListRef]);

    const handleEnteredMessage = ({ target: { value } }) => setEnteredMessage(value);
    const onEmojiClick = ({ emoji }) => setEnteredMessage(`${enteredMessage}${emoji}`);

    const handleSendMessage = (e) => {
        onSendMessage(e, enteredMessage, setEnteredMessage);
    };

  return (
    <form className={styles.form} onSubmit={handleSendMessage}>
        <div className={styles.input}>
            <input
                type="text"
                name="message"
                placeholder="Что хочешь написать?"
                value={enteredMessage}
                onChange={handleEnteredMessage}
                autoComplete="off"
                required
            />
        </div>
        <div className={styles.emoji} ref={emojiListRef}>
            <img src={icon} alt="" onClick={() => setIsEmojiListOpen(prevState => !prevState)} />

            {isEmojiListOpen && (
                <div className={styles.emojies}>
                    <EmojiPicker onEmojiClick={onEmojiClick} skinTonesDisabled theme='dark'/>
                </div>
            )}
        </div>

        <div className={styles.button}>
            <input type="submit" value="Отправить сообщение" />
        </div>
</form>
  )
}

export default MessageInput