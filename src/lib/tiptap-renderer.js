import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

// Extend Image extension to support custom attributes used by Strapi plugin
const StrapiImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-align': { default: null },
      'data-asset-id': { default: null },
    };
  },
});

const extensions = [
  StarterKit.configure({
    // Disable extensions that will be configured separately to avoid duplicates
    underline: false,
  }),
  StrapiImage,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  Subscript,
  Superscript,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
];

/**
 * Convert TipTap JSON content from Strapi to HTML
 * @param {any} content - TipTap JSON content from Strapi (can be string or object)
 * @returns {string} - Rendered HTML string
 */
export function renderTipTapContent(content) {
  if (!content) return '';
  
  try {
    // Parse content if it's a string
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    
    return generateHTML(parsedContent, extensions);
  } catch (error) {
    console.error('Error rendering TipTap content:', error);
    console.error('Content that failed:', content);
    return '';
  }
}
