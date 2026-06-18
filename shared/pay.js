/* SSOT Payment Popup — shared/pay.js
   Usage: <div data-sp-pay data-sp-pay-title="App Name" data-sp-pay-prefix="BLR"
               data-sp-pay-price="9000" data-sp-pay-account="5400780646"></div>
   For bundle (sopro): <div data-sp-pay="bundle"></div>  — sopro manages title/price via JS */
(function(){
  var el = document.querySelector('[data-sp-pay]');
  if (!el) return;

  var isBundle = el.getAttribute('data-sp-pay') === 'bundle';
  var title   = el.getAttribute('data-sp-pay-title') || '';
  var prefix  = el.getAttribute('data-sp-pay-prefix') || 'PAY';
  var price   = el.getAttribute('data-sp-pay-price') || '9000';
  var account = el.getAttribute('data-sp-pay-account') || '5400780646';

  var CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function genCode(pfx) {
    var c = pfx + '-';
    for (var i = 0; i < 6; i++) c += CHARS[Math.floor(Math.random() * CHARS.length)];
    return c;
  }

  function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var code = isBundle ? '' : genCode(prefix);

  var html =
    '<div id="payModal" class="pay-overlay" onclick="if(event.target===this)this.style.display=\'none\'">' +
    '<div class="pay-card">' +
    '<button class="pay-close" onclick="document.getElementById(\'payModal\').style.display=\'none\'">✕</button>' +
    '<div id="payForm">' +
    '<div class="pay-header">' +
    '<h3 id="payTitle">' + title + '</h3>' +
    '<p>Насан туршийн лиценз</p>' +
    '<div class="pay-amount" id="payAmount">' + (isBundle ? '' : '<s>' + fmt(parseInt(price) * 3) + '₮</s> ' + fmt(parseInt(price)) + '₮') + '</div>' +
    (isBundle ? '<div class="pay-selected-list" id="payList"></div>' : '') +
    '</div>' +
    '<div class="pay-body">' +
    '<div class="pay-info">' +
    '<div class="pay-info-item"><div class="pay-label">Банк</div><div class="pay-value">Хаанбанк</div></div>' +
    '<div class="pay-info-item"><div class="pay-label">Данс</div><div class="pay-value">' + account + '</div></div>' +
    '<div class="pay-info-item"><div class="pay-label">Нэр</div><div class="pay-value">' +
      '<span class="owner-mask">••••••••</span>' +
      '<span class="owner-name" style="display:none">Д.Баттулга</span> ' +
      '<span class="eye-toggle" style="cursor:pointer">👁‍🗨</span>' +
    '</div></div>' +
    '<div class="pay-info-item"><div class="pay-label">Дүн</div><div class="pay-value" id="payDun" style="color:#e8453c">' + (isBundle ? '' : fmt(parseInt(price)) + '₮') + '</div></div>' +
    '</div>' +
    '<div class="pay-code-box">' +
    '<div class="pay-label">Гүйлгээний утга</div>' +
    '<div class="pay-code-val" id="payCode">' + code + '</div>' +
    '<div class="pay-code-hint">Энэ кодыг гүйлгээний утгад заавал бичнэ үү</div>' +
    '</div>' +
    '<div class="pay-field"><label>Имэйл хаяг</label><input type="email" id="payEmail" placeholder="example@gmail.com"><div style="font-size:11px;color:#64748b;margin-top:4px">Энэ имэйл рүү програмын .exe файл илгээгдэнэ</div></div>' +
    '<div class="pay-field"><label>Утасны дугаар</label><input type="tel" id="payPhone" placeholder="99112233"></div>' +
    '<button class="pay-submit" id="paySubmit" onclick="submitPayment()">Шилжүүлсэн ✓</button>' +
    '</div></div>' +
    '<div class="pay-success" id="paySuccess">' +
    '<div class="pay-success-icon">✓</div>' +
    '<h3>Амжилттай бүртгэгдлээ!</h3>' +
    '<p>Таны захиалгыг хүлээн авлаа.<br>24 цагийн дотор таны имэйл рүү програмын <strong>.exe файл</strong> илгээгдэнэ.<br>Имэйлээ шалгана уу!</p>' +
    '</div></div></div>' +
    '<iframe name="payFrame" style="display:none"></iframe>';

  el.innerHTML = html;

  // Listen for sp:open event to open modal
  el.addEventListener('sp:open', function(){
    document.getElementById('payModal').style.display = 'flex';
  });

  // Eye toggle
  var eyeBtn = el.querySelector('.eye-toggle');
  if (eyeBtn) {
    eyeBtn.addEventListener('click', function(){
      var p = this.parentElement;
      p.querySelector('.owner-mask').style.display = 'none';
      p.querySelector('.owner-name').style.display = 'inline';
      this.textContent = '👁';
      var self = this;
      setTimeout(function(){
        p.querySelector('.owner-mask').style.display = 'inline';
        p.querySelector('.owner-name').style.display = 'none';
        self.textContent = '👁‍🗨';
      }, 2000);
    });
  }

  // Store code for submit
  window._spPayCode = code;

  // Submit function
  window.submitPayment = function(){
    var email = document.getElementById('payEmail').value.trim();
    var phone = document.getElementById('payPhone').value.trim();
    if (!email || !phone) { alert('Имэйл болон утасны дугаараа оруулна уу'); return; }
    var btn = document.getElementById('paySubmit');
    btn.disabled = true; btn.textContent = 'Илгээж байна...';
    var form = document.createElement('form');
    form.method = 'POST'; form.target = 'payFrame';
    form.action = 'https://docs.google.com/forms/d/e/1FAIpQLScBeTfkDj0vzYjT6fkwC8oCjAFXDdmtghfasIE7eLO4GdhfUw/formResponse';
    var f1 = document.createElement('input'); f1.name = 'entry.413665365'; f1.value = phone; form.appendChild(f1);
    var payCode = document.getElementById('payCode').textContent;
    var extra = window._spPayNames ? ' | ' + window._spPayNames + ' | ' + window._spPayPrice + '₮' : '';
    var f2 = document.createElement('input'); f2.name = 'entry.1131290276'; f2.value = email + ' | ' + payCode + extra; form.appendChild(f2);
    document.body.appendChild(form); form.submit(); document.body.removeChild(form);
    setTimeout(function(){
      document.getElementById('payForm').style.display = 'none';
      document.getElementById('paySuccess').style.display = 'block';
    }, 800);
  };
})();
