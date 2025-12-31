'use client';

import { useState, useEffect, useRef } from 'react';

export default function WhatsAppMessenger() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Alice Johnson', avatar: '👩', lastMessage: 'Hey! How are you?', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Bob Smith', avatar: '👨', lastMessage: 'See you tomorrow', time: '9:15 AM', unread: 0 },
    { id: 3, name: 'Team Group', avatar: '👥', lastMessage: 'Meeting at 3pm', time: 'Yesterday', unread: 5 },
    { id: 4, name: 'Mom', avatar: '👩‍🦳', lastMessage: 'Call me when you can', time: 'Yesterday', unread: 1 },
    { id: 5, name: 'John Doe', avatar: '👤', lastMessage: 'Thanks for your help!', time: 'Monday', unread: 0 },
  ]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize messages for each contact
    const initialMessages = {
      1: [
        { id: 1, text: 'Hey! How are you?', sender: 'them', time: '10:25 AM' },
        { id: 2, text: 'I wanted to catch up soon', sender: 'them', time: '10:30 AM' },
      ],
      2: [
        { id: 1, text: 'Looking forward to the meeting tomorrow', sender: 'me', time: '9:10 AM' },
        { id: 2, text: 'See you tomorrow', sender: 'them', time: '9:15 AM' },
      ],
      3: [
        { id: 1, text: 'Don\'t forget about the meeting', sender: 'them', time: 'Yesterday' },
        { id: 2, text: 'Meeting at 3pm', sender: 'them', time: 'Yesterday' },
      ],
      4: [
        { id: 1, text: 'Hi sweetie, hope you\'re doing well', sender: 'them', time: 'Yesterday' },
        { id: 2, text: 'Call me when you can', sender: 'them', time: 'Yesterday' },
      ],
      5: [
        { id: 1, text: 'Thanks for your help!', sender: 'them', time: 'Monday' },
      ],
    };
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedContact) return;

    const newMessage = {
      id: (messages[selectedContact.id]?.length || 0) + 1,
      text: inputMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));

    setContacts(prev => prev.map(c =>
      c.id === selectedContact.id
        ? { ...c, lastMessage: inputMessage, time: 'Now', unread: 0 }
        : c
    ));

    setInputMessage('');
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setContacts(prev => prev.map(c =>
      c.id === contact.id ? { ...c, unread: 0 } : c
    ));
  };

  const handleDeleteMessage = (messageId) => {
    if (!selectedContact) return;
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: prev[selectedContact.id].filter(m => m.id !== messageId),
    }));
  };

  const handleDeleteChat = (contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    if (selectedContact?.id === contactId) {
      setSelectedContact(null);
    }
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[contactId];
      return newMessages;
    });
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.headerTitle}>Chats</h2>
          <div style={styles.headerIcons}>
            <button style={styles.iconButton}>💬</button>
            <button style={styles.iconButton}>⋮</button>
          </div>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search or start new chat"
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={styles.contactsList}>
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              style={{
                ...styles.contactItem,
                backgroundColor: selectedContact?.id === contact.id ? '#f0f2f5' : 'white',
              }}
              onClick={() => handleContactClick(contact)}
            >
              <div style={styles.avatar}>{contact.avatar}</div>
              <div style={styles.contactInfo}>
                <div style={styles.contactHeader}>
                  <span style={styles.contactName}>{contact.name}</span>
                  <span style={styles.messageTime}>{contact.time}</span>
                </div>
                <div style={styles.contactFooter}>
                  <span style={styles.lastMessage}>{contact.lastMessage}</span>
                  {contact.unread > 0 && (
                    <span style={styles.unreadBadge}>{contact.unread}</span>
                  )}
                </div>
              </div>
              <button
                style={styles.deleteContactBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete chat with ${contact.name}?`)) {
                    handleDeleteChat(contact.id);
                  }
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>
        {selectedContact ? (
          <>
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderLeft}>
                <div style={styles.avatarLarge}>{selectedContact.avatar}</div>
                <div>
                  <div style={styles.chatHeaderName}>{selectedContact.name}</div>
                  <div style={styles.chatHeaderStatus}>online</div>
                </div>
              </div>
              <div style={styles.chatHeaderIcons}>
                <button style={styles.iconButton}>🔍</button>
                <button style={styles.iconButton}>⋮</button>
              </div>
            </div>

            <div style={styles.messagesContainer}>
              {messages[selectedContact.id]?.map(message => (
                <div
                  key={message.id}
                  style={{
                    ...styles.messageWrapper,
                    justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      backgroundColor: message.sender === 'me' ? '#d9fdd3' : 'white',
                    }}
                  >
                    <div style={styles.messageText}>{message.text}</div>
                    <div style={styles.messageFooter}>
                      <span style={styles.messageTime}>{message.time}</span>
                      {message.sender === 'me' && (
                        <button
                          style={styles.deleteMessageBtn}
                          onClick={() => {
                            if (confirm('Delete this message?')) {
                              handleDeleteMessage(message.id);
                            }
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form style={styles.inputContainer} onSubmit={handleSendMessage}>
              <button type="button" style={styles.iconButton}>😊</button>
              <button type="button" style={styles.iconButton}>📎</button>
              <input
                type="text"
                placeholder="Type a message"
                style={styles.messageInput}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit" style={styles.sendButton}>
                ➤
              </button>
            </form>
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>💬</div>
            <h2 style={styles.emptyStateTitle}>WhatsApp Message Manager</h2>
            <p style={styles.emptyStateText}>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  sidebar: {
    width: '400px',
    backgroundColor: 'white',
    borderRight: '1px solid #e9edef',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '15px 20px',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
  },
  headerIcons: {
    display: 'flex',
    gap: '15px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
  },
  searchContainer: {
    padding: '10px',
    backgroundColor: 'white',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #e9edef',
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  contactsList: {
    flex: 1,
    overflowY: 'auto',
  },
  contactItem: {
    display: 'flex',
    padding: '15px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f2f5',
    position: 'relative',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#dfe5e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginRight: '15px',
    flexShrink: 0,
  },
  avatarLarge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#dfe5e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginRight: '15px',
  },
  contactInfo: {
    flex: 1,
    minWidth: 0,
  },
  contactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  contactName: {
    fontWeight: '500',
    fontSize: '16px',
  },
  contactFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: '14px',
    color: '#667781',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  messageTime: {
    fontSize: '12px',
    color: '#667781',
  },
  unreadBadge: {
    backgroundColor: '#25d366',
    color: 'white',
    borderRadius: '50%',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '500',
    padding: '0 5px',
  },
  deleteContactBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '5px',
    marginLeft: '10px',
    opacity: 0.6,
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#efeae2',
  },
  chatHeader: {
    backgroundColor: '#f0f2f5',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e9edef',
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  chatHeaderName: {
    fontSize: '16px',
    fontWeight: '500',
  },
  chatHeaderStatus: {
    fontSize: '13px',
    color: '#667781',
  },
  chatHeaderIcons: {
    display: 'flex',
    gap: '20px',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
    backgroundSize: '100% 20px',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '10px',
  },
  messageBubble: {
    maxWidth: '65%',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
    position: 'relative',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '19px',
    marginBottom: '5px',
  },
  messageFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '8px',
  },
  deleteMessageBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '0 2px',
    opacity: 0.6,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: '10px 20px',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  messageInput: {
    flex: 1,
    padding: '10px 15px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '15px',
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#25d366',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    color: 'white',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  emptyStateIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  emptyStateTitle: {
    fontSize: '28px',
    fontWeight: '300',
    color: '#41525d',
    marginBottom: '10px',
  },
  emptyStateText: {
    fontSize: '14px',
    color: '#667781',
  },
};
