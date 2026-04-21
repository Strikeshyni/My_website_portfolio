import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I am an AI chatbot. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const response = await axios.get('/api/projects');
        const chatbotProject = response.data.find(
          (p: any) => p.interactivePath === '/projects/chatbot/demo'
        );
        if (chatbotProject?.slug) {
          setProjectSlug(chatbotProject.slug);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProjectId();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const chatbotApiUrl = import.meta.env.VITE_CHATBOT_API_URL || apiUrl('/chatbot');

    try {
      const response = await fetch(`${chatbotApiUrl}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          use_history: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I could not process your message.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'An error occurred. Please make sure the chatbot server is running and reachable.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-dark section-padding">
      <Link
        to={projectSlug ? `/projects/${projectSlug}` : '/#projects'}
        className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to project
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 gradient-text">
          AI Chatbot
        </h1>

        <div className="glass-effect rounded-2xl p-6 h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-dark-light text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-light px-4 py-3 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write your message..."
              className="flex-1 px-4 py-3 bg-dark-light border border-gray-700 rounded-lg focus:border-primary focus:outline-none"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <div className="mt-6 text-gray-400 text-sm">
          <p>This chatbot uses an open-source Llama model and NLP techniques to provide contextual answers.</p>
          <p className="mt-2">
            💡 The chatbot keeps conversation history and can perform semantic retrieval.
            <br />
            Response time may vary depending on server load and query complexity.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Author: Abel AUBRON<br />
            Date: November 2025
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
