import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";

import useSocket from '../../hooks/useSocket';
import Messages from '../Messages/Messages';
import MessageInput from '../MessageInput/MessageInput';

import styles from './chat.module.css';

const Chat = () => {
    const [userParams, setUserParams] = useState({
        name: '',
        room: ''
    });

    const [messages, setMessages] = useState([]);
    const [numberUsersInRoom, setNumberUsersInRoom] = useState(0);
    const [autoScroll, setAutoScroll] = useState(true);

    const { search } = useLocation();
    const chatRef = useRef();
 
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
        };

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

    const { sendMessage, leaveRoom } = useSocket(userParams, setMessages, setNumberUsersInRoom);

    const handleSendMessage = (e, enteredMessage, setEnteredMessage) => {
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

                <MessageInput onSendMessage={handleSendMessage} />
            </div>
            <div className={styles.deviceError}>
                <p>Извините, на данный момент наш чат не работает с мобильными устройствами.</p>
            </div>
        </>
    );
};

export default Chat;