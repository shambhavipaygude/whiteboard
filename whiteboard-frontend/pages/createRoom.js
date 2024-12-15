import Link from 'next/link'
import CreateRoom from '../src/components/createRoom'
export default function createRoom() {
    return (
        <div>
            <CreateRoom/>  
            <Link href="/canvas">
                <button>Play</button>
            </Link>
        </div>
    );
}