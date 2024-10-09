// src/pages/api/categories.js
import { db } from '../../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).json(categories);
}
