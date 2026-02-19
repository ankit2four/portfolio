import React, { useEffect, useMemo, useRef, useState } from "react";

/*
FEATURES
- Markdown support
- Bold (**text**)
- Links (clickable)
- Lists (*, -, 1.)
- Inline code (`code`)
- Typing animation
- Streaming support
- Optimized rendering
*/

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

//////////////////////////////////////////////////////////////////
// MARKDOWN PARSER
//////////////////////////////////////////////////////////////////

function parseMarkdown(text) {
  if (!text) return [];

  const lines = text.split("\n");
  const blocks = [];

  let currentSection = null;
  let currentList = null;

  for (let rawLine of lines) {
    if (!rawLine.trim()) continue;

    const trimmed = rawLine.trim();

    // 1️⃣ Detect numbered section
    const sectionMatch = trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*:?\s*$/);

    if (sectionMatch) {
      currentSection = {
        type: "section",
        title: sectionMatch[1],
        items: [],
      };

      blocks.push(currentSection);
      currentList = null;
      continue;
    }

    // 2️⃣ Detect bullet list
    const bulletMatch = trimmed.match(/^([*\-•])\s+(.*)/);

    if (bulletMatch) {
      const content = parseInline(bulletMatch[2]);

      // If inside section → nested
      if (currentSection) {
        currentSection.items.push(content);
      } else {
        // standalone list
        if (!currentList) {
          currentList = {
            type: "list",
            items: [],
          };
          blocks.push(currentList);
        }

        currentList.items.push(content);
      }

      continue;
    }

    // 3️⃣ Normal paragraph
    currentSection = null;
    currentList = null;

    blocks.push({
      type: "paragraph",
      content: parseInline(trimmed),
    });
  }

  return blocks;
}



//////////////////////////////////////////////////////////////////
// INLINE PARSER (bold, links, code)
//////////////////////////////////////////////////////////////////

function parseInline(text) {
  const parts = [];

  let remaining = text;

  while (remaining.length > 0) {
    // bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);

    // code
    const codeMatch = remaining.match(/`(.+?)`/);

    // url
    const urlMatch = remaining.match(URL_REGEX);

    let nextMatch = null;
    let type = null;

    if (boldMatch && (!nextMatch || boldMatch.index < nextMatch.index)) {
      nextMatch = boldMatch;
      type = "bold";
    }

    if (codeMatch && (!nextMatch || codeMatch.index < nextMatch.index)) {
      nextMatch = codeMatch;
      type = "code";
    }

    if (urlMatch && (!nextMatch || remaining.indexOf(urlMatch[0]) < nextMatch.index)) {
      nextMatch = [urlMatch[0]];
      nextMatch.index = remaining.indexOf(urlMatch[0]);
      type = "link";
    }

    if (!nextMatch) {
      parts.push({
        type: "text",
        value: remaining,
      });
      break;
    }

    if (nextMatch.index > 0) {
      parts.push({
        type: "text",
        value: remaining.slice(0, nextMatch.index),
      });
    }

    if (type === "bold") {
      parts.push({
        type: "bold",
        value: nextMatch[1],
      });
    }

    if (type === "code") {
      parts.push({
        type: "code",
        value: nextMatch[1],
      });
    }

    if (type === "link") {
      parts.push({
        type: "link",
        value: nextMatch[0],
      });
    }

    remaining = remaining.slice(
      nextMatch.index + nextMatch[0].length
    );
  }

  return parts;
}

//////////////////////////////////////////////////////////////////
// TYPING ANIMATION HOOK
//////////////////////////////////////////////////////////////////

function useTypingEffect(text, speed = 8, enabled = true, onUpdate) {
  const [displayed, setDisplayed] = useState("");

  const intervalRef = useRef(null);

  useEffect(() => {
    // Always clear any previous animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If animation disabled → show instantly
    if (!enabled) {
      setDisplayed(text);
      return;
    }

    // Start animation fresh
    let i = 0;
    setDisplayed("");

    intervalRef.current = setInterval(() => {
      i++;

      setDisplayed(text.slice(0, i));

      onUpdate?.();

      if (i >= text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

  }, [text, enabled, speed, onUpdate]);

  return displayed;
}



//////////////////////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////////////////////

export default function ChatMessage({
  text,
  typing = true,
  streaming = false,
  isLatest = false,
  onTypingUpdate,
}) {
  const displayText = useTypingEffect(
    text,
    8,
    typing && !streaming && isLatest,
    onTypingUpdate
  );

  const blocks = useMemo(
    () => parseMarkdown(displayText),
    [displayText]
  );

  return (
    <div className="chatgpt-message">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          return (
            <p key={i}>
              <InlineRenderer parts={block.content} />
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <InlineRenderer parts={item} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "section") {
          return (
            <div key={i} className="chat-section">
              <div className="chat-section-title">
                {block.title}
              </div>

              <ul>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <InlineRenderer parts={item} />
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

//////////////////////////////////////////////////////////////////
// INLINE RENDERER
//////////////////////////////////////////////////////////////////

function InlineRenderer({ parts }) {
  return parts.map((part, i) => {
    if (part.type === "text") {
      return <span key={i}>{part.value}</span>;
    }

    if (part.type === "bold") {
      return <strong key={i}>{part.value}</strong>;
    }

    if (part.type === "code") {
      return (
        <code key={i} className="chat-inline-code">
          {part.value}
        </code>
      );
    }

    if (part.type === "link") {
      return (
        <a
          key={i}
          href={part.value}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {part.value}
        </a>
      );
    }

    return null;
  });
}
