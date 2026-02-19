import React, { useEffect, useMemo, useRef, useState } from 'react';
import './AutoChatWidget.css';
import ChatMessage from "./ChatMessage";

const API_URL = process.env.BOT_API_URL || 'https://portfolio-assistant-murex.vercel.app/api/chat';
const STORAGE_KEY = 'portfolio-chat-session-id';

function getOrCreateSessionId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const created = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    // If storage is blocked (private mode / strict settings), fall back to an ephemeral id.
    return crypto.randomUUID();
  }
}

export default function AutoChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: "Hey! I'm Auto. Ask me about Ankit's work, projects, skills, or career journey.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sessionId = useMemo(getOrCreateSessionId, []);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 140);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isOpen]);

  async function sendMessage() {
    const message = inputValue.trim();
    if (!message || isSending) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: message }
    ]);
    setInputValue('');
    setIsSending(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || 'Request failed');
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: data?.reply || '(no reply)' }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: `Error: ${err?.message || 'Unknown error'}` }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  const botEmoji = '\uD83E\uDD16'; // 🤖

  // Prevent global smooth-scroll handlers (Lenis) from hijacking wheel/touch inside the widget.
  // This keeps nested overflow scrolling working (chat body + textarea).
  const stopScrollBubble = (e) => {
    e.stopPropagation();
  };

  const autosizeInput = (el) => {
    if (!el) return;
    el.style.height = 'auto';

    const style = window.getComputedStyle(el);
    const lineHeight = Number.parseFloat(style.lineHeight) || 20;
    const padTop = Number.parseFloat(style.paddingTop) || 0;
    const padBottom = Number.parseFloat(style.paddingBottom) || 0;
    const maxHeight = Math.round(lineHeight * 5 + padTop + padBottom);

    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    if (!isOpen) return;
    autosizeInput(inputRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, isOpen]);

  const handleTypingUpdate = React.useCallback(() => {
    const el = chatBodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);


  return (
    <div className="auto-chat-shell">
      {isOpen ? (
        <div
          className={`auto-chat-panel ${isOpen ? 'is-open' : ''}`}
          id="auto-chat-panel"
          role="dialog"
          aria-label="Auto chat window"
          data-lenis-prevent
          onWheelCapture={stopScrollBubble}
          onTouchMoveCapture={stopScrollBubble}
        >
          <header className="auto-chat-head">
            <div className="auto-chat-id">
              <div className="auto-chat-chip" aria-hidden="true">
                {botEmoji}
              </div>
              <div>
                <p className="auto-chat-title">Auto</p>
                {/* <p className="auto-chat-subtitle">Ask about Ankit's work</p> */}
              </div>
              <p className="auto-chat-subtitle">Ask about Ankit's work</p>
            </div>
            <button type="button" className="auto-chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              X
            </button>
          </header>

          <div
            className="auto-chat-body"
            ref={chatBodyRef}
            data-lenis-prevent
            onWheelCapture={stopScrollBubble}
            onTouchMoveCapture={stopScrollBubble}
          >
            {messages.map((m, idx) => (
              <div key={m.id} className={`auto-chat-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <span className="auto-chat-meta">{m.role === 'user' ? 'You' : 'Auto'}</span>
                <ChatMessage
                  text={m.text}
                  typing={m.role === "assistant"}
                  isLatest={idx === messages.length - 1}
                  onTypingUpdate={handleTypingUpdate}
                />

              </div>
            ))}
          </div>

          <div
            className="auto-chat-composer"
            data-lenis-prevent
            onWheelCapture={stopScrollBubble}
            onTouchMoveCapture={stopScrollBubble}
          >
            <textarea
              ref={inputRef}
              className="auto-chat-input"
              value={inputValue}
              placeholder="Ask about Ankit's projects, skills, or background..."
              data-lenis-prevent
              rows={1}
              onChange={(e) => {
                setInputValue(e.target.value);
                autosizeInput(e.currentTarget);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              onWheelCapture={stopScrollBubble}
              onTouchMoveCapture={stopScrollBubble}
            />
            <button type="button" className="auto-chat-send" onClick={sendMessage} disabled={isSending}>
              {isSending ? (
                <span className="auto-chat-send-dots" aria-hidden="true">
                  ...
                </span>
              ) : (
                <svg
                  className="auto-chat-send-icon"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4.5 19.5 21 12 4.5 4.5 6.6 11.7 14.1 12 6.6 12.3 4.5 19.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`auto-chat-launcher ${isOpen ? 'is-hidden' : ''}`}
          onClick={() => setIsOpen(true)}
          aria-controls="auto-chat-panel"
          aria-expanded={isOpen}
        >
          <span className="auto-chat-launcher-emoji" aria-hidden="true">
            {botEmoji}
          </span>
          <span className="auto-chat-launcher-text">Chat with Auto</span>
        </button>
      )}
    </div>
  );
}
