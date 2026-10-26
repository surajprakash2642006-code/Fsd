import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../config/api'
import './Chat.css'

export default function Chat({ username, token }) {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [connection, setConnection] = useState('connecting')
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, { autoConnect: false, auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnection('connected')
      setError('')
    })
    socket.on('disconnect', () => setConnection('disconnected'))
    socket.on('connect_error', () => {
      setConnection('disconnected')
      setError('Unable to connect to chat. Check that the backend is running.')
    })
    socket.on('chat:message', (newMessage) => {
      setMessages((currentMessages) => [...currentMessages, newMessage])
    })
    socket.on('chat:error', (errorMessage) => setError(errorMessage))

    socket.connect()
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError('Enter a message before sending.')
      return
    }

    if (trimmedMessage.length > 500) {
      setError('Messages must be 500 characters or fewer.')
      return
    }

    if (connection !== 'connected') {
      setError('Chat is not connected. Try again when it reconnects.')
      return
    }

    setError('')
    socketRef.current.emit('chat:send', { username, text: trimmedMessage })
    setMessage('')
  }

  return (
    <section className="chat-panel" aria-label="Real-time chat">
      <div className="chat-heading">
        <p>Chat messages are shared with everyone currently connected. They are not saved.</p>
        <span className={`chat-connection ${connection}`}>
          {connection === 'connected'
            ? 'Connected'
            : connection === 'connecting'
              ? 'Connecting...'
              : 'Disconnected'}
        </span>
      </div>

      <div className="chat-messages" aria-live="polite" aria-relevant="additions">
        {messages.length === 0 ? (
          <p className="chat-empty">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((item) => (
            <article className="chat-message" key={item.id}>
              <div className="chat-message-heading">
                <strong>{item.username}</strong>
                <time dateTime={item.sentAt}>
                  {new Date(item.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <p>{item.text}</p>
            </article>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-message">Message</label>
        <input
          id="chat-message"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message..."
          maxLength={500}
          disabled={connection !== 'connected'}
        />
        <button type="submit" disabled={connection !== 'connected' || !message.trim()}>
          Send
        </button>
      </form>

      {error && <p className="chat-error" role="alert">{error}</p>}
      <p className="chat-character-count">{message.length}/500</p>
    </section>
  )
}
