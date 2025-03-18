import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/solid';
import {
    SaveIcon,
    PlusIcon,
    DownloadIcon,
    UploadIcon,
    MapIcon,
} from '@heroicons/react/outline';

interface MenuToolbarProps {
    onSave: () => void;
    onAddMenu?: (menuId: string, menuType: string) => void;
    onImportJson?: (jsonData: any) => void;
    onExportJson?: () => void;
    onToggleMiniMap?: () => void;
    showMiniMap?: boolean;
}

const MenuToolbar: React.FC<MenuToolbarProps> = ({
    onSave,
    onAddMenu,
    onImportJson,
    onExportJson,
    onToggleMiniMap,
    showMiniMap = true,
}) => {
    const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
    const [newMenuId, setNewMenuId] = useState('');
    const [menuType, setMenuType] = useState('button');

    const handleAddMenu = () => {
        // Open modal to create a new menu
        setIsAddMenuModalOpen(true);
    };

    const handleCreateMenu = () => {
        if (newMenuId && newMenuId.trim() !== '') {
            if (onAddMenu) {
                onAddMenu(newMenuId.trim().toLowerCase(), menuType);
            }
            setNewMenuId('');
            setIsAddMenuModalOpen(false);
        }
    };

    const handleExportJson = () => {
        // This function would usually trigger a save event
        onSave();

        // Then export JSON
        if (onExportJson) {
            onExportJson();
        } else {
            // Fallback if onExportJson is not provided
            alert('Export JSON functionality would be implemented here');
        }
    };

    const handleImportJson = () => {
        // Create a file input and trigger a click
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';

        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const jsonData = JSON.parse(
                            event.target?.result as string
                        );
                        if (onImportJson) {
                            onImportJson(jsonData);
                        }
                    } catch (error) {
                        alert(
                            'Error parsing JSON file. Please check the file format.'
                        );
                        console.error('Error parsing JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        };

        fileInput.click();
    };

    return (
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="text-lg font-medium text-gray-900">
                Menu Flow Editor
            </div>

            <div className="flex space-x-2">
                <button
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleAddMenu}
                >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Menu
                </button>

                <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onSave}
                >
                    <SaveIcon className="h-4 w-4 mr-1" />
                    Save
                </button>

                <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleExportJson}
                >
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                </button>

                <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleImportJson}
                >
                    <UploadIcon className="h-4 w-4 mr-1" />
                    Import
                </button>

                {onToggleMiniMap && (
                    <button
                        className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${
                            showMiniMap ? 'bg-gray-100' : 'bg-white'
                        } hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        onClick={onToggleMiniMap}
                    >
                        <MapIcon className="h-4 w-4 mr-1" />
                        {showMiniMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                    </button>
                )}
            </div>

            {/* Add Menu Modal */}
            {isAddMenuModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                Add New Menu
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => setIsAddMenuModalOpen(false)}
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Menu ID
                                </label>
                                <input
                                    type="text"
                                    value={newMenuId}
                                    onChange={(e) =>
                                        setNewMenuId(e.target.value)
                                    }
                                    placeholder="e.g., main_menu, contact_us"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    ID must be unique and contain only lowercase
                                    letters, numbers, and underscores.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Menu Type
                                </label>
                                <select
                                    value={menuType}
                                    onChange={(e) =>
                                        setMenuType(e.target.value)
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="button">Button Menu</option>
                                    <option value="list">List Menu</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleCreateMenu}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Create Menu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuToolbar;
