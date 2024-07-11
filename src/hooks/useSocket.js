import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("https://socket-chat-server-gamma.vercel.app/");

const useSocket = (userParams, setMessages, setNumberUsersInRoom) => {
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('join', userParams);

        const handleMessages = ({ data }) => {
            setMessages(prevState => [...prevState, data]);
        };

        const handleNumberUserInRoom = ({ data: { numberUsersInRoom } }) => {
            setNumberUsersInRoom(numberUsersInRoom);
        };

        const handleConnectionDenied = () => {
            alert('Данное имя занято. Если вы переподключаетесь, то попробуйте ещё раз через 5 секунд.');
            navigate('/');
        };

        socket.on('message', handleMessages);
        socket.on('NumberUsersInRoom', handleNumberUserInRoom);
        socket.on('connectionDenied', handleConnectionDenied);

        return () => {
            socket.off('message', handleMessages);
            socket.off('NumberUsersInRoom', handleNumberUserInRoom);
            socket.off('connectionDenied', handleConnectionDenied);
        };
    }, [userParams, navigate, setMessages, setNumberUsersInRoom]);

    const sendMessage = (message) => {
        socket.emit('message', message);
    };

    const leaveRoom = () => {
        socket.emit('leftRoom', userParams);
        navigate('/');
    };

    return { sendMessage, leaveRoom };
};

export default useSocket;