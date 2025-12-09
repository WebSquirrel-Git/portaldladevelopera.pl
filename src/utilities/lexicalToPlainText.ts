export function lexicalToPlainText(node: any): string {
  if (!node) return ''

  if (node.text) return node.text

  if (Array.isArray(node.children)) {
    return node.children.map(lexicalToPlainText).join(' ')
  }

  if (typeof node === 'object') {
    return Object.values(node).map(lexicalToPlainText).join(' ')
  }

  return ''
}
