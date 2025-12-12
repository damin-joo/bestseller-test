import express from 'express';
import { getBooksFromCache, cacheExists } from '../services/cache.js';

const router = express.Router();

/**
 * 한국 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/kr-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('kr');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (KR): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 한국 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 한국 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'KR 데이터 로드 실패', message: err.message });
  }
});

/**
 * 미국 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/us-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('us');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (US): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 미국 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 미국 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'US 데이터 로드 실패', message: err.message });
  }
});

/**
 * 대만 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/tw-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('tw');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (TW): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 대만 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 대만 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'TW 데이터 로드 실패', message: err.message });
  }
});

/**
 * 프랑스 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/fr-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('fr');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (FR): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 프랑스 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 프랑스 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'FR 데이터 로드 실패', message: err.message });
  }
});

/**
 * 영국 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/uk-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('uk');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (UK): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 영국 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 영국 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'UK 데이터 로드 실패', message: err.message });
  }
});

/**
 * 일본 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/jp-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('jp');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (JP): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 일본 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 일본 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'JP 데이터 로드 실패', message: err.message });
  }
});

/**
 * 중국 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/ch-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('ch');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (CH): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 중국 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 중국 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'CH 데이터 로드 실패', message: err.message });
  }
});

/**
 * 스페인 책 목록
 * 구글닥스에서만 읽어옴
 */
router.get('/es-books', async (req, res) => {
  try {
    const books = await getBooksFromCache('es');
    if (books.length > 0) {
      console.log(`✅ 구글닥스 데이터 사용 (ES): ${books.length}권`);
      return res.json({ books });
    }
    console.log('⚠️ 스페인 데이터 없음');
    res.json({ books: [] });
  } catch (err) {
    console.error('❌ 스페인 데이터 로드 실패:', err.message);
    res.status(500).json({ error: 'ES 데이터 로드 실패', message: err.message });
  }
});

export default router;
