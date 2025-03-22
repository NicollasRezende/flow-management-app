import React, { useState } from 'react';

interface MenuToolbarProps {
    onSave: () => void;
    onAddMenu?: (menuId: string, menuType: string) => void;
    onImportJson?: (jsonData: any) => void;
    onExportJson?: () => void;
    onToggleMiniMap?: () => void;
    showMiniMap?: boolean;
    isSaving?: boolean; // Novo prop para status de salvamento
}

const MenuToolbar: React.FC<MenuToolbarProps> = ({
    onSave,
    onAddMenu,
    onImportJson,
    onExportJson,
    onToggleMiniMap,
    showMiniMap,
    isSaving = false, // Valor padrão é falso
}) => {
    const [newMenuId, setNewMenuId] = useState('');
    const [menuType, setMenuType] = useState('button');
    const [showNewMenuForm, setShowNewMenuForm] = useState(false);
    const [isAddingMenu, setIsAddingMenu] = useState(false);

    console.log(
        'MenuToolbar - Renderizando. onSave é função?',
        typeof onSave === 'function'
    );
    console.log('MenuToolbar - Status de salvamento (isSaving):', isSaving);

    const handleAddMenu = () => {
        console.log('MenuToolbar - Botão Adicionar Menu clicado');
        setShowNewMenuForm(true);
    };

    const handleSaveNewMenu = () => {
        console.log('MenuToolbar - Salvando novo menu:', newMenuId, menuType);
        if (newMenuId && onAddMenu) {
            setIsAddingMenu(true);
            try {
                onAddMenu(newMenuId, menuType);
                console.log('MenuToolbar - Menu adicionado com sucesso');
                setNewMenuId('');
                setShowNewMenuForm(false);
            } catch (error) {
                console.error('MenuToolbar - Erro ao adicionar menu:', error);
            } finally {
                setIsAddingMenu(false);
            }
        }
    };

    const handleSaveClick = () => {
        console.log('MenuToolbar - Botão Salvar clicado');
        if (typeof onSave !== 'function') {
            console.error('MenuToolbar - ERRO: onSave não é uma função');
            alert('Erro: A função de salvamento não está disponível');
            return;
        }

        try {
            console.log('MenuToolbar - Chamando onSave...');
            onSave();
            console.log('MenuToolbar - onSave executado com sucesso');
        } catch (error) {
            console.error('MenuToolbar - Erro ao executar onSave:', error);
            alert('Erro ao salvar. Veja o console para detalhes.');
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('MenuToolbar - Iniciando importação de arquivo');
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    console.log(
                        'MenuToolbar - Arquivo lido, tentando parse JSON'
                    );
                    const jsonData = JSON.parse(event.target?.result as string);
                    console.log('MenuToolbar - Parse JSON bem-sucedido');

                    if (onImportJson) {
                        console.log('MenuToolbar - Chamando onImportJson');
                        onImportJson(jsonData);
                    } else {
                        console.error(
                            'MenuToolbar - onImportJson não está disponível'
                        );
                    }
                } catch (error) {
                    console.error(
                        'MenuToolbar - Erro ao processar arquivo JSON:',
                        error
                    );
                    alert(
                        'Erro ao processar o arquivo JSON. Verifique o formato.'
                    );
                }
            };

            reader.onerror = (error) => {
                console.error('MenuToolbar - Erro ao ler arquivo:', error);
                alert('Erro ao ler o arquivo.');
            };

            reader.readAsText(file);
        }
    };

    const handleToggleMiniMap = () => {
        console.log('MenuToolbar - Toggle MiniMap clicado');
        if (onToggleMiniMap) {
            onToggleMiniMap();
        }
    };

    // Renderiza o botão de salvar com diferentes estilos baseados no estado
    const renderSaveButton = () => {
        // Estado de salvamento em progresso
        if (isSaving) {
            return (
                <button
                    className="bg-blue-400 text-white px-4 py-2 rounded opacity-75 cursor-not-allowed flex items-center"
                    disabled={true}
                >
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
                </button>
            );
        }

        // Estado normal (não está salvando)
        return (
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center"
                onClick={handleSaveClick}
                data-testid="save-button"
            >
                <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                </svg>
                Salvar Alterações
            </button>
        );
    };

    return (
        <div className="bg-gray-100 p-4 border-b border-gray-300 flex flex-wrap items-center gap-4">
            {/* Botão de salvar com feedback visual */}
            {renderSaveButton()}

            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center"
                onClick={handleAddMenu}
                disabled={isSaving}
            >
                <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Adicionar Menu
            </button>

            <div className="flex gap-2">
                <label
                    htmlFor="import-json"
                    className={`cursor-pointer bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition flex items-center ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                    </svg>
                    Importar JSON
                </label>
                <input
                    id="import-json"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileImport}
                    disabled={isSaving}
                />

                <button
                    className={`bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition flex items-center ${
                        isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={onExportJson}
                    disabled={isSaving}
                >
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Exportar JSON
                </button>
            </div>

            <button
                className={`px-4 py-2 rounded transition flex items-center ${
                    showMiniMap
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleToggleMiniMap}
                disabled={isSaving}
            >
                <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                </svg>
                {showMiniMap ? 'Ocultar Minimap' : 'Mostrar Minimap'}
            </button>

            {showNewMenuForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">
                            Adicionar Novo Menu
                        </h3>
                        <div className="mb-4">
                            <label
                                htmlFor="menu-id"
                                className="block text-gray-700 mb-2"
                            >
                                ID do Menu
                            </label>
                            <input
                                id="menu-id"
                                type="text"
                                className="w-full p-2 border rounded"
                                value={newMenuId}
                                onChange={(e) => setNewMenuId(e.target.value)}
                                placeholder="Digite o ID do menu..."
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="menu-type"
                                className="block text-gray-700 mb-2"
                            >
                                Tipo de Menu
                            </label>
                            <select
                                id="menu-type"
                                className="w-full p-2 border rounded"
                                value={menuType}
                                onChange={(e) => setMenuType(e.target.value)}
                            >
                                <option value="button">Botões</option>
                                <option value="list">Lista</option>
                                <option value="text">Texto</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                                onClick={() => setShowNewMenuForm(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                onClick={handleSaveNewMenu}
                                disabled={isAddingMenu || !newMenuId}
                            >
                                {isAddingMenu ? 'Adicionando...' : 'Adicionar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuToolbar;
