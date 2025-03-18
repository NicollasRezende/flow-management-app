import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { FlowNode } from '../types/flow';

interface NodeEditorProps {
  node?: FlowNode;
  onClose: () => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ node, onClose }) => {
  const { addNode, updateNode } = useFlow();
  const [formData, setFormData] = useState<Partial<FlowNode>>(
    node || {
      type: 'step',
      name: '',
      description: '',
      actions: [],
      nextSteps: [],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (node) {
      updateNode(node.id, formData);
    } else {
      addNode({
        ...formData,
        id: `node-${Date.now()}`,
        position: { x: 0, y: 0 },
      } as FlowNode);
    }
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as FlowNode['type'],
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="step">Step</option>
              <option value="action">Action</option>
              <option value="condition">Condition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              {node ? 'Update' : 'Create'} Node
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NodeEditor;