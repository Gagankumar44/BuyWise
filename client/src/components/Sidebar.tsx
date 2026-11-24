import React from 'react';
import type { ConversationSession } from '../types';
import { Logo } from './Logo';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  Database, 
  PanelLeftClose
} from 'lucide-react';

interface SidebarProps {
  sessions: ConversationSession[];
  activeSessionId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
  onOpenDataset: () => void;
  backendOnline: boolean;
  geminiActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  onOpenSettings,
  onOpenDataset,
  backendOnline,
  geminiActive
}) => {
  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-[#f4f4f5]/80 backdrop-blur-md border-r border-zinc-200/90 transition-transform duration-200 ease-emil-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'
        } ${!isOpen ? 'md:hidden' : 'md:flex'}`}
      >
        {/* Top Header / Brand with New Logo */}
        <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between">
          <Logo size="md" />

          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-lg transition-colors btn-tactile"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Consultation Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-semibold rounded-xl btn-tactile shadow-sm ring-1 ring-white/10"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Status Indicator Pill */}
        <div className="px-3 py-1">
          <div className="flex items-center justify-between px-3 py-2 bg-white border border-zinc-200/80 rounded-xl text-xs shadow-subtle">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline
                    ? geminiActive
                      ? 'bg-emerald-500 ring-2 ring-emerald-100'
                      : 'bg-zinc-700'
                    : 'bg-amber-500'
                }`}
              />
              <span className="text-[11px] font-medium text-zinc-800">
                {backendOnline
                  ? geminiActive
                    ? 'Gemini Intelligence'
                    : 'Local Advisor Engine'
                  : 'Backend Connecting...'}
              </span>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-900 underline"
            >
              Config
            </button>
          </div>
        </div>

        {/* Recent Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Recent Consultations
            </span>
            {sessions.length > 0 && (
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-200/70 px-1.5 py-0.2 rounded">
                {sessions.length}
              </span>
            )}
          </div>

          {sessions.length === 0 ? (
            <div className="p-5 text-center text-xs text-zinc-400">
              <MessageSquare className="w-5 h-5 mx-auto mb-2 opacity-30 stroke-[1.5]" />
              <p className="font-medium text-zinc-500">No chats yet</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Ask about laptops, audio, or phones</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs btn-tactile ${
                    isActive
                      ? 'bg-white shadow-subtle text-zinc-950 font-semibold border border-zinc-200/90'
                      : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-zinc-900 stroke-[2]' : 'text-zinc-400 group-hover:text-zinc-700 stroke-[1.5]'
                      }`}
                    />
                    <span className="truncate">{session.title || 'Shopping Inquiry'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Utility Actions */}
        <div className="p-3 border-t border-zinc-200/80 space-y-1">
          <button
            type="button"
            onClick={onOpenDataset}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-white hover:shadow-subtle rounded-xl btn-tactile border border-transparent hover:border-zinc-200/60"
          >
            <Database className="w-4 h-4 text-zinc-900" />
            <span className="font-medium">Browse Product Dataset</span>
            <span className="ml-auto text-[10px] font-mono bg-zinc-200/80 px-1.5 py-0.5 rounded text-zinc-700 font-semibold">
              25 items
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-700 hover:bg-white hover:shadow-subtle rounded-xl btn-tactile border border-transparent hover:border-zinc-200/60"
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            <span>Settings & AI Engine</span>
          </button>

          {sessions.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-rose-600 hover:bg-rose-50/70 rounded-xl btn-tactile"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
