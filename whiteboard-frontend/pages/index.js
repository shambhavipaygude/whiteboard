import Link from 'next/link'
export default function Home() {
    return (
        <div>
            <Link href="/createRoom">
                <button>Create Room</button>
            </Link>
            <Link href="/joinRoom">
                <button>Join Room</button>
            </Link>
        </div>
        
        
    );
}