'use client';

import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

export default function PostContent({ content }: { content: string }) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSanitizedContent(DOMPurify.sanitize(content));
    }
  }, [content]);

  // If content is not yet sanitized (SSR or first render), we might want to show nothing or raw content if trusted?
  // Better to wait for client side sanitization to avoid hydration mismatch if we render something different.
  // Or we can just render a div.
  
  if (!sanitizedContent) {
      return <div className="ql-snow"><div className="ql-editor">Loading content...</div></div>;
  }

  return (
    <div className="ql-snow">
      <div className="ql-editor" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
}
