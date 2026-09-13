import '../css/ManageCRUD.css'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

const ManageCRUD = () => {
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([]);
    const [proName, setProName] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');

    // 1. Fetch all products to display in the table
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/products/getAll');
        const data = await response.json();
        setProducts(data.product || []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    useEffect(() => {
      fetchProducts();
    }, []);

    // 2. Create Product
    const handleSubmit = async(e) => {
        e.preventDefault();
        setMessage('');
        
        try{
            const formData = new FormData();
            formData.append('proName', proName);
            formData.append('price', price);
            formData.append('qty', qty);
            formData.append('category', category);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await fetch('http://localhost:3000/api/v1/products/createProduct', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.message || 'Failed to create product');
            }
            Swal.fire({
              title: 'Success!',
              text: 'Product created successfully.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            handleCancelEdit();
            fetchProducts();
        }
        catch(error){
            setMessage(error.message);
        }
    };

    // 3. Update Product
    const updateProduct = async(e) => {
      e.preventDefault();
      setMessage('');

      try{
        const formData = new FormData();
        formData.append('proName', proName);
        formData.append('price', price);
        formData.append('qty', qty);
        formData.append('category', category);
        if(imageFile){
          formData.append('image', imageFile);
        }
        const response = await fetch(`http://localhost:3000/api/v1/products/updateProduct/${editId}`, {
          method: 'PUT',
          body: formData,
        });
        const data = await response.json();
        if(!response.ok){
          throw new Error(data.message || 'Failed to update product');
        }
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        handleCancelEdit();
        fetchProducts();
      }
      catch(error){
        setMessage(error.message);
      }
    };

    // 4. Load product data into form when clicking "Edit"
    const handleEdit = (product) => {
      setEditId(product.proId);
      setProName(product.proName);
      setPrice(product.price);
      setQty(product.qty);
      setCategory(product.category);
      setImageFile(null);
      setMessage('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 5. Cancel or reset form
    const handleCancelEdit = () => {
      setEditId(null);
      setProName('');
      setPrice('');
      setQty('');
      setCategory('');
      setImageFile(null);
      setMessage('');
    };

    const deleteProduct = async(id) => {
      const result = await Swal.fire({
        title: 'Are you sure',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete it!'
      })
      if(result.isConfirmed){
      try{
        const response = await fetch(`http://localhost:3000/api/v1/products/deleteProduct/${id}`,{
          method: 'DELETE',
        });
        const data = await response.json();
        if(!response.ok){
          throw new Error(data.message || 'Failed to delete product');
        }
        Swal.fire({
          title: 'Deleted!',
          text: 'Product deleted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
      });
        if(editId === id){
          handleCancleEdit();
        }
        fetchProducts();
      }
      catch(error){
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error'
      });
      }
    }
  }

  return (
    <div className='manage-product'>
      <div className='manage-header'>
        <h2>{editId ? 'Edit Product' : 'Product Management'}</h2>
        <p className='manage-subtitle'>
          {editId ? `Editing product ID #${editId}` : 'Add, update, or manage your inventory products'}
        </p>
      </div>

      {message && <div className='crud-alert-error'>{message}</div>}

      {/* Form: calls updateProduct if editId exists, else handleSubmit */}
      <form onSubmit={editId ? updateProduct : handleSubmit}>

        <div className='form-group'>
          <label htmlFor='proName'>Product Name</label>
          <input
            id='proName'
            type='text'
            value={proName}
            onChange={(e) => setProName(e.target.value)}
            placeholder='Enter product name'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='price'>Price ($)</label>
          <input
            id='price'
            type='number'
            step='0.01'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='0.00'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='qty'>Quantity</label>
          <input
            id='qty'
            type='number'
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder='0'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <input
            id='category'
            type='text'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder='e.g. Electronic, Shoes...'
            required
          />
        </div>

        <div className='form-group full-width'>
          <label htmlFor='image'>
            Product Image {editId && <span style={{ fontSize: '12px', color: '#64748b' }}>(Leave empty to keep current image)</span>}
          </label>
          <input
            id='image'
            type='file'
            accept='image/*'
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </div>

        <div className='form-actions'>
          {editId ? (
            <button type='button' className='btn-cancel' onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          ) : (
            <button type='reset' className='btn-cancel' onClick={handleCancelEdit}>
              Reset
            </button>
          )}

          <button type='submit' className='btn-save'>
            {editId ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>

      {/* Products Table */}
      <div className='manage-table-section'>
        <h3 className='table-section-title'>Product Inventory ({products.length})</h3>
        <div className='table-wrapper'>
          <table className='crud-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.proId} className={editId === item.proId ? 'row-editing' : ''}>
                    <td>#{item.proId}</td>
                    <td>
                      {item.image ? (
                        <img
                          src={
                            item.image.startsWith('http')
                              ? item.image
                              : `http://localhost:3000/uploads/${item.image}`
                          }
                          alt={item.proName}
                          className='table-thumbnail'
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className='table-no-img'>No image</span>
                      )}
                    </td>
                    <td className='table-name'>{item.proName}</td>
                    <td>${Number(item.price || 0).toFixed(2)}</td>
                    <td>{item.qty}</td>
                    <td>
                      <span className='table-category-badge'>{item.category}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type='button'
                        className='btn-table-edit'
                        onClick={() => handleEdit(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type='button'
                        className='btn-table-delete'
                        onClick={() => deleteProduct(item.proId)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7' style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                    No products added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageCRUD
