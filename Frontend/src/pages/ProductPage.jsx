import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../css/ProductPage.css'

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:3000/api/v1/products/getAll')
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data.product || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';
  const filteredProducts = products.filter((product) =>
    product.proName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (e) => {
    const text = e.target.value;
    if (text) {
      setSearchParams({
        page: 1,
        search: text
      });
    } else {
      setSearchParams({
        page: 1
      });
    }
  };

  const goToPage = (pageNumber) => {
    if (searchQuery) {
      setSearchParams({
        page: pageNumber,
        search: searchQuery
      });
    } else {
      setSearchParams({
        page: pageNumber
      });
    }
  };

  useEffect(() => {
    fetchProducts()
  }, [])





  return (
    <div className='product-page-container'>
      {/* Header Section */}
      <div className='product-header-section'>
        <div className='product-header-titles'>
          <h1>Product Catalog</h1>
          <p>Browse and manage your inventory products</p>
        </div>

        {/* Search Input */}
        <div className='product-toolbar'>
          <div className='search-input-wrapper'>
            <span className='search-icon'>🔍</span>
            <input
              type='search'
              className='product-search-input'
              placeholder='Search by name or category...'
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <h3>Loading products...</h3>
        </div>
      )}
      {error && <div className='crud-alert-error'>{error}</div>}
      {!loading && !error && (
        <div className='product-grid'>
          {filteredProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.proId} className='product-card'>
                <div className='product-image-container'>
                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith('http')
                          ? product.image
                          : `http://localhost:3000/uploads/${product.image}`
                      }
                      alt={product.proName}
                      className='product-card-img'
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const placeholder = e.target.parentElement.querySelector('.product-image-placeholder');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className='product-image-placeholder'
                    style={{ display: product.image ? 'none' : 'flex' }}
                  >
                    📦
                    <span>{product.image || 'No Image'}</span>
                  </div>
                  {product.category && (
                    <span className='category-badge'>{product.category}</span>
                  )}
                  <span className={`stock-badge ${Number(product.qty) <= 5 ? 'low' : ''}`}>
                    {Number(product.qty) <= 5 ? `Low Stock (${product.qty})` : `In Stock: ${product.qty}`}
                  </span>
                </div>
                <div className='product-details'>
                  <h3 className='product-card-title'>{product.proName}</h3>
                  <div className='product-meta-row'>
                    <div className='product-price-wrapper'>
                      <span className='product-price-label'>Price</span>
                      <span className='product-price'>
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <span className='product-qty'>Qty: {product.qty}</span>
                  </div>
                </div>
                <div className='product-card-actions'>
                  <button className='btn-card-action btn-action-outline'>
                    View Details
                  </button>
                  <button className='btn-card-action btn-action-primary'>
                    Edit Product
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='no-products-found'>
              <h3>No products found</h3>
              <p>
                {searchQuery
                  ? `No products match "${searchQuery}"`
                  : 'No products have been added yet. Go to Manage CRUD to add your first product!'}
              </p>
            </div>
          )}
        </div>
      )}
      <div className='pagination-container'>
        <button
          className='pagination-btn pagination-nav'
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          ← Previous
        </button>
        <button
          className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
          onClick={() => goToPage(1)}
        >
          1
        </button>
        {totalPages >= 2 && (
          <button
            className={`pagination-btn ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => goToPage(2)}
          >
            2
          </button>
        )}
        <button
          className='pagination-btn pagination-nav'
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default ProductPage
