/**
 * Preview protegido por senha (cliente).
 * Não é segurança de nível bancário: quem tiver o arquivo e conhecimento
 * técnico pode inspecionar o código. Serve para compartilhar com a
 * destinatária sem exposição pública aberta.
 */
(function () {
  'use strict';

  /** Altere a senha re-gerando o hash (veja generate-password-hash.mjs). */
  var CONFIG = {
    passwordHash:
      '5add8b0c1eb3266cbdc88e786f3fc848fd6686d26a2b38658feec361509b1e65',
    sessionKey: 'renata_preview_unlock_v1',
    title: 'Prévia do site',
    subtitle:
      'Esta página é uma prévia privada para revisão. Digite a senha enviada junto com o link.',
  };

  function utf8Bytes(str) {
    return new TextEncoder().encode(str);
  }

  function toHex(buffer) {
    var bytes = new Uint8Array(buffer);
    var hex = '';
    for (var i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    return hex;
  }

  function sha256Hex(text) {
    return crypto.subtle.digest('SHA-256', utf8Bytes(text)).then(toHex);
  }

  function unlock() {
    try {
      sessionStorage.setItem(CONFIG.sessionKey, '1');
    } catch (e) {}
    document.documentElement.classList.remove('preview-locked');
    document.documentElement.classList.add('preview-unlocked');
    var gate = document.getElementById('previewGate');
    if (gate) gate.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function isUnlocked() {
    try {
      return sessionStorage.getItem(CONFIG.sessionKey) === '1';
    } catch (e) {
      return false;
    }
  }

  function showError(msg) {
    var el = document.getElementById('previewGateError');
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function buildGate() {
    if (document.getElementById('previewGate')) return;

    var gate = document.createElement('div');
    gate.id = 'previewGate';
    gate.className = 'preview-gate';
    gate.setAttribute('role', 'dialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'previewGateTitle');
    gate.innerHTML =
      '<div class="preview-gate-card">' +
      '<p class="preview-gate-kicker">Acesso restrito</p>' +
      '<h1 id="previewGateTitle" class="preview-gate-title"></h1>' +
      '<p class="preview-gate-sub"></p>' +
      '<form id="previewGateForm" class="preview-gate-form" autocomplete="off">' +
      '<label class="preview-gate-label" for="previewGatePassword">Senha</label>' +
      '<input id="previewGatePassword" class="preview-gate-input" type="password" name="password" required autocomplete="current-password" placeholder="Digite a senha" />' +
      '<p id="previewGateError" class="preview-gate-error" hidden></p>' +
      '<button type="submit" class="preview-gate-btn">Entrar e ver o site</button>' +
      '</form>' +
      '<p class="preview-gate-note">Sessão liberada neste navegador até fechar a aba.</p>' +
      '</div>';

    gate.querySelector('.preview-gate-title').textContent = CONFIG.title;
    gate.querySelector('.preview-gate-sub').textContent = CONFIG.subtitle;
    document.body.appendChild(gate);
    document.body.style.overflow = 'hidden';

    var form = document.getElementById('previewGateForm');
    var input = document.getElementById('previewGatePassword');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showError('');
      var value = (input.value || '').trim();
      if (!value) {
        showError('Informe a senha.');
        return;
      }
      if (!window.crypto || !crypto.subtle) {
        showError('Este navegador não suporta a verificação segura. Use Chrome, Edge ou Firefox atualizado.');
        return;
      }
      sha256Hex(value)
        .then(function (hash) {
          if (hash === CONFIG.passwordHash) {
            unlock();
          } else {
            showError('Senha incorreta. Verifique e tente de novo.');
            input.select();
          }
        })
        .catch(function () {
          showError('Não foi possível validar a senha. Tente novamente.');
        });
    });

    setTimeout(function () {
      input.focus();
    }, 50);
  }

  document.documentElement.classList.add('preview-locked');

  if (isUnlocked()) {
    document.documentElement.classList.remove('preview-locked');
    document.documentElement.classList.add('preview-unlocked');
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGate);
  } else {
    buildGate();
  }
})();
