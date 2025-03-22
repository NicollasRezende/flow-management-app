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
            <div className="flex items-center space-x-2">
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isSaving}
                    className="btn btn-primary btn-sm"
                >
                    {isSaving ? (
                        <>
                            <RefreshIcon className="h-4 w-4 mr-1.5 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <SaveIcon className="h-4 w-4 mr-1.5" />
                            Salvar Fluxo
                        </>
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
                    title={showMiniMap ? 'Ocultar Minimapa' : 'Exibir Minimapa'}
                >
                    {showMiniMap ? (
                        <EyeOffIcon className="h-4 w-4" />
                    ) : (
                        <EyeIcon className="h-4 w-4" />
                    )}
                </button>
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
