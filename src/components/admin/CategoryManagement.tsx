import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop');
    setSubcategories(['General', 'Accessories']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setSubcategories(cat.subcategories || []);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        description,
        image,
        subcategories
      });
    } else {
      addCategory({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
        subcategories
      });
    }

    setIsModalOpen(false);
  };

  const handleAddSubcat = () => {
    if (!newSubcatInput.trim()) return;
    setSubcategories([...subcategories, newSubcatInput.trim()]);
    setNewSubcatInput('');
  };

  const handleRemoveSubcat = (idx: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Category & Collection Architecture
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organize catalog disciplines, lookbook hierarchies, and subcategory tags.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const productCount = products.filter(p => p.category === category.name).length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col justify-between p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-zinc-200 bg-zinc-100 flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-zinc-950">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md uppercase">
                      {productCount} Products
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      /{category.slug}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Subcategories tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="bg-zinc-100 text-zinc-700 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-150 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Slug: /{category.slug}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(category)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category "${category.name}"?`)) {
                          deleteCategory(category.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leather Goods & Travel"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Cover Photo URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">Subcategory Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Duffels, Briefcases"
                    value={newSubcatInput}
                    onChange={(e) => setNewSubcatInput(e.target.value)}
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcat}
                    className="px-3 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold"
                  >
                    + Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {subcategories.map((sub, idx) => (
                    <span key={idx} className="bg-zinc-100 text-zinc-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span>{sub}</span>
                      <button type="button" onClick={() => handleRemoveSubcat(idx)} className="text-zinc-400 hover:text-rose-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
