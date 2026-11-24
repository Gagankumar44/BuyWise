import React, { useState, useEffect, useRef } from 'react';
import type { ConversationSession, ChatMessage, HealthStatus } from './types';
import { apiService } from './services/api';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatMessageItem } from './components/ChatMessageItem';
import { MessageComposer } from './components/MessageComposer';
import { SettingsModal } from './components/SettingsModal';
import { DatasetViewerModal } from './components/DatasetViewerModal';
import { Logo } from './components/Logo';
import { 
  PanelLeft, 
  Plus, 
  Database
} from 'lucide-react';

const STORAGE_KEY = 'buywise_conversations_v1';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [datasetOpen, setDatasetOpen] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const latestAiMessageRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading sessions from localStorage:', e);
    }

    // Initial Health Check
    checkBackendHealth();
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Error saving sessions to localStorage:', e);
    }
  }, [sessions]);

  // Scroll to bottom when switching sessions or opening a conversation
  useEffect(() => {
    if (activeSessionId) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 20);
    }
  }, [activeSessionId]);

  const handleStreamProgress = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    // Only gently follow if the user is already near the bottom (never jerk if user scrolled up)
    if (distanceFromBottom < 100) {
      chatContainerRef.current.scrollTop = scrollHeight;
    }
  };

  const checkBackendHealth = () => {
    apiService.checkHealth()
      .then(data => setHealth(data))
      .catch(() => setHealth(null));
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const currentMessages = activeSession ? activeSession.messages : [];

  const handleNewChat = () => {
    setActiveSessionId(null);
    setInput('');
  };

  const createSessionIfNeeded = (firstMessageText: string): ConversationSession => {
    const newSession: ConversationSession = {
      id: `session_${Date.now()}`,
      title: firstMessageText.slice(0, 32) + (firstMessageText.length > 32 ? '...' : ''),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    return newSession;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || input;
    if (!rawText.trim() || isLoading) return;

    const messageText = rawText.trim();
    setInput('');
    setIsLoading(true);
    setStreamingMessageId(null);

    // Scroll smoothly to bottom so user message and loading indicator are visible
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 40);

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
      status: 'sent'
    };

    let targetSessionId = activeSessionId;
    let updatedSessions = [...sessions];

    if (!targetSessionId) {
      // Create new session
      const newSession = createSessionIfNeeded(messageText);
      newSession.messages.push(userMessage);
      updatedSessions = [newSession, ...updatedSessions];
      targetSessionId = newSession.id;
      setActiveSessionId(targetSessionId);
      setSessions(updatedSessions);
    } else {
      // Append to current session
      updatedSessions = updatedSessions.map(s => {
        if (s.id === targetSessionId) {
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      });
      setSessions(updatedSessions);
    }

    // Prepare history payload for API
    const sessionMessages = updatedSessions.find(s => s.id === targetSessionId)?.messages || [userMessage];
    const historyPayload = sessionMessages
      .slice(0, -1) // Exclude latest user message
      .map(m => ({
        role: m.role,
        content: m.content
      }));

    try {
      const response = await apiService.sendMessage(messageText, historyPayload);

      const aiMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'model',
        content: response.reply,
        timestamp: Date.now(),
        products: response.products || [],
        comparison: response.comparison || null,
        isHonestAdvice: response.isHonestAdvice,
        followUpSuggestions: response.followUpSuggestions || [],
        source: response.source,
        status: 'sent'
      };

      setStreamingMessageId(aiMessage.id);

      setSessions(prev =>
        prev.map(s => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              updatedAt: Date.now(),
              messages: [...s.messages, aiMessage]
            };
          }
          return s;
        })
      );

      // Smoothly bring the top of the AI response into view so the user reads from the beginning!
      setTimeout(() => {
        if (latestAiMessageRef.current) {
          latestAiMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 50);
    } catch (err: any) {
      console.error('Failed to get advisor response:', err);

      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'model',
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: Date.now(),
        status: 'error',
        errorMessage: err.message || 'Network error'
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === targetSessionId) {
            return {
              ...s,
              messages: [...s.messages, errorMessage]
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeSession || activeSession.messages.length === 0 || isLoading) return;

    const lastUserMsgIndex = [...activeSession.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMsgIndex === -1) return;

    const actualIndex = activeSession.messages.length - 1 - lastUserMsgIndex;
    const userMessage = activeSession.messages[actualIndex];

    const trimmedMessages = activeSession.messages.slice(0, actualIndex + 1);

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: trimmedMessages
          };
        }
        return s;
      })
    );

    setIsLoading(true);
    setStreamingMessageId(null);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 40);

    const historyPayload = trimmedMessages
      .slice(0, -1)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await apiService.sendMessage(userMessage.content, historyPayload);

      const aiMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'model',
        content: response.reply,
        timestamp: Date.now(),
        products: response.products || [],
        comparison: response.comparison || null,
        isHonestAdvice: response.isHonestAdvice,
        followUpSuggestions: response.followUpSuggestions || [],
        source: response.source,
        status: 'sent'
      };

      setStreamingMessageId(aiMessage.id);

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, aiMessage]
            };
          }
          return s;
        })
      );

      setTimeout(() => {
        if (latestAiMessageRef.current) {
          latestAiMessageRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 50);
    } catch (err: any) {
      console.error('Error during regenerate:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all conversation history?')) {
      setSessions([]);
      setActiveSessionId(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafafa] font-sans text-zinc-900">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectSession={(id) => setActiveSessionId(id)}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAll}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenDataset={() => setDatasetOpen(true)}
        backendOnline={Boolean(health)}
        geminiActive={Boolean(health?.gemini_configured)}
      />

      {/* Main Conversation Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#fafafa] relative">
        {/* Top Navbar */}
        <header className="h-14 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors btn-tactile"
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="font-display font-bold text-sm text-zinc-950 tracking-tight">BuyWise</span>
              <span className="text-zinc-300">/</span>
              <span className="text-xs text-zinc-500 font-mono truncate max-w-[200px] sm:max-w-xs">
                {activeSession ? activeSession.title : 'AI Shopping Advisor'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDatasetOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-mono font-medium rounded-xl border border-zinc-200/80 transition-colors btn-tactile"
            >
              <Database className="w-3.5 h-3.5 text-zinc-900" />
              <span>Dataset (25)</span>
            </button>

            <button
              type="button"
              onClick={handleNewChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-semibold rounded-xl transition-colors btn-tactile shadow-subtle ring-1 ring-white/10"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">New Consultation</span>
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
          {currentMessages.length === 0 ? (
            <WelcomeScreen onSelectPrompt={(promptText) => handleSendMessage(promptText)} />
          ) : (
            <div className="max-w-3xl mx-auto">
              {currentMessages.map((msg, index) => {
                const isLatestAi = index === currentMessages.length - 1 && msg.role === 'model';
                return (
                  <div
                    key={msg.id}
                    ref={isLatestAi ? latestAiMessageRef : null}
                    className="scroll-mt-6"
                  >
                    <ChatMessageItem
                      message={msg}
                      isLatest={isLatestAi}
                      isStreaming={streamingMessageId === msg.id}
                      onStreamingComplete={() => setStreamingMessageId(null)}
                      onStreamProgress={handleStreamProgress}
                      onRegenerate={handleRegenerate}
                      onSelectFollowUp={(suggestion) => handleSendMessage(suggestion)}
                    />
                  </div>
                );
              })}

              {/* Loading Typing Indicator */}
              {isLoading && (
                <div className="flex items-start gap-3 mb-8 text-left animate-cascade">
                  <div className="shrink-0 mt-1">
                    <Logo size="sm" />
                  </div>
                  <div className="bg-white border border-zinc-200/90 rounded-2xl px-5 py-4 shadow-subtle flex items-center gap-3 text-xs text-zinc-600 font-mono">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-bounce"></div>
                    </div>
                    <span>Evaluating requirements against product database...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Fixed Message Composer at Bottom */}
        <footer className="shrink-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/95 to-transparent pt-2">
          <MessageComposer
            input={input}
            setInput={setInput}
            onSend={() => handleSendMessage()}
            isLoading={isLoading}
          />
        </footer>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        health={health}
        onRefreshHealth={checkBackendHealth}
      />

      {/* Product Dataset Viewer Modal */}
      <DatasetViewerModal
        isOpen={datasetOpen}
        onClose={() => setDatasetOpen(false)}
        onAskAboutProduct={(prompt) => handleSendMessage(prompt)}
      />
    </div>
  );
};

export default App;
