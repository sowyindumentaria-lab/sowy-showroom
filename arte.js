/* Sowy — Copyright (c) 2026 Sowy (autor: Felipe Manrique). Todos los derechos reservados. Ver LICENSE. */
/* Ilustraciones de prendas en SVG: se usan cuando un producto todavía no tiene foto.
   Las usan la tienda (index.html) y el panel (panel/index.html). */
(function(g){
  'use strict';
  var FUCSIA = '#E6007E';

  function rgb(h){
    h = String(h || '').replace('#', '');
    if(h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
    var n = parseInt(h, 16);
    return isNaN(n) ? [128, 128, 128] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function toHex(a){ return '#' + a.map(function(v){ return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function mix(a, b, t){ return toHex([0, 1, 2].map(function(i){ return a[i] + (b[i] - a[i]) * t; })); }
  function shade(h, t){ return mix(rgb(h), [0, 0, 0], t); }
  function tint(h, t){ return mix(rgb(h), [255, 255, 255], t); }
  function lum(h){ var c = rgb(h); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
  function near(a, b){ var x = rgb(a), y = rgb(b); return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]) < 150; }

  /* Cada forma devuelve { pre, sil, det }: pre = detrás de la prenda, sil = silueta (se rellena con el color),
     det = detalles por encima. c = color, d = borde, ln = costuras, ac = acento (fucsia, o blanco si la prenda es fucsia). */
  var SHAPES = {
    'remera': function(k){ return {
      sil: 'M128 92 L168 78 Q200 104 232 78 L272 92 L352 152 L316 208 L276 184 L276 404 Q200 416 124 404 L124 184 L84 208 L48 152 Z',
      det: '<path d="M168 78 Q200 104 232 78 Q232 98 200 122 Q168 98 168 78Z" fill="' + k.d + '" opacity=".85"/>' +
           '<path d="M128 92 Q119 140 124 184 M272 92 Q281 140 276 184 M124 388 Q200 400 276 388" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' +
           '<path d="M58 168 L94 196 M342 168 L306 196" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' }; },
    'remera-logo': function(k){ var r = SHAPES.remera(k); r.det += logoText(k, 200, 190, 30); return r; },
    'top': function(k){ var ribs = ''; for(var x = 148; x <= 252; x += 13) ribs += 'M' + x + ' 206 L' + x + ' 302 ';
      return {
      sil: 'M140 120 L172 106 Q200 126 228 106 L260 120 L330 170 L298 214 L268 196 L268 304 Q200 314 132 304 L132 196 L102 214 L70 170 Z',
      det: '<path d="M172 106 Q200 126 228 106 Q228 122 200 142 Q172 122 172 106Z" fill="' + k.d + '" opacity=".85"/>' +
           '<path d="' + ribs + '" fill="none" stroke="' + k.ln + '" stroke-width="2" opacity=".6"/>' +
           '<path d="M132 292 Q200 304 268 292" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' }; },
    'buzo': function(k){ return {
      sil: 'M136 128 L172 112 L228 112 L264 128 L338 338 L296 354 L272 258 L274 428 Q200 440 126 428 L128 258 L104 354 L62 338 Z M158 114 Q146 56 200 52 Q254 56 242 114 Q200 146 158 114 Z',
      det: '<path d="M170 108 Q200 136 230 108 Q224 82 200 80 Q176 82 170 108Z" fill="' + k.d + '" opacity=".8"/>' +
           '<path d="M188 130 L186 172 M212 130 L214 172" fill="none" stroke="' + k.l + '" stroke-width="4" stroke-linecap="round"/>' +
           '<path d="M146 340 L254 340 L266 394 L134 394 Z M127 410 Q200 422 273 410 M74 324 L116 340 M326 324 L284 340" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' }; },
    'campera': function(k){ return {
      sil: 'M134 124 L168 106 L232 106 L266 124 L340 330 L298 346 L274 252 L276 424 Q200 436 124 424 L126 252 L102 346 L60 330 Z',
      det: '<path d="M164 106 L164 82 Q200 98 236 82 L236 106 L200 144 Z" fill="' + k.d + '" opacity=".8"/>' +
           '<path d="M200 144 L200 426" stroke="' + k.l + '" stroke-width="3"/><circle cx="200" cy="170" r="5" fill="' + k.l + '"/>' +
           '<path d="M150 350 L178 332 M250 350 L222 332 M127 410 Q200 422 273 410 M74 316 L116 332 M326 316 L284 332" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' }; },
    'jean': function(k){ return {
      sil: 'M128 84 L272 84 L290 150 L304 438 L216 438 L200 214 L184 438 L96 438 L110 150 Z',
      det: '<path d="M128 84 L272 84 L274 108 L126 108 Z" fill="' + k.d + '" opacity=".5"/>' +
           '<path d="M200 108 L200 214 M200 192 Q184 190 180 170 M126 108 Q130 158 170 166 M274 108 Q270 158 230 166" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' +
           '<path d="M114 160 L102 430 M286 160 L298 430 M98 422 L184 422 M216 422 L302 422" fill="none" stroke="' + k.ln + '" stroke-width="2" stroke-dasharray="5 5"/>' }; },
    'cargo': function(k){ var r = SHAPES.jean(k);
      r.det += '<g fill="none" stroke="' + k.ln + '" stroke-width="2"><rect x="102" y="262" width="54" height="66" rx="6"/><path d="M102 282 H156"/><rect x="244" y="262" width="54" height="66" rx="6"/><path d="M244 282 H298"/></g>'; return r; },
    'short': function(k){ return {
      sil: 'M122 130 L278 130 L296 270 L216 282 L200 226 L184 282 L104 270 Z',
      det: '<path d="M122 130 L278 130 L279 154 L121 154 Z" fill="' + k.d + '" opacity=".5"/>' +
           '<path d="M200 154 L200 226 M200 206 Q186 204 182 188 M122 154 Q128 190 166 196 M278 154 Q272 190 234 196 M106 258 L186 270 M214 270 L294 258" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' }; },
    'vestido': function(k){ return {
      pre: '<path d="M160 102 L156 48 M240 102 L244 48" fill="none" stroke="' + k.d + '" stroke-width="13" stroke-linecap="round"/><path d="M160 102 L156 48 M240 102 L244 48" fill="none" stroke="' + k.c + '" stroke-width="8" stroke-linecap="round"/>',
      sil: 'M152 98 Q176 136 200 128 Q224 136 248 98 L264 164 L242 218 L312 442 Q200 462 88 442 L158 218 L136 164 Z',
      det: '<path d="M158 218 Q200 234 242 218 M200 234 L196 452 M176 230 L140 448 M224 230 L260 448" fill="none" stroke="' + k.ln + '" stroke-width="2" opacity=".7"/>' }; },
    'vestido-corto': function(k){ return {
      pre: '<path d="M164 112 L160 66 M236 112 L240 66" fill="none" stroke="' + k.d + '" stroke-width="13" stroke-linecap="round"/><path d="M164 112 L160 66 M236 112 L240 66" fill="none" stroke="' + k.c + '" stroke-width="8" stroke-linecap="round"/>',
      sil: 'M156 112 Q178 140 200 134 Q222 140 244 112 L260 168 L244 214 L296 360 Q200 378 104 360 L156 214 L140 168 Z',
      det: '<path d="M156 214 Q200 228 244 214 M156 112 Q178 140 200 134 Q222 140 244 112" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' }; },
    'pollera': function(k){ var p = ''; for(var i = -6; i <= 6; i++) p += 'M' + (200 + i * 8) + ' 132 L' + (200 + i * 22.5) + ' 436 ';
      return {
      sil: 'M150 106 L250 106 L252 128 L336 428 Q200 452 64 428 L148 128 Z',
      det: '<path d="M148 106 L252 106 L254 132 L146 132 Z" fill="' + k.d + '" opacity=".5"/><path d="' + p + '" fill="none" stroke="' + k.ln + '" stroke-width="2" opacity=".6"/>' }; },
    'gorra': function(k){ return {
      sil: 'M112 284 Q108 168 200 164 Q292 168 288 284 Z',
      det: '<path d="M112 290 Q200 268 296 290 Q336 300 338 314 Q200 340 84 314 Q86 300 112 290 Z" fill="' + k.c + '" stroke="' + k.d + '" stroke-width="3"/><path d="M112 290 Q200 268 296 290 Q336 300 338 314 Q200 340 84 314 Q86 300 112 290 Z" fill="' + k.d + '" opacity=".35"/>' +
           '<circle cx="200" cy="166" r="8" fill="' + k.d + '"/>' +
           '<path d="M200 170 L200 280 M158 178 Q138 228 148 280 M242 178 Q262 228 252 280" fill="none" stroke="' + k.ln + '" stroke-width="2"/>' + logoText(k, 200, 244, 26) }; },
    'cartera': function(k){ return {
      pre: '<path d="M138 228 Q200 16 262 228" fill="none" stroke="' + k.d + '" stroke-width="13" stroke-linecap="round"/><path d="M138 228 Q200 16 262 228" fill="none" stroke="' + k.c + '" stroke-width="8" stroke-linecap="round"/>',
      sil: 'M104 248 Q104 226 126 226 L274 226 Q296 226 296 248 L302 386 Q302 410 278 410 L122 410 Q98 410 98 386 Z',
      det: '<path d="M100 248 L300 248 L200 320 Z" fill="' + k.d + '" opacity=".55"/><circle cx="200" cy="316" r="10" fill="' + k.ac + '"/>' +
           '<path d="M114 396 L286 396" fill="none" stroke="' + k.ln + '" stroke-width="2" stroke-dasharray="5 5"/>' }; },
    'medias': function(k){
      var sock = function(c, x, y, rot){
        var d = shade(c, .28), ac = lum(c) > .75 ? FUCSIA : '#fff';
        return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')" stroke-linejoin="round">' +
          '<path d="M-24 -110 L24 -110 L24 10 Q24 32 54 44 Q92 60 88 92 Q82 124 36 120 Q-26 114 -24 54 Z" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>' +
          '<rect x="-24" y="-110" width="48" height="22" fill="' + ac + '" opacity=".9"/><path d="M-24 -76 H24" stroke="' + d + '" stroke-width="2" opacity=".5"/></g>';
      };
      var c1 = k.c, c2 = lum(k.c) > .5 ? '#111113' : '#FFFFFF', c3 = lum(k.c) > .5 ? shade(k.c, .22) : tint(k.c, .35);
      return { custom: sock(c3, 130, 230, -8) + sock(c2, 270, 230, 8) + sock(c1, 200, 250, 0) }; }
  };

  function logoText(k, x, y, size){
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + size + '" font-weight="800" letter-spacing="' + Math.round(size / 6) + '" fill="' + k.ac + '" font-family="-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif">SOWY</text>';
  }

  var FORMAS = [
    ['remera', 'Remera'], ['remera-logo', 'Remera con estampa'], ['top', 'Top'], ['buzo', 'Buzo con capucha'], ['campera', 'Campera'],
    ['jean', 'Jean / pantalón'], ['cargo', 'Pantalón cargo'], ['short', 'Short'], ['vestido', 'Vestido largo'], ['vestido-corto', 'Vestido corto'],
    ['pollera', 'Pollera'], ['gorra', 'Gorra'], ['cartera', 'Cartera'], ['medias', 'Medias']
  ];

  /* art(forma, color, uid, fit): devuelve el <svg>. fit = 'slice' (tarjetas 4:5) o 'meet' (cuadrado) */
  function art(forma, color, uid, fit){
    var c = /^#[0-9a-f]{3,8}$/i.test(color || '') ? color : '#111113';
    var dark = lum(c) < .28;
    var k = { c: c, d: dark ? tint(c, .3) : shade(c, .3), l: dark ? tint(c, .35) : tint(c, .45), ln: dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.26)', ac: near(c, FUCSIA) ? '#FFFFFF' : FUCSIA };
    var s = (SHAPES[forma] || SHAPES.remera)(k);
    var id = String(uid || 'a').replace(/[^\w-]/g, '');
    var body;
    if(s.custom){
      body = s.custom;
    } else {
      body = (s.pre || '') +
        '<path d="' + s.sil + '" fill="' + c + '" stroke="' + k.d + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="' + s.sil + '" fill="url(#sh' + id + ')"/>' + (s.det || '');
    }
    return '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid ' + (fit === 'meet' ? 'meet' : 'slice') + '" aria-hidden="true">' +
      '<defs><radialGradient id="bg' + id + '" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="var(--art-hi,#F7F7F9)"/><stop offset="1" stop-color="var(--art-bg,#E4E4E8)"/></radialGradient>' +
      '<linearGradient id="sh' + id + '" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>' +
      '<rect x="-300" y="-300" width="1000" height="1100" fill="url(#bg' + id + ')"/>' +
      '<ellipse cx="200" cy="456" rx="118" ry="11" fill="#000" opacity=".12"/>' + body + '</svg>';
  }

  g.SowyArt = { art: art, formas: FORMAS, tint: tint, shade: shade, lum: lum };
})(window);
