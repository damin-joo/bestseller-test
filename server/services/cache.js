import axios from 'axios';
import { parse } from 'csv-parse/sync';

const SPREADSHEET_ID = '1GoeMU5HbM7g2jujoO5vBI6Z1BH_EjUtnVmV9zWAKpHs';

// 국가별 시트 GID 매핑 (LanguageContext.js와 동일)
const sheetGidMap = {
  kr: '161667220', // Korea
  jp: '1994696482', // JAPAN
  us: '638692902', // US
  tw: '287677657', // TAIWAN
  fr: '460284331', // FRANCE
  uk: '1872205236', // UK
  es: '806262731', // Spain
  ch: '225038494', // CHINA
};

// 메모리 캐시 (24시간 TTL)
const memoryCache = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간

/**
 * 구글 시트에서 책 데이터 읽기
 * @param {string} country - 국가 코드 (kr, jp, us, tw, fr, uk, es, ch)
 * @returns {Promise<Array>} 책 목록
 */
async function getBooksFromGoogleSheets(country) {
  try {
    const gid = sheetGidMap[country];
    if (!gid) {
      throw new Error(`Unknown country: ${country}`);
    }

    // LanguageContext.js와 동일한 형식 사용
    // TSV 형식으로 가져오기 (CSV와 동일하게 파싱 가능)
    const tsvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=tsv&gid=${gid}&range=B3:M102`;

    const response = await axios.get(tsvUrl, {
      responseType: 'text',
      timeout: 10000,
    });

    // TSV 파싱 (탭으로 구분)
    const lines = response.data.trim().split('\n');
    const records = lines.map(line => line.split('\t').map(cell => cell.trim()));

    // 데이터 매핑 (B3:M102 범위)
    // B: 이미지, C: 링크, D: 제목, E: 작가, F: 작가 정보, G: 책에 대해, H: 더 많은 정보
    // I: 제목(한국어), J: 작가(한국어), K: 작가 정보(한국어), L: 책에 대해(한국어), M: 더 많은 정보(한국어)
    // TSV 파싱 시 B가 첫 번째 컬럼이므로 row[0] = B, row[1] = C, row[2] = D, ...
    const books = records
      .filter(row => row.length > 2 && row[2] && row[2].trim()) // 제목이 있는 행만 (D 컬럼 = row[2])
      .map((row, index) => ({
        ranking: index + 1,
        image: row[0]?.trim() || '', // B 컬럼
        link: row[1]?.trim() || '', // C 컬럼
        title: row[2]?.trim() || '', // D 컬럼
        author: row[3]?.trim() || '', // E 컬럼
        authorInfo: row[4]?.trim() || '', // F 컬럼
        description: row[5]?.trim() || '', // G 컬럼
        moreInfo: row[6]?.trim() || '', // H 컬럼
        // 한국어 필드
        title_kr: row[7]?.trim() || '', // I 컬럼
        author_kr: row[8]?.trim() || '', // J 컬럼
        authorInfo_kr: row[9]?.trim() || '', // K 컬럼
        description_kr: row[10]?.trim() || '', // L 컬럼
        moreInfo_kr: row[11]?.trim() || '', // M 컬럼
      }));

    return books;
  } catch (err) {
    console.error(`❌ 구글닥스 읽기 오류 (${country}):`, err.message);
    throw err;
  }
}

/**
 * 캐시에서 책 데이터 가져오기 (구글 시트 기반)
 * @param {string} country - 국가 코드
 * @returns {Promise<Array>} 책 목록
 */
export async function getBooksFromCache(country) {
  try {
    // 메모리 캐시 확인
    const cacheKey = country;
    const cached = memoryCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`✅ 메모리 캐시 사용 (${country}): ${cached.data.length}권`);
      return cached.data;
    }

    // 구글 시트에서 데이터 가져오기
    console.log(`📘 구글닥스에서 데이터 가져오는 중 (${country})...`);
    const books = await getBooksFromGoogleSheets(country);

    // 메모리 캐시에 저장
    memoryCache[cacheKey] = {
      data: books,
      timestamp: Date.now(),
    };

    console.log(`✅ 구글닥스 데이터 로드 성공 (${country}): ${books.length}권`);
    return books;
  } catch (err) {
    console.error(`❌ Cache read error (${country}):`, err.message);
    return [];
  }
}

/**
 * 캐시 존재 여부 확인 (항상 true - 구글 시트 사용)
 * @param {string} country - 국가 코드
 * @returns {Promise<boolean>}
 */
export async function cacheExists(country) {
  // 구글 시트를 사용하므로 항상 true 반환
  return true;
}
