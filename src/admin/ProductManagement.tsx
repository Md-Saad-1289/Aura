import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Layers,
  Upload,
  Loader2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductStatus, ProductVariantColor } from '../types';
import { api } from '../services/api';

export const ProductManagement: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, formatPrice } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    brand: 'AURA Atelier',
    category: categories[0]?.name || 'Audio & Acoustics',
    subcategory: categories[0]?.subcategories[0] || 'Over-Ear Headphones',
    price: 199,
    compareAtPrice: 249,
    costPrice: 85,
    stock: 25,
    lowStockThreshold: 5,
    sku: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'active',
    shortDescription: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'],
    variants: {
      colors: [
        { name: 'Matte Onyx', hex: '#18181b' },
        { name: 'Titanium Silver', hex: '#94a3b8' }
      ],
      sizes: ['Standard']
    },
    specifications: {
      'Driver Architecture': '40mm Titanium Dynamic',
      'Battery Endurance': '45 Hours ANC',
      'Weight': '250g'
    },
    tags: ['featured', 'new'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isOnSale: false
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Filtering & Pagination State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchSku) return false;
      }

      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;

      if (stockFilter === 'low' && (p.stock <= 0 || p.stock > p.lowStockThreshold)) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;
      if (stockFilter === 'in' && p.stock <= 0) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, stockFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Handle select all
  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p.id));
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedProducts.some((p) => p.id === id)));
    } else {
      const pageIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Bulk action handlers
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) {
      selectedIds.forEach((id) => deleteProduct(id));
      setSelectedIds([]);
    }
  };

  const handleBulkSetStatus = (status: ProductStatus) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => updateProduct(id, { status }));
    setSelectedIds([]);
  };

  const handleBulkSetFeatured = (isFeatured: boolean) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => updateProduct(id, { isFeatured }));
    setSelectedIds([]);
  };

  // Inventory value computation
  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }, [products]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'AURA Atelier',
      category: categories[0]?.name || 'Audio & Acoustics',
      subcategory: categories[0]?.subcategories[0] || 'Over-Ear Headphones',
      price: 199,
      compareAtPrice: 249,
      costPrice: 85,
      stock: 25,
      lowStockThreshold: 5,
      sku: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'active',
      shortDescription: 'Precision crafted minimalist luxury piece.',
      description: 'Crafted with premium materials for discerning individuals who appreciate industrial perfection and understated elegance.',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'],
      variants: {
        colors: [
          { name: 'Matte Onyx', hex: '#18181b' },
          { name: 'Titanium Silver', hex: '#94a3b8' }
        ],
        sizes: ['Standard']
      },
      specifications: {
        'Materials': 'Titanium & Organic Italian Leather',
        'Origin': 'Florence Atelier'
      },
      tags: ['featured'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isOnSale: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      const name = formData.name || 'Untitled Artifact';
      addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand: formData.brand || 'AURA Atelier',
        category: formData.category || 'Audio & Acoustics',
        subcategory: formData.subcategory || 'General',
        price: Number(formData.price) || 99,
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        stock: Number(formData.stock) || 10,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
        sku: formData.sku || `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        status: formData.status || 'active',
        shortDescription: formData.shortDescription || '',
        description: formData.description || '',
        images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'],
        variants: formData.variants || {},
        specifications: formData.specifications || {},
        tags: formData.tags || [],
        rating: 5.0,
        reviewCount: 1,
        isFeatured: Boolean(formData.isFeatured),
        isNewArrival: Boolean(formData.isNewArrival),
        isBestSeller: Boolean(formData.isBestSeller),
        isOnSale: Boolean(formData.isOnSale)
      });
    }

    setIsModalOpen(false);
  };

  const handleDuplicateProduct = (p: Product) => {
    addProduct({
      ...p,
      name: `${p.name} (Copy)`,
      sku: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'draft'
    });
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await api.uploadImage(base64Data, 'blinkupz_products');
          if (res.success && res.url) {
            setFormData(prev => ({
              ...prev,
              images: [...(prev.images || []), res.url]
            }));
          }
        } catch (err: any) {
          setUploadError(err?.message || 'Failed to upload image to Cloudinary CDN.');
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.onerror = () => {
        setUploadError('Failed to read local file.');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err?.message || 'Upload error occurred.');
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const newColor: ProductVariantColor = { name: newColorName.trim(), hex: newColorHex };
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        colors: [...(prev.variants?.colors || []), newColor]
      }
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        colors: (prev.variants?.colors || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddSize = () => {
    if (!newSizeInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        sizes: [...(prev.variants?.sizes || []), newSizeInput.trim()]
      }
    }));
    setNewSizeInput('');
  };

  const handleRemoveSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        sizes: (prev.variants?.sizes || []).filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey.trim()]: newSpecVal.trim()
      }
    }));
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpec = (key: string) => {
    setFormData(prev => {
      const nextSpecs = { ...prev.specifications };
      delete nextSpecs[key];
      return { ...prev, specifications: nextSpecs };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Catalog & Inventory Management
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure luxury products, variant palettes, pricing tiers, and warehouse reserves.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Mini-Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Products</span>
          <p className="text-xl font-mono font-bold text-zinc-950 mt-1">{products.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Active Live</span>
          <p className="text-xl font-mono font-bold text-emerald-700 mt-1">
            {products.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Low Stock Alerts</span>
          <p className="text-xl font-mono font-bold text-amber-600 mt-1">
            {products.filter(p => p.stock <= p.lowStockThreshold).length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Catalog Inventory Value</span>
          <p className="text-xl font-mono font-bold text-zinc-950 mt-1">
            {formatPrice(totalInventoryValue)}
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, brand, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Stock */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Stock Levels</option>
            <option value="in">In Stock Only</option>
            <option value="low">Low Stock (≤ threshold)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-zinc-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="bg-amber-400 text-zinc-950 font-bold px-2 py-0.5 rounded-full font-mono">
              {selectedIds.length}
            </span>
            <span>artifacts selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => handleBulkSetStatus('active')}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-semibold transition-colors"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkSetStatus('draft')}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-semibold transition-colors"
            >
              Set Draft
            </button>
            <button
              onClick={() => handleBulkSetFeatured(true)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-semibold transition-colors"
            >
              Feature In Store
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Artifact</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400 text-xs">
                    No products found matching your active filters.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
                  const isChecked = selectedIds.includes(product.id);

                  return (
                    <tr key={product.id} className={`hover:bg-zinc-50/80 transition-colors ${isChecked ? 'bg-zinc-50/60' : ''}`}>
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(product.id)}
                          className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                        />
                      </td>

                      {/* Product Thumbnail + Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-zinc-100 border border-zinc-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-950 truncate max-w-xs">{product.name}</p>
                            <p className="text-[10px] text-zinc-400 uppercase font-semibold">{product.brand}</p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-zinc-600 text-[11px]">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-zinc-700">
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-zinc-950 font-mono">
                          {formatPrice(product.price)}
                        </div>
                        {product.compareAtPrice && (
                          <div className="text-[10px] text-zinc-400 line-through font-mono">
                            {formatPrice(product.compareAtPrice)}
                          </div>
                        )}
                      </td>

                      {/* Stock Stepper in-table */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={product.stock}
                            onChange={(e) => updateProduct(product.id, { stock: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-16 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs font-bold text-zinc-900 text-center"
                          />
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              Out
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              Low
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          product.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : product.status === 'draft'
                            ? 'bg-zinc-100 text-zinc-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicateProduct(product)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete "${product.name}" from catalog?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Bar */}
        <div className="p-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-zinc-500">
            <span>
              Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} artifacts
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px]">Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-xs text-zinc-800 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-zinc-800 font-semibold transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg font-semibold text-xs transition-colors ${
                  currentPage === pg
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-zinc-800 font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div>
                <h2 className="text-lg font-serif font-bold text-zinc-950">
                  {editingProduct ? `Edit Artifact: ${editingProduct.name}` : 'Create New Luxury Artifact'}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Specify catalog presentation, variant swatches, pricing tiers, and specs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-900 rounded-xl hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  1. General Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aura Studio Noise-Cancelling Headphones"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Brand / Atelier</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Subcategory</label>
                    <input
                      type="text"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">SKU Number</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-mono focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Short Elevator Pitch</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Concise one-line summary for product cards"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Full Description & Story</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  2. Financials & Inventory
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Selling Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Compare-at Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice || ''}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-800 mb-1">Low Stock Warning Threshold</label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900"
                    />
                  </div>
                </div>
              </div>

              {/* High Res Product Images & Cloudinary Integration */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    3. Imagery & Gallery (Cloudinary CDN)
                  </h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                    Cloudinary CDN Active
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Direct Cloudinary Upload Button */}
                  <label className="relative cursor-pointer px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 p-2 rounded-xl">
                    {uploadError}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-2xs">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant Swatches (Colors & Sizes) */}
              <div className="space-y-4 pt-4 border-t border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  4. Variant Builder (Colors & Sizes)
                </h3>

                {/* Color Builder */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-zinc-800">Colorways</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Color name (e.g. Matte Onyx)"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-900"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-xl"
                    >
                      + Add Color
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(formData.variants?.colors || []).map((col, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-xs">
                        <span className="w-3 h-3 rounded-full border border-zinc-300" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                        <button type="button" onClick={() => handleRemoveColor(idx)} className="text-zinc-400 hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Size Builder */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-zinc-800">Sizes</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Size label (e.g. S, M, L or 42mm)"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-xl"
                    >
                      + Add Size
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(formData.variants?.sizes || []).map((sz, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded-full text-xs font-medium">
                        <span>{sz}</span>
                        <button type="button" onClick={() => handleRemoveSize(idx)} className="text-zinc-400 hover:text-rose-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges & Publication Status */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  5. Storefront Badges & Visibility
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <label className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-zinc-950"
                    />
                    <span className="font-semibold text-zinc-800">Featured</span>
                  </label>

                  <label className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-zinc-950"
                    />
                    <span className="font-semibold text-zinc-800">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-zinc-950"
                    />
                    <span className="font-semibold text-zinc-800">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOnSale}
                      onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                      className="accent-zinc-950"
                    />
                    <span className="font-semibold text-zinc-800">On Sale</span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                    className="w-full sm:w-60 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 font-bold"
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-zinc-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
