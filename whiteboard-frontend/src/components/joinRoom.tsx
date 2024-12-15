"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

const socket = io('http://localhost:4000'); 

export default function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkRoomId = async () => {
        if (!roomId) {
            setError("Please enter a room ID.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:4000/api/validate-room/${roomId}`);
            const data = await response.json();

            if (data.valid) {
                socket.emit('join-room', roomId);
                router.push(`/canvas/${roomId}`); // Redirect to canvas page with room ID
            } else {
                setError("Room ID does not exist.");
            }
        } catch (error) {
            setError("An error occurred while checking the room ID.");
            console.error("Error checking room ID:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{ padding: '8px', width: '200px' }}
            />
            <button
                onClick={checkRoomId}
                style={{ padding: '8px 16px', marginLeft: '8px' }}
                disabled={loading}
            >
                {loading ? "Joining..." : "Join Room"}
            </button>
            {error && (
                <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
            )}
        </div>
    );
}
