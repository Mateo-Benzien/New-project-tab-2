import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import SignOutButton from '../components/SignOutButton';
import ProductList from '../components/ProductList';
import { fetchProducts, fetchCategories } from '../api/api';

export default function ProductListing({ initialProducts, initialCategories }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  
  // State variables
  const { page = 1, search = '', category = '', sort = 'asc' } = router.query;
  const [products, setProducts] = useState(initialProducts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [currentPage, setCurrentPage] = useState(Number(page));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(search);
  const [sortOption, setSortOption] = useState(sort);

  // Fetch products based on filters
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await fetchProducts({
          page: currentPage,
          searchQuery,
          category: selectedCategory,
          sortOption,
        });
        setProducts(productData);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentPage, searchQuery, selectedCategory, sortOption]);

  // Update query parameters on state changes
  useEffect(() => {
    const query = { page: currentPage, search: searchQuery, category: selectedCategory, sort: sortOption };
    router.push({ pathname: '/', query }, undefined, { shallow: true });
  }, [currentPage, searchQuery, selectedCategory, sortOption]);

  // Handlers for various user actions
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    setCurrentPage(prevPage);
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortOption('asc');
    setCurrentPage(1);
    router.push({ pathname: '/', query: { page: 1, search: '', category: '', sort: 'asc' } }, undefined, { shallow: true });
  };

  return (
    <div className="container">
      <h1 className="title">Our Products</h1>
      {!user ? (
        <>
          <SignUpForm />
          <SignInForm />
        </>
      ) : (
        <>
          <SignOutButton />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={handleSearch} 
            placeholder="Search for products..." 
            className="search-input" 
          />
          <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
          <option value="">All Categories</option>
          <option value="kitchen-accessories">kitchen-accessories</option>
          <option value="groceries">groceries</option>
          <option value="sports-accessories">sports-accessories</option>
          <option value="beauty">beauty</option>
          <option value="skin-care">skin-care</option>
          <option value="mobile-accessories">mobile-accessories</option>
          <option value="home-decoration">home-decoration</option>
          <option value="sunglasses">sunglasses</option>
          <option value="womens-shoes">womens-shoes</option>
          <option value="mens-shirts">mens-shirts</option>
          <option value="tops">tops</option>
          <option value="womens-jewellery">womens-jewellery</option>
          <option value="womens-bags">womens-bags</option>
          <option value="fragrances">fragrances</option>
          <option value="smartphones">smartphones</option>
          <option value="furniture">Furniture</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
          <button onClick={handleReset} className="reset-button">Reset Filters</button>
          {error ? (
            <div className="error-message">{error}</div>
          ) : loading ? (
            <div className="loading-message">Loading...</div>
          ) : (
            <>
              <ProductList products={products} />
              <div className="pagination">
                <button className="btn" onClick={handlePrevPage} disabled={currentPage === 1}>
                  &larr; Previous
                </button>
                <span className="page-number">Page {currentPage}</span>
                <button className="btn" onClick={handleNextPage} disabled={products.length < 20}>
                  Next &rarr;
                </button>
              </div>
            </>
          )}
        </>
      )}
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: auto;
        }
        .title {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #333;
        }
        .search-input,
        .category-select,
        .sort-select,
        .reset-button {
          margin-right: 10px;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #e1e1e1;
        }
        .reset-button {
          background-color: #ff4757;
          color: white;
        }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .btn {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .container {
            padding: 10px;
          }
          .title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

// Server-side data fetching
export async function getServerSideProps(context) {
  try {
    const page = parseInt(context.query.page) || 1;
    const searchQuery = context.query.search || '';
    const selectedCategory = context.query.category || '';
    const sortOption = context.query.sort || 'asc';

    const products = await fetchProducts({
      page,
      searchQuery,
      category: selectedCategory,
      sortOption,
    });
    const categories = await fetchCategories();

    return { props: { initialProducts: products, initialCategories: categories } };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return { props: { error: "Failed to load products" } };
  }
}
