/**
 * POPPELL INSURANCE — LEAD RECEIVER
 * ---------------------------------------------------------------------------
 * Paste this ENTIRE file into a new Apps Script project. Do not merge it into
 * an existing script — this one is Poppell's alone.
 *
 * SETUP
 *  1. script.google.com → New project → delete everything → paste this whole file
 *  2. Rename it "Poppell Insurance — Leads"
 *  3. Run `setup` once. Approve the permissions prompt (Sheets + Gmail).
 *  4. Deploy → New deployment → type "Web app"
 *       Execute as:        Me (gvonflue@gmail.com)
 *       Who has access:    Anyone
 *  5. Copy the /exec URL. In Vercel → Settings → Environment Variables add:
 *       SHEETS_WEBHOOK_URL = <that URL>
 *     Redeploy the site.
 *  6. Run `selfTest` to confirm a row lands and the email sends.
 *
 * The Sheet is the source of truth. If the email fails the row still writes —
 * losing the notification is recoverable, losing the lead is not.
 */

// ── CONFIG ──────────────────────────────────────────────────────────────────

// "Poppell Insurance — Website Leads", inside the Alyssa Poppell client folder
var SHEET_ID = '1uuUN91pnZ-v_3oF4hkeZWFDFXubiR3AUR2S7sHCWB00';
var TAB_NAME = 'Leads';

// Where notifications go. CHANGE THIS when she moves off the carrier domain.
var NOTIFY_TO = 'apoppell@farmersagent.com';
var NOTIFY_CC = 'getproytech@gmail.com';

var HEADERS = ['Timestamp','Source','Name','Phone','Email','Interest',
               'Notes','Conversation Summary','Page','Status'];

// ── ENTRY POINT ─────────────────────────────────────────────────────────────

function doPost(e) {
  var out = { ok: false };
  try {
    var d = JSON.parse(e.postData.contents);
    var row = writeRow_(d);          // Sheet first. Always.
    out.ok = true;
    out.row = row;
    try { notify_(d); } catch (mailErr) {
      // The row is already safe. A failed email must never fail the request.
      out.emailed = false;
      out.emailError = String(mailErr);
    }
    if (out.emailed !== false) { out.emailed = true; }
  } catch (err) {
    out.error = String(err);
    // Last resort so nothing is lost silently.
    try {
      MailApp.sendEmail(NOTIFY_CC, 'Poppell lead receiver FAILED',
        String(err) + '\n\nRaw payload:\n' + (e && e.postData ? e.postData.contents : '(none)'));
    } catch (e2) {}
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: 'Poppell lead receiver' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// ── SHEET ───────────────────────────────────────────────────────────────────

function sheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName(TAB_NAME);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(TAB_NAME);
  }
  if (sh.getLastRow() === 0 || String(sh.getRange(1,1).getValue()).trim() === '') {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
      .setFontWeight('bold').setBackground('#4E5548').setFontColor('#F5F1EC');
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 170); sh.setColumnWidth(2, 170);
    sh.setColumnWidth(3, 150); sh.setColumnWidth(4, 130);
    sh.setColumnWidth(5, 220); sh.setColumnWidth(6, 110);
    sh.setColumnWidth(7, 320); sh.setColumnWidth(8, 420);
    sh.setColumnWidth(9, 150); sh.setColumnWidth(10, 110);
  }
  return sh;
}

function writeRow_(d) {
  var sh = sheet_();
  var when = d.timestamp ? new Date(d.timestamp) : new Date();
  sh.appendRow([
    Utilities.formatDate(when, 'America/Denver', 'yyyy-MM-dd HH:mm:ss'),
    d.source   || 'Website',
    d.name     || '',
    d.phone    || '',
    d.email    || '',
    d.interest || '',
    d.notes    || '',
    d.summary  || '',
    d.page     || '/',
    'New'
  ]);
  return sh.getLastRow();
}

// ── EMAIL ───────────────────────────────────────────────────────────────────

