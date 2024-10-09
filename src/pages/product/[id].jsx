import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchProductById } from '../../api/api';
import ReviewList from '../../components/ReviewList';

export default function ProductDetail({ initialProduct }) {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(initialProduct || {});
  const [reviews, setReviews] = useState(product.reviews || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('latest');

  // Fetch product details if not provided during SSR
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProductById(id);
        setProduct(productData);
        setReviews(productData.reviews || []);
      } catch (err) {
        setError('Failed to load product details or reviews');
      } finally {
        setLoading(false);
      }
    };
    if (!initialProduct) {
      loadProduct();
    }
  }, [id, initialProduct]);

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (sortOption === 'latest') {
      return dateB - dateA;
    } else if (sortOption === 'oldest') {
      return dateA - dateB;
    } else if (sortOption === 'highestRating') {
      return b.rating - a.rating;
    } else if (sortOption === 'lowestRating') {
      return a.rating - b.rating;
    }
  });

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="product-detail-container">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          <div className="product-image">
            <img src={product.images[0]} alt={product.title} />
          </div>
          <div className="product-info">
            <h1>{product.title}</h1>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="category">{product.category}</p>
            <p className="description">{product.description}</p>
            <p className="stock">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>

            <div className="reviews">
              <h2>Reviews</h2>
              <select value={sortOption} onChange={handleSortChange} className="sort-select">
                <option value="latest">Sort by Latest</option>
                <option value="oldest">Sort by Oldest</option>
                <option value="highestRating">Sort by Highest Rating</option>
                <option value="lowestRating">Sort by Lowest Rating</option>
              </select>
              <ReviewList reviews={sortedReviews} />
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .product-detail-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: auto;
        }

        .product-image {
          flex: 1;
          max-width: 600px;
        }

        .product-image img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .product-info {
          flex: 2;
          max-width: 600px;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #333;
        }

        .price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #e74c3c;
          margin: 10px 0;
        }

        .category {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .description {
          font-size: 1rem;
          margin: 20px 0;
          color: #555;
        }

        .stock {
          font-size: 1.1rem;
          font-weight: bold;
          color: ${product.stock > 0 ? '#27ae60' : '#e74c3c'};
          margin: 10px 0;
        }

        .reviews {
          margin-top: 20px;
        }

        .sort-select {
          margin-bottom: 20px;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #e1e1e1;
        }

        .error-message {
          color: red;
        }

        .loading-message {
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .product-detail-container {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
 
export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const product = await fetchProductById(id);
    return { props: { initialProduct: product } };
  } catch (error) {
    return { props: { error: 'Failed to load product details' } };
  }
}
