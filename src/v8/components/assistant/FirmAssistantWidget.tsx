import React, { useState, useCallback } from 'react';
import { AssistantLauncher } from './AssistantLauncher';
import { AssistantPanel, ChatMessage } from './AssistantPanel';

export const FirmAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (userText: string) => {
    const userMessageId = 'msg_' + Date.now();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: userText,
      timestamp
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/public/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload
        })
      });

      const data = await res.json();
      const assistantMessageId = 'ast_' + Date.now();
      const respTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newAssistantMsg: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.answer || "I don't have approved public information regarding this inquiry. Please contact our chambers directly.",
        citations: Array.isArray(data.citations) ? data.citations : [],
        timestamp: respTimestamp,
        handoff: data.handoff
      };

      setMessages((prev) => [...prev, newAssistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: 'Unable to connect to the firm information service. Please verify your connection or contact our chambers directly.',
        citations: [{ title: 'Contact Desk', url: '/contact' }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        handoff: { available: true, label: 'Contact Chambers' }
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const handleClear = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <>
      <AssistantLauncher
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />
      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearConversation={handleClear}
        onNavigateToCitation={() => setIsOpen(false)}
      />
    </>
  );
};

export default FirmAssistantWidget;
