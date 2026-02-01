import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// นำ StrictMode ออกเพื่อให้ Player โหลดข้อมูลจาก YouTube เพียงครั้งเดียว
// ช่วยแก้ปัญหาปุ่มหมุนค้าง (Infinite Loading)
root.render(
  <App />
);