const CACHE_NAME = 'rx-guide-v1';

// รายชื่อไฟล์ทั้งหมดที่ต้องการให้ Cache ไว้ดูตอน Offline
const urlsToCache = [
  './',
  './index.html',
  './ped-dose.html',
  './ped-screen.html',
  './warfarin.html',
  './preg.html',
  './fungal.html',
  './icon-192x192.png',
  './icon-512x512.png'
  // ถ้ามีไฟล์ CSS หรือ JS แยกข้างนอกให้เอามาใส่ตรงนี้ด้วย
];

// ติดตั้ง Service Worker และโหลดไฟล์เก็บไว้ใน Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// เวลาดึงข้อมูล ให้เช็คก่อนว่ามีใน Cache ไหม ถ้ามีให้เอาจาก Cache ก่อน
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // เจอใน cache ให้ return ของใน cache
        if (response) {
          return response;
        }
        // ถ้าไม่มีก็ให้ไปดึงจากเน็ตตามปกติ
        return fetch(event.request);
      })
  );
});

// จัดการลบ Cache ตัวเก่าทิ้งเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
