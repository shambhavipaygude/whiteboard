"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export default function CreateRoom() {
    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        // Generate a unique room ID when the component mounts
        const newRoomId = Math.random().toString(36).slice(2, 11);
        setRoomId(newRoomId);
        socket.emit('join-room', newRoomId); // Emit the room ID to the server
    }, []);

    const copyToClipboard = async() => {
        try {
            await navigator.clipboard.writeText(roomId);
            alert('Room ID copied to clipboard!'); // Notify the user
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div>
            <h1>Room Created!</h1>
            <p>Your Room ID is: {roomId}</p>
            <button onClick={copyToClipboard}>
                Copy Room ID
            </button>
            <p>Share this ID with your friends!</p>
        </div>
    );
}
