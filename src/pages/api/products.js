// pages/api/products.js
import { db } from '../../lib/firebaseConfig';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import Fuse from 'fuse.js'; // Import Fuse.js

export default async function handler(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      lastVisibleId,
      search = '',
      category,
      sort = 'asc',
    } = req.query; // Extract parameters

    const productCollection = collection(db, 'products');

    // Create a base query
    let productQuery = query(productCollection);

    // Add filtering by category if provided
    if (category) {
      productQuery = query(productQuery, where('category', '==', category));
    }

    // Determine the order direction for price sorting
    const orderDirection = sort === 'desc' ? 'desc' : 'asc'; // Default to ascending
    productQuery = query(productQuery, orderBy('price', orderDirection));

    // Pagination handling
    if (lastVisibleId) {
      const lastDocSnapshot = await getDocs(query(productCollection, orderBy('price', orderDirection), limit(1), startAfter(lastVisibleId)));
      if (lastDocSnapshot.empty) {
        return res.status(400).json({ error: 'Invalid lastVisibleId' });
      }
      productQuery = query(productQuery, startAfter(lastDocSnapshot.docs[0]), limit(parseInt(limit)));
    } else {
      productQuery = query(productQuery, limit(parseInt(limit)));
    }

    const querySnapshot = await getDocs(productQuery);
    let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // If a search term is provided, filter products using Fuse.js
    if (search) {
      const fuse = new Fuse(products, {
        keys: ['title'], // Specify the fields to search in
        threshold: 0.3, // Define the threshold for fuzzy matching
      });

      const result = fuse.search(search); // Perform the search
      products = result.map(({ item }) => item); // Extract the filtered products
    }

    // Handle pagination for filtered results
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
