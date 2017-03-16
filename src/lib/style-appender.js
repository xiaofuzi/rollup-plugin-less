export default function styleAppender(css) {
  if(!(css || window)) {
    return;
  }

  let style = document.createElement('style');
  style.setAttribute('media', 'screen');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}