function notify_(d) {
  var name = d.name || 'Someone';
  var subject = 'New lead — ' + name + (d.interest ? ' (' + d.interest + ')' : '');

  var lines = [
    ['Name', d.name], ['Phone', d.phone], ['Email', d.email],
    ['Interested in', d.interest], ['Source', d.source], ['Page', d.page]
  ].filter(function (r) { return r[1]; });

  var rows = lines.map(function (r) {
    return '<tr><td style="padding:6px 14px 6px 0;color:#697061;font:12px/1.5 Arial;' +
           'letter-spacing:.08em;text-transform:uppercase;vertical-align:top">' + r[0] +
           '</td><td style="padding:6px 0;font:15px/1.5 Arial;color:#2F352B">' +
           esc_(r[1]) + '</td></tr>';
  }).join('');

  var html =
    '<div style="max-width:600px;font-family:Arial,sans-serif;color:#2F352B">' +
      '<div style="background:#4E5548;color:#F5F1EC;padding:18px 22px">' +
        '<div style="font-size:19px;letter-spacing:.12em;text-transform:uppercase">POPPELL</div>' +
        '<div style="font-size:11px;letter-spacing:.22em;color:#E9DACB;margin-top:4px">NEW WEBSITE LEAD</div>' +
      '</div>' +
      '<div style="border:1px solid #DED5C8;border-top:0;padding:22px">' +
        '<table style="border-collapse:collapse">' + rows + '</table>' +
        (d.notes ? '<p style="margin:18px 0 0;font:14px/1.6 Arial;color:#4E5548">' +
          '<strong>What they need:</strong><br>' + esc_(d.notes) + '</p>' : '') +
        (d.phone ? '<p style="margin:22px 0 0"><a href="tel:' +
          esc_(String(d.phone).replace(/[^0-9+]/g,'')) +
          '" style="background:#2F352B;color:#F5F1EC;text-decoration:none;' +
          'padding:12px 22px;border-radius:999px;font:13px Arial;letter-spacing:.1em">CALL ' +
          esc_(d.phone) + '</a></p>' : '') +
        (d.summary ? '<details style="margin-top:22px"><summary style="cursor:pointer;' +
          'font:12px Arial;letter-spacing:.1em;text-transform:uppercase;color:#697061">' +
          'Full conversation</summary><pre style="white-space:pre-wrap;font:13px/1.6 Arial;' +
          'color:#4E5548;background:#FAF7F3;border:1px solid #DED5C8;padding:14px;margin-top:10px">' +
          esc_(d.summary) + '</pre></details>' : '') +
      '</div>' +
      '<p style="font:11px Arial;color:#8C9384;margin:14px 0 0">' +
        'Logged in the Website Leads sheet. Sent by the Poppell Insurance website.</p>' +
    '</div>';

  MailApp.sendEmail({
    to: NOTIFY_TO,
    cc: NOTIFY_CC,
    subject: subject,
    htmlBody: html,
    replyTo: d.email || NOTIFY_CC,
    name: 'Poppell Insurance Website'
  });
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── RUN THESE BY HAND ───────────────────────────────────────────────────────

function setup() {
  var sh = sheet_();
  Logger.log('Sheet ready: ' + sh.getParent().getUrl());
  Logger.log('Tab: ' + sh.getName() + ' · rows: ' + sh.getLastRow());
}

function selfTest() {
  var payload = {
    timestamp: new Date().toISOString(),
    source: 'Poppell — Ally chat (SELF TEST)',
    name: 'Test Lead — delete this row',
    phone: '719-555-0100',
    email: 'test@example.com',
    interest: 'umbrella',
    notes: 'Self test from Apps Script. Safe to delete.',
    summary: 'Visitor: test\nAlly: test',
    page: '/'
  };
  var row = writeRow_(payload);
  Logger.log('Wrote row ' + row);
  notify_(payload);
  Logger.log('Email sent to ' + NOTIFY_TO + ' (cc ' + NOTIFY_CC + ')');
}
