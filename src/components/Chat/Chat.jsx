import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import useSocket from '../../hooks/useSocket';
import Messages from '../Messages/Messages';

import icon from '../../assets/emoji.svg';
import styles from './chat.module.css';

const Chat = () => {
    const [userParams, setUserParams] = useState({
        name: '',
        room: ''
    });

    const [messages, setMessages] = useState([]);
    const [numberUsersInRoom, setNumberUsersInRoom] = useState(0);
    const [enteredMessage, setEnteredMessage] = useState('');
    const [isEmojiListOpen, setIsEmojiListOpen] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);

    const { search } = useLocation();
    const chatRef = useRef();
    const emojiListRef = useRef();

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search));
        setUserParams(searchParams);
    }, [search]);

    useEffect(() => {
        const chat = chatRef.current;
        if (!chat) return;

        const handleScroll = () => {
            if (chat.scrollTop === chat.scrollHeight - chat.clientHeight) {
                setAutoScroll(true);
            } else {
                setAutoScroll(false);
            }
        }

        chat.addEventListener('scroll', handleScroll);

        return () => {
            chat.removeEventListener('scroll', handleScroll);
        }
     
    }, [chatRef]);

    useEffect(() => {
        const chat = chatRef.current;
        if (!chat) return;

        if (autoScroll) {
            chat.scrollTop = chat.scrollHeight - chat.clientHeight;
        };
    }, [messages]);

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

    const { sendMessage, leaveRoom } = useSocket(userParams, setMessages, setNumberUsersInRoom);

    const handleEnteredMessage = ({ target: { value } }) => setEnteredMessage(value);

    const onEmojiClick = ({ emoji }) => setEnteredMessage(`${enteredMessage}${emoji}`);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (enteredMessage.trim() === '') return;

        sendMessage({
            room: userParams.room,
            name: userParams.name,
            message: enteredMessage
        });

        setEnteredMessage('');
    };

    return (
        <>
            <div className={styles.wrap}>
                <div className={styles.header}>
                    <div className={styles.title}>{userParams.room}</div>
                    <div className={styles.users}>{numberUsersInRoom} пользователей в комнате</div>
                    <button className={styles.left} onClick={leaveRoom}>
                        Покинуть комнату
                    </button>
                </div>

                <div className={styles.messages} ref={chatRef}>
                    <Messages messages={messages} name={userParams.name} />
                </div>

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
            </div>
            <div className={styles.deviceError}>
                <p>Извините, на данный момент наш чат не работает с мобильными устройствами.</p>
            </div>
        </>
    );
};

export default Chat;