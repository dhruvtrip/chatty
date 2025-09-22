import useAuthStore from '../store/useAuthStore';

export default function ChatRoom() {
const username = useAuthStore(s => s.username);
   
return (
        <div>
            <h1>Chat Room</h1>
            <p>{username? `${username} joined` : 'Joining...'}</p>
        </div>
    )
}