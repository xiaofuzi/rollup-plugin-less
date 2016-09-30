'use strict';

function __$styleInject(css) {
    if (!css) return;

    if (typeof window == 'undefined') return;
    var style = document.createElement('style');
    style.setAttribute('media', 'screen');

    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}
__$styleInject("body .wrap {\n  color: #fff;\n}\nbody a {\n  font-size: 12px;\n}\n");

__$styleInject(".hidden {\n  display: none !important;\n}\n.content .header {\n  font-size: 12px;\n}\n.content .body {\n  color: #333;\n}\n");