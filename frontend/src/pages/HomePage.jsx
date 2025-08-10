import React from 'react';
import { useChatStore } from '../store/useChatStore.js';
import Sidebar from '../components/Sidebar.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';

function HomePage() {
  const { selectedUser } = useChatStore();
  
  return (
    <div className="h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-full max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)]">
        <div className="flex h-full rounded-lg overflow-hidden">
          <Sidebar />

          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  )
}

export default HomePage
