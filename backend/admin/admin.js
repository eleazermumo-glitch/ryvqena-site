(function () {
  var KEY = 'rq_admin_token';
  var $ = function (id) { return document.getElementById(id); };
  var token = '';
  try { token = sessionStorage.getItem(KEY) || ''; } catch (e) { /* storage unavailable */ }

  function say(t) { $('msg').textContent = t || ''; }
  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ Authorization: 'Bearer ' + token }, opts.headers || {});
    return fetch(path, opts);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text; // textContent only: enquiry text is untrusted
    return e;
  }

  function render(items) {
    var list = $('list');
    list.textContent = '';
    if (!items.length) { say('No enquiries yet.'); return; }
    say(items.length + ' shown');
    items.forEach(function (r) {
      var li = el('li', 'item');
      var head = el('header');
      head.appendChild(el('h2', '', r.name + (r.organisation ? ' (' + r.organisation + ')' : '')));
      head.appendChild(el('span', 'badge ' + r.status, r.status));
      li.appendChild(head);
      var meta = el('p', 'meta');
      var a = el('a', '', r.email); a.href = 'mailto:' + r.email;
      meta.appendChild(a);
      meta.appendChild(document.createTextNode(' · ' + r.service + ' · ' + new Date(r.created_at).toLocaleString() + ' · #' + r.id));
      li.appendChild(meta);
      li.appendChild(el('p', 'msgtext', r.message));
      var sel = el('select');
      ['new', 'read', 'replied', 'archived'].forEach(function (s) {
        var o = el('option', '', s); o.value = s; if (s === r.status) o.selected = true; sel.appendChild(o);
      });
      sel.setAttribute('aria-label', 'Status for enquiry ' + r.id);
      sel.addEventListener('change', function () {
        api('/api/admin/inquiries/' + r.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: sel.value }) })
          .then(function (res) { if (!res.ok) throw new Error(); load(); })
          .catch(function () { say('Could not update that enquiry.'); });
      });
      li.appendChild(sel);
      list.appendChild(li);
    });
  }

  function load() {
    if (!token) { $('login').hidden = false; return; }
    var f = $('filter').value;
    api('/api/admin/inquiries?limit=200' + (f ? '&status=' + encodeURIComponent(f) : '')).then(function (res) {
      if (res.status === 401) { signOut(); say('That token was not accepted.'); return null; }
      if (res.status === 503) { say('Admin is disabled on the server. Set ADMIN_TOKEN and restart.'); return null; }
      return res.json();
    }).then(function (j) { if (j) { $('login').hidden = true; render(j.items); } })
      .catch(function () { say('Could not reach the server.'); });
  }

  function signOut() {
    token = '';
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    $('list').textContent = '';
    $('login').hidden = false;
  }

  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    token = $('token').value.trim();
    try { sessionStorage.setItem(KEY, token); } catch (err) { /* ignore */ }
    $('token').value = '';
    load();
  });
  $('refresh').addEventListener('click', load);
  $('filter').addEventListener('change', load);
  $('logout').addEventListener('click', signOut);
  $('csv').addEventListener('click', function () {
    api('/api/admin/inquiries.csv').then(function (r) { if (!r.ok) throw new Error(); return r.blob(); }).then(function (b) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'ryvqena-inquiries.csv'; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }).catch(function () { say('Export failed.'); });
  });
  load();
})();
