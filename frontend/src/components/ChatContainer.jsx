import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';

function ChatContainer() {
    const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Scroll to bottom function
    const scrollToBottom = (smooth = true) => {
      if (messagesContainerRef.current) {
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            // Force reflow for Firefox
            void container.offsetHeight;
            if ('scrollTo' in container) {
              container.scrollTo({ top: container.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
            } else {
              container.scrollTop = container.scrollHeight;
            }
          }
        }, 100);
      }
    };

    useEffect(() => {
      if (!selectedUser || !selectedUser._id) return;

      getMessages(selectedUser._id);

      subscribeToMessages();

      return () => unsubscribeFromMessages();
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
      if (!selectedUser || !messages || messages.length === 0) return;

      const lastMessage = messages[messages.length - 1];
      const isLastMessageFromUser = lastMessage && lastMessage.senderId === authUser._id;
      
      // Always scroll to bottom for new messages
      const scrollDelay = lastMessage?.image ? 500 : 100; // Longer delay for images
      
      setTimeout(() => {
        scrollToBottom();
      }, scrollDelay);
    }, [messages, authUser._id, selectedUser]);

    // Scroll to bottom when user selection changes and messages are loaded
    useEffect(() => {
      if (!selectedUser || !selectedUser._id || isMessagesLoading || !messages || messages.length === 0) return;
      
      scrollToBottom(false); // Use instant scroll for user switching
    }, [selectedUser?._id, messages, isMessagesLoading]);

    if (!selectedUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">No chat selected</h2>
                    <p className="text-gray-500">Select a user to start chatting</p>
                </div>
            </div>
        );
    }

    if(isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    };

  return (
    <div className="flex-1 flex flex-col h-full max-h-full min-h-0">
      <ChatHeader />

      <div className="flex-grow overflow-y-auto p-4 space-y-4 min-h-0" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              {formatMessageTime(message.createdAt)}
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <div className="relative group">
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-full h-auto max-h-[300px] sm:max-h-[400px] rounded-md mb-2 cursor-pointer object-contain hover:opacity-90 transition-opacity"
                    onClick={(e) => {
                      // Open image in new tab when clicked
                      window.open(message.image, '_blank');
                    }}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="bg-black bg-opacity-50 text-white p-1 rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(message.image, '_blank');
                      }}
                    >
                      View Full Size
                    </button>
                  </div>
                </div>
              )}
              {message.text && <p className="break-words">{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer
