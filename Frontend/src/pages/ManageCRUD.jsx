import '../css/ManageCRUD.css'
import { useState } from 'react'

const ManageCRUD = () => {
    const [proName, setProName] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
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
            alert('Product created successfully.');
            setProName('');
            setPrice('');
            setQty('');
            setCategory('');
            setImageFile(null);
            e.target.reset();
        }
        catch(error){
            setMessage(error.message);
        }
    };
  return (
    <div className='manage-product'>
      <div className='manage-header'>
        <h2>Product Management</h2>
        <p className='manage-subtitle'>Add, update, or manage your inventory products</p>
      </div>

      {message && <div className='crud-alert-error'>{message}</div>}

      <form onSubmit={handleSubmit}>

        <div className='form-group'>
          <label htmlFor='proName'>Product Name</label>
          <input id='proName' type='text' value={proName} onChange={(e) => setProName(e.target.value)} placeholder='Enter product name' />
        </div>

        <div className='form-group'>
          <label htmlFor='price'>Price ($)</label>
          <input id='price' type='number' value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className='form-group'>
          <label htmlFor='qty'>Quantity</label>
          <input id='qty' type='number' value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>

        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <input id='category' type='text' value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className='form-group'>
          <label htmlFor='image'>Product Image</label>
          <input id='image' type='file' accept='image/*' onChange={(e) => setImageFile(e.target.files[0] || null)} />
        </div>

        <div className='form-actions'>
          <button type='reset' className='btn-cancel'>
            Reset
          </button>
          <button type='submit' className='btn-save'>
            Save Product
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManageCRUD
