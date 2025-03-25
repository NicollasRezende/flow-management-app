import React, { useState } from 'react';
import {
    SaveIcon,
    PlusIcon,
    UploadIcon,
    DownloadIcon,
    ViewBoardsIcon,
    EyeIcon,
    EyeOffIcon,
    CogIcon,
    RefreshIcon,
} from '@heroicons/react/outline';

interface MenuToolbarProps {
    onSave: () => void;
    onAddMenu?: (menuId: string, menuType: string) => void;
    onImportJson?: (jsonData: any) => void;
    onExportJson?: () => void;
    onToggleMiniMap: () => void;
    showMiniMap: boolean;
    isSaving: boolean;
}

const MenuToolbar: React.FC<MenuToolbarProps> = ({
    onSave,
    onAddMenu,
    onImportJson,
    onExportJson,
    onToggleMiniMap,
    showMiniMap,
    isSaving,
}) => {
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);
    const [newMenuId, setNewMenuId] = useState('');
    const [newMenuType, setNewMenuType] = useState('button');

    const handleAddMenu = () => {
        if (newMenuId.trim() && onAddMenu) {
            onAddMenu(newMenuId.trim(), newMenuType);
            setNewMenuId('');
            setShowAddMenuModal(false);
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImportJson) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target?.result as string);
                    onImportJson(jsonData);
                } catch (error) {
                    console.error('Error parsing imported JSON:', error);
                    alert('Erro ao importar JSON: formato inválido');
                }
            };
            reader.readAsText(file);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="toolbar sticky top-0 z-10">
            <div className="bg-white shadow-sm p-2 flex items-center space-x-2">
                {/* Logo ou ícone do aplicativo */}
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                        />
                    </svg>
                    <span className="text-lg font-medium text-gray-700 hidden md:inline">
                        Flow Editor
                    </span>
                </div>

                <div className="flex-grow"></div>

                {/* Indicador de status - modo online/offline */}
                <div className="flex items-center mr-2">
                    {navigator.onLine ? (
                        <div className="flex items-center text-green-600 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Online
                        </div>
                    ) : (
                        <div className="flex items-center text-red-600 text-sm">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                            Offline
                        </div>
                    )}
                </div>

                {/* Botões da toolbar */}
                <div className="flex items-center space-x-2">
                    <button
                        className={`btn btn-primary ${
                            isSaving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Salvando...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                    />
                                </svg>
                                Salvar Fluxo
                            </div>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowAddMenuModal(true)}
                        className="btn btn-secondary btn-sm"
                    >
                        <PlusIcon className="h-4 w-4 mr-1.5" />
                        Novo Menu
                    </button>

                    <div className="h-6 border-l border-gray-300 mx-1"></div>

                    <label className="btn btn-secondary btn-sm cursor-pointer">
                        <UploadIcon className="h-4 w-4 mr-1.5" />
                        Importar JSON
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={handleFileImport}
                        />
                    </label>

                    {onExportJson && (
                        <button
                            type="button"
                            onClick={onExportJson}
                            className="btn btn-secondary btn-sm"
                        >
                            <DownloadIcon className="h-4 w-4 mr-1.5" />
                            Exportar JSON
                        </button>
                    )}

                    <div className="h-6 border-l border-gray-300 mx-1"></div>

                    <button
                        type="button"
                        onClick={onToggleMiniMap}
                        className="btn btn-icon btn-secondary"
                        title={
                            showMiniMap ? 'Ocultar Minimapa' : 'Exibir Minimapa'
                        }
                    >
                        {showMiniMap ? (
                            <EyeOffIcon className="h-4 w-4" />
                        ) : (
                            <EyeIcon className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Add Menu Modal */}
            {showAddMenuModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-96 animate-fadeIn">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Adicionar Novo Menu
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="menu-id" className="form-label">
                                    ID do Menu
                                </label>
                                <input
                                    type="text"
                                    id="menu-id"
                                    className="form-input"
                                    value={newMenuId}
                                    onChange={(e) =>
                                        setNewMenuId(e.target.value)
                                    }
                                    placeholder="ex: sobre_nos"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Use apenas letras minúsculas, números e
                                    underscore.
                                </p>
                            </div>
                            <div>
                                <label
                                    htmlFor="menu-type"
                                    className="form-label"
                                >
                                    Tipo de Menu
                                </label>
                                <select
                                    id="menu-type"
                                    className="form-select"
                                    value={newMenuType}
                                    onChange={(e) =>
                                        setNewMenuType(e.target.value)
                                    }
                                >
                                    <option value="button">
                                        Menu de Botões
                                    </option>
                                    <option value="list">Menu de Lista</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddMenuModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddMenu}
                                    className="btn btn-primary"
                                    disabled={!newMenuId.trim()}
                                >
                                    Adicionar
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
