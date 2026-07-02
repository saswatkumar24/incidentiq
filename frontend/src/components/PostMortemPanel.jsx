import React from 'react';
import { FileText, Download, CheckSquare, Square } from 'lucide-react';

const PostMortemPanel = ({ postmortem }) => {
  if (!postmortem || !postmortem.content) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-500 italic text-sm border border-dashed border-slate-800 rounded-2xl">
        <span>No post-mortem report generated yet.</span>
        <span className="text-xs mt-1">Complete all agent execution phases to review the post-mortem.</span>
      </div>
    );
  }

  // A simple markdown parsing function to avoid importing external md renderers
  const parseMarkdownToHTML = (mdText) => {
    if (!mdText) return "";
    
    let html = mdText
      // Escape HTML entities briefly
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-slate-100 mt-6 mb-3 pb-1 border-b border-slate-800">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-slate-200 mt-5 mb-2">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-slate-300 mt-4 mb-2">$1</h3>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-brand-accent my-3 overflow-x-auto">$1</pre>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-slate-950 text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-800">$1</code>');

    // Checkboxes [ ] and [x]
    html = html.replace(/- \`\[ \]\` (.*?)$/gim, '<div class="flex items-center gap-2 text-xs text-slate-300 my-1"><span class="text-slate-500 font-mono">☐</span><span>$1</span></div>');
    html = html.replace(/- \`\[x\]\` (.*?)$/gim, '<div class="flex items-center gap-2 text-xs text-brand-success my-1"><span class="text-brand-success font-mono">☑</span><span class="line-through opacity-80">$1</span></div>');

    // Unordered lists
    html = html.replace(/^- (?!`\[)(.*?)$/gim, '<li class="ml-4 list-disc text-xs text-slate-300 my-1">$1</li>');

    // Paragraphs (split by double newline and wrap in p if not already HTML element)
    html = html.split('\n\n').map(p => {
      p = p.strip ? p.strip() : p;
      if (!p) return "";
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<li') || p.startsWith('<div')) return p;
      return `<p class="text-xs text-slate-300 leading-relaxed my-2">${p}</p>`;
    }).join('\n');

    return html;
  };

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-5 flex flex-col h-full space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="text-brand-success" size={18} />
          <h4 className="text-slate-100 font-bold text-sm">Blameless Post-Mortem Report</h4>
        </div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/30"
        >
          <span>Confluence Display</span>
          <Download size={12} />
        </a>
      </div>

      {/* Rendered Markdown Body */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div 
          className="markdown-body text-slate-300 space-y-1"
          dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(postmortem.content) }}
        />
        
        {postmortem.page_url && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block font-semibold uppercase tracking-wider mb-0.5">Published Site</span>
              <a 
                href={postmortem.page_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-brand-success hover:underline font-semibold flex items-center gap-1"
              >
                {postmortem.page_url}
              </a>
            </div>
            <span className="text-[10px] text-brand-success bg-brand-success/10 px-2 py-0.5 rounded border border-brand-success/20 font-semibold shrink-0">
              SYNCHRONIZED
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostMortemPanel;
