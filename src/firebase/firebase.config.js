import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVISJO5L43mBQKxbDmVXOU3OvFiK02iTE",
  authDomain: "secondhand-marketplace-2d363.firebaseapp.com",
  projectId: "secondhand-marketplace-2d363",
  storageBucket: "secondhand-marketplace-2d363.firebasestorage.app",
  messagingSenderId: "782562342134",
  appId: "1:782562342134:web:fa8ad9e837b47f798de8d7",
  measurementId: "G-CJKYG1DENM"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;