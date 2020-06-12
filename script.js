/**
 * Copies the passed text to clipboard
 * @param text {string}
 */
function copyToClipboard(text) {
  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = text;

  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');

  copyFrom.blur();
  document.body.removeChild(copyFrom);
}

/**
 * Called when the user clicks on the context menu
 * @param info {{ selectionText: string, pageUrl: string}}
 */
function onCopyUrl(info) {
  const selectionText = info.selectionText;
  const pageUrl = info.pageUrl;

  let textFragment = '';

  // If more than 70 characters, take the first and last 3 words
  if (selectionText.length >= 70) {
    const startText = selectionText.split(' ').slice(0, 3).join(' ');
    const endText = selectionText.split(' ').slice(-3).join(' ');

    textFragment = `:~:text=${encodeURIComponent(startText)},${encodeURIComponent(endText)}`;
  } else {
    textFragment = `:~:text=${encodeURIComponent(selectionText)}`;
  }

  // #:~:text=Word
  const highlightUrl = new URL(pageUrl);

  if (textFragment) {
    highlightUrl.hash = textFragment;
  }

  copyToClipboard(highlightUrl.toString());
}

chrome.contextMenus.create({
  title: 'Copy Marker URL',
  contexts: ['all'],
  onclick: onCopyUrl
});
