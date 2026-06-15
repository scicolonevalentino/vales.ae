/**
 * AMMF — vales.ae backend
 * Container-bound to the Google Sheet:
 *   My Drive / Marketing & AI consulting / Assessment Mailing List /
 *   AMMF Assessment & Contact Leads
 *
 * Receives POSTs from the site and appends rows.
 * Deploy: Deploy > New deployment > Web app
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Then copy the Web app URL into the site (STORAGE_URL).
 */

var ASSESSMENT_TAB = 'Assessment Mailing List';
var CONTACT_TAB    = 'Contact';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (data.type === 'contact') {
      saveContact_(ss, data);
    } else {
      saveAssessment_(ss, data);
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

function getOrCreateSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  // If the default empty "Sheet1" exists and is unused, tidy it away once.
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
