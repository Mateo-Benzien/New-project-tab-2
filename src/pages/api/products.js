// pages/api/products.js
import { db } from '../../lib/firebaseConfig';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10, lastVisibleId = null } = req.query; // Page number, page size, and the last document ID

    const productCollection = collection(db, 'products');
    let q;

    if (lastVisibleId) {
      // If lastVisibleId is provided, fetch products starting after the last document
      const lastDocSnapshot = await getDocs(query(productCollection, orderBy('name'), limit(1), startAfter(lastVisibleId)));
      q = query(productCollection, orderBy('name'), startAfter(lastDocSnapshot), limit(parseInt(limit)));
    } else {
      // Initial query without any cursor
      q = query(productCollection, orderBy('name'), limit(parseInt(limit)));
    }

    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Get the last document in the snapshot for pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    res.status(200).json({
      products,
      lastVisibleId: lastVisible ? lastVisible.id : null,
      nextPage: lastVisible ? parseInt(page) + 1 : null,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
