import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [saving, setSaving] = useState(false); // Mentés állapot jelzésére
  const [saveError, setSaveError] = useState(''); // Mentési hiba üzenet

  const [form, setForm] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  });

  const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=No+Image";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
        const data = await ApiService.getProducts();
        setProducts(data);
    } catch (e) {
        console.error("Failed to load products");
    } finally {
        setLoading(false);
    }
  };

 const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave = { 
      ...form
    };
    
    try {
      // API hívás
      await ApiService.saveProduct(productToSave);
      
      // Csak sikeres mentés után frissítjük a listát és reseteljük a formot
      loadProducts();
      resetForm();
    } catch (error) {
      // Hiba esetén beállítjuk az üzenetet
      setSaveError('Failed to save product. Check network and server logs.');
      console.error("Save failed:", error);
    } finally {
      setSaving(false); // Mentés befejezése (siker vagy hiba esetén is)
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await ApiService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        alert('Failed to delete product. Check server logs.');
        console.error("Delete failed:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setIsEditing(true);
    setSaveError(''); 
  };

  const resetForm = () => {
    setForm({ id: '', name: '', price: 0, description: '', imageUrl: '' });
    setIsEditing(false);
  };

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button 
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition"
        >
          + Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        {isEditing && (
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit Product' : 'Add Product'}</h2>
                
                {/* HIBA KIJELZÉSE */}
                {saveError && (
                    <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded-md border border-red-200">
                        Hiba történt: {saveError}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                        value={form.price}
                        onChange={e => setForm({...form, price: parseFloat(e.target.value)})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                        placeholder="https://example.com/image.jpg (optional)"
                        value={form.imageUrl}
                        onChange={e => setForm({...form, imageUrl: e.target.value})}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none"
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                    />
                    </div>
                    <div className="flex gap-2 pt-2">
                    <button 
                        type="submit" 
                        disabled={saving} // Gomb tiltása mentés közben
                        className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    </div>
                </form>
                </div>
            </div>
        )}

        {/* List Section  */}
        <div className={isEditing ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
                <div className="p-10 text-center">Loading...</div>
            ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                            <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={product.imageUrl || PLACEHOLDER_IMAGE} 
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = PLACEHOLDER_IMAGE;
                                }}
                                alt="" 
                            />
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};