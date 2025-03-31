import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface CheckListItem {
  id: string;
  text: string;
  checked: boolean;
}

function App() {
  const [items, setItems] = useState<CheckListItem[]>([]);

  const addItem = () => {
    const newItem: CheckListItem = {
      id: Date.now().toString(),
      text: '',
      checked: false
    };
    setItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<CheckListItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">CHECK List</h1>
          <button
            onClick={addItem}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Add new item"
          >
            <PlusCircle size={24} />
          </button>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => updateItem(item.id, { checked: e.target.checked })}
                className="mt-1.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <textarea
                value={item.text}
                onChange={(e) => updateItem(item.id, { text: e.target.value })}
                placeholder="Enter your task..."
                rows={1}
                className="flex-1 resize-none overflow-hidden bg-transparent p-0 focus:ring-0 focus:outline-none"
                style={{
                  height: 'auto',
                  minHeight: '24px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
              <button
                onClick={() => deleteItem(item.id)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                aria-label="Delete item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;