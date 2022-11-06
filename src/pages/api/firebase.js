import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

import { config } from '../../config/firebase';

// Initialize Firebase
export const app = initializeApp(config);

export const db = getFirestore(app);
