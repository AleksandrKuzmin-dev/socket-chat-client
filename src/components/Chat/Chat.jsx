import React, { useState, useEffect } from 'react';
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

    const { search } = useLocation();

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search));
        setUserParams(searchParams);
    }, [search]);

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
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.title}>{userParams.room}</div>
                <div className={styles.users}>{numberUsersInRoom} пользователей в комнате</div>
                <button className={styles.left} onClick={leaveRoom}>
                    Покинуть комнату
                </button>
            </div>

            <div className={styles.messages}>
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
                <div className={styles.emoji}>
                    <img src={icon} alt="" onClick={() => setIsEmojiListOpen(prevState => !prevState)} />

                    {isEmojiListOpen && (
                        <div className={styles.emojies}>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>

                <div className={styles.button}>
                    <input type="submit" value="Отправить сообщение" />
                </div>
            </form>
        </div>
    );
};

export default Chat;