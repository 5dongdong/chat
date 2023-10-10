import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';

const ChatRoom = () => {
    const [roomId, setRoomId] = useState('');
    const [room, setRoom] = useState({});
    const [sender, setSender] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const savedRoomId = localStorage.getItem('wschat.roomId');
        const savedSender = localStorage.getItem('wschat.sender');
        if (savedRoomId && savedSender) {
            setRoomId(savedRoomId);
            setSender(savedSender);
            findRoom();
            connect();
        }
    }, []);

    const findRoom = () => {
        axios.get(`/chat/room/${roomId}`).then(response => {
            setRoom(response.data);
        });
    };

    const sendMessage = () => {
        ws.send(
            '/app/chat/message',
            {},
            JSON.stringify({
                type: 'TALK',
                roomId,
                sender,
                message
            })
        );
        setMessage('');
    };

    const recvMessage = recv => {
        setMessages(prevMessages => [
            {
                type: recv.type,
                sender: recv.type === 'ENTER' ? '[알림]' : recv.sender,
                message: recv.message
            },
            ...prevMessages
        ]);
    };

    const connect = () => {
        const sock = new SockJS('/ws/chat');
        const ws = Stomp.over(sock);
        let reconnect = 0;

        ws.connect(
            {},
            frame => {
                ws.subscribe(`/topic/chat/room/${roomId}`, message => {
                    const recv = JSON.parse(message.body);
                    recvMessage(recv);
                });
                ws.send('/app/chat/message', {}, JSON.stringify({ type: 'ENTER', roomId, sender }));
            },
            error => {
                if (reconnect++ <= 5) {
                    setTimeout(() => {
                        console.log('connection reconnect');
                        const newSock = new SockJS('/ws/chat');
                        const newWs = Stomp.over(newSock);
                        connect();
                    }, 10 * 1000);
                }
            }
        );
    };

    return (
        <div className="container" id="app">
            <div>
                <h2>{room.name}</h2>
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <label className="input-group-text">내용</label>
                </div>
                <input
                    type="text"
                    className="form-control"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={sendMessage}>
                        보내기
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {messages.map((message, index) => (
                    <li key={index} className="list-group-item">
                        {message.sender} - {message.message}
                    </li>
                ))}
            </ul>
            <div></div>
        </div>
    );
};
export default ChatRoom;
