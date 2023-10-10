import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
    const [roomName, setRoomName] = useState('');
    const [chatrooms, setChatrooms] = useState([]);

    useEffect(() => {
        findAllRoom();
    }, []);

    const findAllRoom = () => {
        axios.get('/chat/rooms')
            .then(response => setChatrooms(response.data))
            .catch(error => console.error('Error fetching chat rooms:', error));
    };

    const createRoom = () => {
        if (roomName === '') {
            alert('Please enter a room name.');
            return;
        }

        const params = new URLSearchParams();
        params.append('name', roomName);

        axios.post('/chat/room', params)
            .then(response => {
                alert(`${response.data.roomName} room has been created successfully.`);
                setRoomName('');
                findAllRoom();
            })
            .catch(error => alert('Failed to create a chat room.'));
    };

    const enterRoom = (roomId) => {
        const sender = prompt('Please enter your display name:');

        if (sender !== null && sender.trim() !== '') {
            localStorage.setItem('wschat.sender', sender);
            localStorage.setItem('wschat.roomId', roomId);
            window.location.href = `/chat/room/enter/${roomId}`;
        }
    };

    return (
        <div className="container" id="app">
            <div className="row">
                <div className="col-md-12">
                    <h3>Chat Room List</h3>
                </div>
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <label className="input-group-text">Room Title</label>
                </div>
                <input
                    type="text"
                    className="form-control"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyUp={(e) => { if (e.key === 'Enter') createRoom(); }}
                />
                <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={createRoom}>
                        Create Chat Room
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {chatrooms.map(item => (
                    <li key={item.roomId} className="list-group-item list-group-item-action" onClick={() => enterRoom(item.roomId)}>
                        {item.roomName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
