import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import 'dotenv/config';

function readBooksJSON(filename) {
  const jsonPath = path.join(process.cwd(), 'json_results', filename);

  if (!fs.existsSync(jsonPath)) {
    console.warn(`⚠️ File not found: ${jsonPath}`);
    return [];
  }

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    return data.map(book => [
      book.image || '',
      book.link || '',
      book.title || '',
      book.author || '',
      book.writerInfo || '',
      book.description || '',
      book.other || '',
    ]);
  } catch (err) {
    console.error(`❌ Invalid JSON: ${jsonPath}`);
    return [];
  }
}

const UPDATE_ROW_BY_COUNTRY = {
  USA: 2,
  KOREA: 3,
  JAPAN: 4,
  UK: 5,
  SPAIN: 6,
  CHINA: 7,
  FRANCE: 8,
  TAIWAN: 9,
};


function getKSTDateYYMMDD() {
  const now = new Date();

  // Convert to KST (UTC + 9)
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const yy = String(kst.getFullYear()).slice(2);
  const mm = String(kst.getMonth() + 1).padStart(2, '0');
  const dd = String(kst.getDate()).padStart(2, '0');

  return `${yy}${mm}${dd}`;
}

async function batchUpdateValues(spreadsheetId, valueInputOption, data) {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

  const auth = new GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const result = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    resource: { data, valueInputOption },
  });

  console.log(`✅ Updated ${result.data.totalUpdatedCells} cells.`);
}

(async () => {
  const spreadsheetId = '1GoeMU5HbM7g2jujoO5vBI6Z1BH_EjUtnVmV9zWAKpHs';

  const uploads = [
    { country: 'KOREA', range: 'Korea Data!B3', file: 'korea.json' },
    { country: 'USA', range: 'USA Data!B3', file: 'us.json' },
    { country: 'JAPAN', range: 'Japan Data!B3', file: 'japan.json' },
    { country: 'UK', range: 'UK Data!B3', file: 'uk.json' },
    { country: 'CHINA', range: 'China Data!B3', file: 'china.json' },
    { country: 'TAIWAN', range: 'Taiwan Data!B3', file: 'taiwan.json' },
    { country: 'FRANCE', range: 'France Data!B3', file: 'france.json' },
    { country: 'SPAIN', range: 'Spain Data!B3', file: 'spain.json' },
  ];

  const uploadData = [];
  const updateDateData = [];

  const kstDate = getKSTDateYYMMDD();

  for (const u of uploads) {
    const values = readBooksJSON(u.file);

    if (values.length > 0) {
      uploadData.push({
        range: u.range,
        values,
      });

      // add update date ONLY for uploaded country
      updateDateData.push({
        range: `Updates!B${UPDATE_ROW_BY_COUNTRY[u.country]}`,
        values: [[kstDate]],
      });
    }
  }

  if (uploadData.length === 0) {
  console.log('⚠️ No data to upload.');
  return;
}

  await batchUpdateValues(spreadsheetId, 'RAW', [...uploadData, ...updateDateData]);
})();
