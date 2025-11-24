// Simple Lexical to HTML serializer
export function serialize(richText: any): string {
  if (!richText || !richText.root) {
    return ''
  }

  const { root } = richText

  function serializeNode(node: any): string {
    if (!node) return ''

    // Text node
    if (node.type === 'text') {
      let text = node.text || ''

      // Apply formatting
      if (node.format) {
        if (node.format & 1) text = `<strong>${text}</strong>` // Bold
        if (node.format & 2) text = `<em>${text}</em>` // Italic
        if (node.format & 4) text = `<s>${text}</s>` // Strikethrough
        if (node.format & 8) text = `<u>${text}</u>` // Underline
        if (node.format & 16) text = `<code>${text}</code>` // Code
      }

      return text
    }

    // Get children HTML
    const childrenHtml = node.children?.map(serializeNode).join('') || ''

    // Element nodes
    switch (node.type) {
      case 'root':
        return childrenHtml

      case 'paragraph':
        return `<p>${childrenHtml || '<br>'}</p>`

      case 'heading':
        const tag = node.tag || 'h2'
        return `<${tag}>${childrenHtml}</${tag}>`

      case 'list':
        const listTag = node.listType === 'number' ? 'ol' : 'ul'
        return `<${listTag}>${childrenHtml}</${listTag}>`

      case 'listitem':
        return `<li>${childrenHtml}</li>`

      case 'quote':
        return `<blockquote>${childrenHtml}</blockquote>`

      case 'link':
        const url = node.fields?.url || node.url || '#'
        const rel = node.fields?.newTab ? ' rel="noopener noreferrer" target="_blank"' : ''
        return `<a href="${url}"${rel}>${childrenHtml}</a>`

      case 'linebreak':
        return '<br>'

      default:
        return childrenHtml
    }
  }

  return serializeNode(root)
}
