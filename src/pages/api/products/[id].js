// src/pages/api/products/[id].js
import { db } from '../../../lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const productRef = doc(db, 'products', id); // Reference to the product document in Firestore
    const productDoc = await getDoc(productRef); // Fetch the document

    if (!productDoc.exists()) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = productDoc.data(); // Retrieve data from the document

    // Manually adding the 'id' field from the document ID and returning the product data
    res.status(200).json({ id: productDoc.id, ...productData });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}
