import useAuthStore from '../store/useAuthStore'
import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { WEB_SOCKET_URL } from '../config/paths'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export default function ChatRoom() {
  const username = useAuthStore(s => s.username)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const clientRef = useRef(null)
  const wsUrl = useMemo(() => WEB_SOCKET_URL, [])

  useEffect(() => {
    if (!username) return

    const socket = new SockJS(wsUrl)
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000
    })

    client.onConnect = () => {
      client.subscribe('/topic/public', payload => {
        try {
          const message = JSON.parse(payload.body)
          setMessages(prev => [...prev, message])
        } catch (error) {
          console.error('Error parsing message', error)
        }
      })

      client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN' })
      })
    }

    client.onStompError = () => {}
    clientRef.current = client
    client.activate()

    return () => {
      try { clientRef.current?.deactivate() } catch {}
      clientRef.current = null
    }
  }, [username, wsUrl])

  const onChange = useCallback(e => setInput(e.target.value), [])
  const sendMessage = useCallback(() => {
    const text = input.trim()
    if (!text || !clientRef.current || !clientRef.current.connected) return
    clientRef.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ sender: username, content: text, type: 'CHAT' })
    })
    setInput('')
  }, [username, input])

  const onKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  return (
    <div className='p-4'>
      <h1 className='text-xl mb-2'>Chat Room</h1>
      <p className='mb-3'>{username ? `${username} joined` : 'Joining...'}</p>

      <div className='border rounded p-2 h-64 overflow-auto'>
        {messages.map((msg, index) => (
          <div key={index} className='mb-1'>
            {msg.type === 'JOIN' && <em>{msg.sender} joined</em>}
            {msg.type === 'LEAVE' && <em>{msg.sender} left</em>}
            {msg.type === 'CHAT' && <span>{msg.sender}: {msg.content}</span>}
          </div>
        ))}
      </div>

      <div className='flex gap-2'>
        <input
          type='text'
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder='Type your message here'
          className='border px-2 py-1 flex-1'
        />
        <button onClick={sendMessage} className='bg-blue-500 text-white px-2 py-1'>Send</button>
      </div>
    </div>
  )
}