'use client';
import React, { useMemo, useState } from 'react';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link2,
  Unlink,
  ImagePlus,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading2,
  Heading3,
  Type,
} from 'lucide-react';
import { CmsDialog } from './CmsDialog';
import { ImageInsertDialog } from './ImageInsertDialog';
import { cleanArticleHtml, toArticleHtml } from '@/lib/cms/html';

export function RichTextEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [pendingPos, setPendingPos] = useState<number | null>(null);

  // ProseMirror decoration for inline "+" button between blocks
  const blockButtons = useMemo(
    () =>
      Extension.create({
        name: 'blockInsertButtons',
        addProseMirrorPlugins() {
          return [
            new Plugin({
              key: new PluginKey('blockInsertButtons'),
              props: {
                decorations(state) {
                  const widgets: Decoration[] = [];
                  const add = (pos: number) =>
                    widgets.push(
                      Decoration.widget(
                        pos,
                        () => {
                          const slot = document.createElement('span');
                          slot.className = 'cms-block-insert';
                          slot.contentEditable = 'false';
                          const button = document.createElement('button');
                          button.type = 'button';
                          button.className = 'cms-block-plus';
                          button.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
                          button.title = 'Add block here (Image, Heading, Quote, Paragraph)';
                          button.setAttribute('aria-label', 'Add element between blocks');
                          button.contentEditable = 'false';
                          button.addEventListener('mousedown', (e) => e.preventDefault());
                          button.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setInsertAt(pos);
                          });
                          slot.appendChild(button);
                          return slot;
                        },
                        { side: 1 }
                      )
                    );
                  state.doc.forEach((node, offset, index) => {
                    if (index < state.doc.childCount - 1) add(offset + node.nodeSize);
                  });
                  return DecorationSet.create(state.doc, widgets);
                },
              },
            }),
          ];
        },
      }),
    []
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4, 5, 6] },
        underline: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Share your thoughts… Paste text or use + to insert headings, quotes, and images.',
      }),
      blockButtons,
    ],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'cms-prose',
        role: 'textbox',
        'aria-label': 'Article content',
        'aria-multiline': 'true',
      },
      transformPastedHTML: (html) => cleanArticleHtml(html.replace(/<(\/?)h1\b/gi, '<$1h2')),
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain') || '';
        // If markdown or structured text pasted without HTML
        if (!event.clipboardData?.getData('text/html') && /^#{1,6}\s|\*\*|^>\s|\[.+\]\(.+\)/m.test(text)) {
          editor?.commands.insertContent(toArticleHtml(text));
          return true;
        }
        return false;
      },
    },
  });

  useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive('bold'),
      italic: editor?.isActive('italic'),
      underline: editor?.isActive('underline'),
      heading: editor?.getAttributes('heading').level,
      selection: editor?.state.selection.from,
    }),
  });

  if (!editor) return <p className="p-8 text-sm text-slate-500">Loading editor…</p>;

  const toolBtn = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
    active = false
  ) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={active ? 'active' : ''}
      onClick={action}
    >
      {icon}
    </button>
  );

  const openLinkModal = () => {
    setUrl(editor.getAttributes('link').href || '');
    setError('');
    setLinkOpen(true);
  };

  const bubbleFormatButtons = (
    <>
      {toolBtn('Bold', <BoldIcon size={16} />, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
      {toolBtn('Italic', <ItalicIcon size={16} />, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
      {toolBtn('Underline', <UnderlineIcon size={16} />, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
      {toolBtn('Add link', <Link2 size={16} />, openLinkModal, editor.isActive('link'))}
      {editor.isActive('link') &&
        toolBtn('Remove link', <Unlink size={16} />, () => editor.chain().focus().unsetLink().run())}
    </>
  );

  function insertBlock(type: string, headingLevel: 2 | 3 | 4 | 5 | 6 = 2) {
    const targetPos = insertAt !== null ? insertAt : editor?.state.selection.to ?? 0;
    if (type === 'image') {
      setPendingPos(targetPos);
      setImageOpen(true);
    } else if (type === 'heading') {
      editor?.chain().focus().insertContentAt(targetPos, `<h${headingLevel}>Heading</h${headingLevel}>`).run();
    } else if (type === 'quote') {
      editor?.chain().focus().insertContentAt(targetPos, `<blockquote><p>Perspective quote</p></blockquote>`).run();
    } else {
      editor?.chain().focus().insertContentAt(targetPos, `<p>New paragraph</p>`).run();
    }
    setInsertAt(null);
  }

  const currentHeadingVal = editor.isActive('heading')
    ? `h${editor.getAttributes('heading').level}`
    : 'p';

  return (
    <div className="cms-rich-editor">
      <header className="cms-writing-heading">
        <div><span className="cms-eyebrow">THE STORY</span><h2>Article body</h2><p>Select text to format it, or add a block anywhere.</p></div>
        <button type="button" className="cms-add-block" onClick={() => setInsertAt(editor.state.selection.to)}><Type size={15} /> Add block</button>
      </header>
      {/* Sticky Top Formatting Bar */}
      <div className="cms-toolbar" role="toolbar" aria-label="Article formatting tools">
        <div className="cms-tool-group" role="group" aria-label="Text style">
        {/* Heading / Style Selector */}
        <CustomSelect
          aria-label="Text style"
          value={currentHeadingVal}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = Number(val.slice(1)) as 2 | 3 | 4 | 5 | 6;
              editor.chain().focus().setHeading({ level }).run();
            }
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
          <option value="h4">Heading 4 (H4)</option>
          <option value="h5">Heading 5 (H5)</option>
          <option value="h6">Heading 6 (H6)</option>
        </CustomSelect>

        </div>
        <div className="cms-tool-group" role="group" aria-label="Text formatting">{bubbleFormatButtons}</div>
        <div className="cms-tool-group" role="group" aria-label="Lists and quotes">

        {toolBtn('Bullet list', <List size={17} />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {toolBtn('Numbered list', <ListOrdered size={17} />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {toolBtn('Quote block', <Quote size={17} />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}

        </div>
        <div className="cms-tool-group" role="group" aria-label="Media">
        {toolBtn('Insert image', <ImagePlus size={17} />, () => {
          setPendingPos(editor.state.selection.to);
          setImageOpen(true);
        })}

        </div>
        <div className="cms-tool-group" role="group" aria-label="Text alignment">
        {toolBtn('Align left', <AlignLeft size={17} />, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
        {toolBtn('Align centre', <AlignCenter size={17} />, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
        {toolBtn('Align right', <AlignRight size={17} />, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}

        </div>
        <div className="cms-tool-group cms-tool-history" role="group" aria-label="Edit history">
        {toolBtn('Undo', <Undo2 size={17} />, () => editor.chain().focus().undo().run())}
        {toolBtn('Redo', <Redo2 size={17} />, () => editor.chain().focus().redo().run())}
        </div>
      </div>

      {/* Floating Selection Tooltip (Bubble Menu) */}
      <BubbleMenu editor={editor} className="cms-selection-menu" appendTo={() => document.body} options={{ strategy: 'fixed', placement: 'bottom', offset: 8, flip: { padding: 12 }, shift: { padding: 12 } }}>
        <div className="cms-bubble" role="tooltip" aria-label="Text selection tools">
          {bubbleFormatButtons}
        </div>
      </BubbleMenu>

      {/* TipTap Document View */}
      <EditorContent editor={editor} />

      {/* Quick In-between Block Insert Bar at the bottom */}
      <div className="cms-quick-insert-bar">
        <span>Insert block:</span>
        <button type="button" onClick={() => insertBlock('paragraph')}>
          <Type size={14} /> Paragraph
        </button>
        <button type="button" onClick={() => insertBlock('heading', 2)}>
          <Heading2 size={14} /> Heading 2
        </button>
        <button type="button" onClick={() => insertBlock('heading', 3)}>
          <Heading3 size={14} /> Heading 3
        </button>
        <button type="button" onClick={() => insertBlock('quote')}>
          <Quote size={14} /> Quote
        </button>
        <button
          type="button"
          onClick={() => {
            setPendingPos(editor.state.selection.to);
            setImageOpen(true);
          }}
        >
          <ImagePlus size={14} /> Image
        </button>
      </div>

      {/* Footer Meta */}
      <div className="cms-editor-footer">
        <span>
          {editor.getText().split(/\s+/).filter(Boolean).length} words ·{' '}
          {Math.max(1, Math.ceil(editor.getText().split(/\s+/).filter(Boolean).length / 200))} min read
        </span>
        <span>HTML document - Save changes with your article</span>
      </div>

      {/* Insert Block Dialog (triggered by in-content "+" buttons) */}
      {insertAt !== null && (
        <CmsDialog title="Insert an element here" onClose={() => setInsertAt(null)}>
          <div className="cms-insert-grid">
            <button type="button" onClick={() => insertBlock('paragraph')}>
              <Type size={18} />
              <div>
                <strong>Paragraph</strong>
                <small>Regular text block</small>
              </div>
            </button>
            <button type="button" onClick={() => insertBlock('heading', 2)}>
              <Heading2 size={18} />
              <div>
                <strong>Heading 2</strong>
                <small>Section heading</small>
              </div>
            </button>
            <button type="button" onClick={() => insertBlock('heading', 3)}>
              <Heading3 size={18} />
              <div>
                <strong>Heading 3</strong>
                <small>Subsection heading</small>
              </div>
            </button>
            <button type="button" onClick={() => insertBlock('quote')}>
              <Quote size={18} />
              <div>
                <strong>Quote</strong>
                <small>Highlighted excerpt or quote</small>
              </div>
            </button>
            <button type="button" onClick={() => insertBlock('image')}>
              <ImagePlus size={18} />
              <div>
                <strong>Image</strong>
                <small>Upload and embed graphic</small>
              </div>
            </button>
          </div>
        </CmsDialog>
      )}

      {imageOpen && <ImageInsertDialog onClose={() => setImageOpen(false)} onInsert={(src, alt) => {
        editor.chain().focus().insertContentAt(pendingPos ?? editor.state.selection.to, { type: 'image', attrs: { src, alt } }).run();
        setImageOpen(false);
      }} />}

      {/* Link Dialog */}
      {linkOpen && (
        <CmsDialog title="Add or edit link" onClose={() => setLinkOpen(false)}>
          <form
            className="cms-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(url)) {
                setError('Please use a valid address (e.g. https://, mailto:, tel:, or /path)');
                return;
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              setLinkOpen(false);
            }}
          >
            <label className="cms-field">
              Link destination URL
              <input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </label>
            {error && <p className="cms-error" role="alert">{error}</p>}
            <button className="cms-primary" type="submit">
              Apply link
            </button>
          </form>
        </CmsDialog>
      )}
    </div>
  );
}
