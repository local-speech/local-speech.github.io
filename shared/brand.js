/* SoPro Brand SSOT — renders header + footer */
(function(){
  var LOGO_SVG = '<svg width="60" height="22" viewBox="0 0 120 42" style="vertical-align:middle">'
    + '<text x="0" y="30" font-family="\'Segoe UI\',system-ui,sans-serif" font-size="28" font-weight="700" fill="#4d4d4d">So</text>'
    + '<path d="M44,22 Q44,42 64,42 L112,42 Q120,42 120,34 L120,8 Q120,0 112,0 L56,0 Q44,0 44,22 Z" fill="#e8453c"/>'
    + '<text x="58" y="30" font-family="\'Segoe UI\',system-ui,sans-serif" font-size="28" font-weight="700" fill="#fff">Pro</text>'
    + '</svg>';

  var APPS = [
    {href:'/aispeech', label:'AISpeech'},
    {href:'/blur',     label:'Нууцлагч'},
    {href:'/sign',     label:'Гарын үсэг'},
    {href:'/macro',    label:'Бэлдэц'},
    {href:'/color',    label:'Өнгө'},
    {href:'/eyecare',  label:'Нүд'},
    {href:'/mn',       label:'MN'}
  ];

  var el = document.querySelector('[data-sp-header]');
  if (el) {
    var page = el.getAttribute('data-sp-header');
    var isHub = page === 'hub';
    var appName = el.getAttribute('data-sp-app') || '';

    var brand = '<a href="/sopro" class="sp-brand">So<i>Pro</i>';
    if (!isHub && appName) {
      brand += '<span class="sep"></span><em>' + appName + '</em>';
    }
    brand += '</a>';

    var nav = '<nav class="sp-nav">';
    if (isHub) {
      APPS.forEach(function(a){ nav += '<a href="' + a.href + '">' + a.label + '</a>'; });
    } else {
      var isMN = document.documentElement.lang === 'mn' && page !== 'aispeech-en';
      nav += '<a href="/sopro">&larr; ' + (isMN ? 'Бүх хэрэгсэл' : 'All Tools') + '</a>';
    }
    nav += '</nav>';

    el.className = 'sp-hdr';
    el.innerHTML = brand + nav;
  }

  var ft = document.querySelector('[data-sp-footer]');
  if (ft) {
    var isMN = document.documentElement.lang === 'mn';
    ft.className = 'sp-footer';
    ft.innerHTML = '<div>'
      + '&copy; 2025 ' + LOGO_SVG + '. '
      + (isMN ? 'Бүх эрх хуулиар хамгаалагдсан.' : 'All rights reserved.')
      + '</div>'
      + '<div class="sp-footer-links">'
      + '<a href="/terms.html">' + (isMN ? 'Үйлчилгээний нөхцөл' : 'Terms of Service') + '</a>'
      + '<a href="/privacy.html">' + (isMN ? 'Нууцлалын бодлого' : 'Privacy Policy') + '</a>'
      + '<a href="/refund.html">' + (isMN ? 'Буцаалтын бодлого' : 'Refund Policy') + '</a>'
      + '</div>';
  }
})();
