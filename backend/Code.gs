/**
 * AMMF — vales.ae backend (standalone Apps Script web app)
 *
 * Receives POSTs from the site, appends rows to the Sheet, and emails
 * Valentino on each submission.
 *
 * Sheet: My Drive / Marketing & AI consulting / Assessment Mailing List /
 *        "AMMF Assessment & Contact Leads"
 *
 * Deploy: Deploy > Manage deployments > (edit the existing Web app) >
 *   - Execute as: Me
 *   - Who has access: Anyone
 *   Editing the SAME deployment keeps the existing /exec URL.
 *
 * NOTE: the first save after adding MailApp will ask you to re-authorize
 * (it now needs permission to send email). Approve it.
 */

var SHEET_ID       = '1I_3GX5jXbcDRTgA1mXDgajXNg77BSC_HJyclijST6dc';
var NOTIFY_EMAIL   = 'valentino.scicolone@gmail.com';
var ASSESSMENT_TAB = 'Assessment Mailing List';
var CONTACT_TAB    = 'Contact';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SHEET_ID);
    if (data.type === 'contact') {
      saveContact_(ss, data);
      safeNotify_(function () { notifyContact_(data); });
    } else {
      saveAssessment_(ss, data);
      safeNotify_(function () { notifyAssessment_(data); });
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Lets you open the URL in a browser to confirm it's live.
function doGet() {
  return json_({ ok: true, message: 'AMMF endpoint live' });
}

/* ---------- storage ---------- */

function saveAssessment_(ss, d) {
  var sh = getOrCreateSheet_(ss, ASSESSMENT_TAB, [
    'Timestamp', 'First name', 'Last name', 'Email', 'Company',
    'Overall score', 'Stage',
    'Strategy', 'Data & Stack', 'Operations', 'Talent', 'Measurement', 'Activation'
  ]);
  var dim = d.dimensions || {};
  sh.appendRow([
    new Date(), d.first || '', d.last || '', d.email || '', d.company || '',
    d.overall || '', d.stage || '',
    dim['Strategy'] || '', dim['Data & Stack'] || '', dim['Operations'] || '',
    dim['Talent'] || '', dim['Measurement'] || '', dim['Activation'] || ''
  ]);
}

function saveContact_(ss, d) {
  var sh = getOrCreateSheet_(ss, CONTACT_TAB, ['Timestamp', 'Name', 'Email', 'Message']);
  sh.appendRow([ new Date(), d.name || '', d.email || '', d.message || '' ]);
}

/* ---------- email notifications ---------- */

// Never let an email failure break the save / response.
function safeNotify_(fn) {
  try { fn(); } catch (err) { console.warn('notify failed: ' + err); }
}

function notifyContact_(d) {
  var name = d.name || 'Someone';
  var email = d.email || '';
  var msg = d.message || '(no message)';
  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#0D1F5C;line-height:1.5">' +
      '<h2 style="margin:0 0 12px;color:#1A56FF">New contact via vales.ae</h2>' +
      row_('Name', escape_(name)) +
      row_('Email', email ? '<a href="mailto:' + escape_(email) + '">' + escape_(email) + '</a>' : '—') +
      '<p style="margin:14px 0 4px;font-weight:bold">Message</p>' +
      '<div style="background:#F4F7FF;border:1px solid #DCE3FF;border-radius:10px;padding:12px 14px;white-space:pre-wrap">' +
        escape_(msg) +
      '</div>' +
      '<p style="margin-top:16px;font-size:12px;color:#8896B8">Sent ' + new Date().toString() + '</p>' +
    '</div>';
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New contact via vales.ae: ' + name,
    htmlBody: html,
    name: 'vales.ae',
    replyTo: email || NOTIFY_EMAIL
  });
}

function notifyAssessment_(d) {
  var who = ((d.first || '') + ' ' + (d.last || '')).trim() || 'New lead';
  var dim = d.dimensions || {};
  var dimRows = ['Strategy', 'Data & Stack', 'Operations', 'Talent', 'Measurement', 'Activation']
    .map(function (k) { return row_(k, (dim[k] != null ? dim[k] : '—') + ' / 4'); }).join('');
  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#0D1F5C;line-height:1.5">' +
      '<h2 style="margin:0 0 12px;color:#1A56FF">New assessment completed</h2>' +
      row_('Name', escape_(who)) +
      row_('Email', d.email ? '<a href="mailto:' + escape_(d.email) + '">' + escape_(d.email) + '</a>' : '—') +
      row_('Company', escape_(d.company || '—')) +
      row_('Overall', (d.overall != null ? d.overall : '—') + ' / 4') +
      row_('Stage', escape_(d.stage || '—')) +
      '<p style="margin:14px 0 4px;font-weight:bold">By dimension</p>' + dimRows +
      '<p style="margin-top:16px;font-size:12px;color:#8896B8">Sent ' + new Date().toString() + '</p>' +
    '</div>';
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New assessment: ' + who + ' (' + (d.stage || '') + ', ' + (d.overall || '') + '/4)',
    htmlBody: html,
    name: 'vales.ae',
    replyTo: d.email || NOTIFY_EMAIL
  });
}

function row_(label, value) {
  return '<p style="margin:4px 0"><span style="display:inline-block;min-width:90px;color:#8896B8">' +
    label + '</span> <b>' + value + '</b></p>';
}

function escape_(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------- helpers ---------- */

function getOrCreateSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  var def = ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) {
    ss.deleteSheet(def);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Optional: run once from the editor to trigger the auth prompt and
   send yourself a test email without going through the site. */
function testEmail() {
  notifyContact_({ name: 'Test Contact', email: 'test@example.com', message: 'This is a test from Code.gs.' });
}
