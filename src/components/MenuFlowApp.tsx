import React, { useState, useEffect, useCallback } from 'react';
import MenuFlowEditor from './MenuFlowEditor';
import { saveFlow } from '../api';
import {
    InformationCircleIcon,
    ExclamationIcon,
    CheckCircleIcon,
} from '@heroicons/react/outline';

interface MenuFlowAppProps {
    initialData?: Record<string, any>;
}

// Dados padrão para inicialização
const DEFAULT_MENU_DATA = {
    greetings: {
        welcome: 'Hello, {name}! Welcome to our service!',
        returning_user: 'Good to see you again, {name}!',
    },
    menus: {
        initial: {
            title: 'Main Menu',
            content: 'Welcome to our service. How can we help you today?',
            options: {
                menu_type: 'button',
                buttons: [
                    {
                        id: 'info',
                        title: 'Information',
                        next_menu: 'info_menu',
                    },
                    {
                        id: 'support',
                        title: 'Support',
                        next_menu: 'support_menu',
                    },
                ],
            },
        },
        info_menu: {
            title: 'Information',
            content: "Here's some information about our services.",
            options: {
                menu_type: 'button',
                buttons: [
                    {
                        id: 'back',
                        title: 'Back to Main Menu',
                        next_menu: 'initial',
                    },
                ],
            },
        },
        support_menu: {
            title: 'Support',
            content: 'How can we help you?',
            options: {
                menu_type: 'button',
                buttons: [
                    {
                        id: 'back',
                        title: 'Back to Main Menu',
                        next_menu: 'initial',
                    },
                ],
            },
        },
    },
};

// Interface para status de operações
interface OperationStatus {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const MenuFlowApp: React.FC<MenuFlowAppProps> = ({ initialData }) => {
    // Estado principal do menu - agora com garantia de dados iniciais
    const [menuData, setMenuData] = useState<Record<string, any>>(
        initialData || DEFAULT_MENU_DATA
    );

    // Estado para mostrar informação de carregamento
    const [isLoading, setIsLoading] = useState(true);

    // Estado para controle de operações
    const [saveStatus, setSaveStatus] = useState<OperationStatus>({
        loading: false,
        success: false,
        error: null,
    });

    // Estado para mensagens temporárias
    const [flashMessage, setFlashMessage] = useState<{
        type: 'success' | 'error' | 'info' | null;
        message: string;
    } | null>(null);

    // Função para mostrar mensagem temporária
    const showFlashMessage = useCallback(
        (type: 'success' | 'error' | 'info', message: string) => {
            setFlashMessage({ type, message });

            // Auto-limpar mensagem após 5 segundos
            setTimeout(() => {
                setFlashMessage(null);
            }, 5000);
        },
        []
    );

    // Carregar dados do localStorage ao iniciar
    useEffect(() => {
        const loadSavedData = async () => {
            setIsLoading(true);
            try {
                // Verificar se há dados salvos no localStorage
                const savedData = localStorage.getItem('menuFlowData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    // Verificar se o objeto parsed tem a estrutura mínima necessária
                    if (
                        parsedData &&
                        parsedData.menus &&
                        Object.keys(parsedData.menus).length > 0
                    ) {
                        setMenuData(parsedData);
                        showFlashMessage(
                            'info',
                            'Dados salvos anteriormente foram carregados'
                        );
                    } else {
                        console.warn(
                            'Dados salvos eram inválidos ou vazios, usando padrão'
                        );
                        showFlashMessage('info', 'Usando configuração padrão');
                    }
                } else {
                    console.log('Nenhum dado salvo encontrado, usando padrão');
                }
            } catch (error) {
                console.error('Failed to parse saved data:', error);
                showFlashMessage(
                    'error',
                    'Erro ao carregar dados salvos anteriormente'
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedData();
    }, [showFlashMessage]);

    // Função para salvar os dados
    const handleSave = async (updatedData: Record<string, any>) => {
        // Verificar se os dados são válidos
        if (
            !updatedData ||
            !updatedData.menus ||
            Object.keys(updatedData.menus).length === 0
        ) {
            showFlashMessage('error', 'Dados inválidos para salvar');
            return;
        }

        // Atualizar estado para indicar que está salvando
        setSaveStatus({
            loading: true,
            success: false,
            error: null,
        });

        try {
            // Atualizar o estado de dados local primeiro
            setMenuData(updatedData);

            // Salvar localmente para persistência em caso de reload
            try {
                localStorage.setItem(
                    'menuFlowData',
                    JSON.stringify(updatedData)
                );
                console.log('MenuFlowApp - Dados salvos no localStorage');
            } catch (localStorageError) {
                console.error(
                    'MenuFlowApp - Erro ao salvar no localStorage:',
                    localStorageError
                );
            }

            // Verificar se estamos usando ngrok ou em desenvolvimento
            const isLocalDev =
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';

            if (isLocalDev) {
                console.log(
                    'MenuFlowApp - Ambiente de desenvolvimento local detectado, simulando resposta de sucesso'
                );

                // Simular um pequeno atraso para dar feedback visual
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Atualizar status após "salvar" com sucesso
                setSaveStatus({
                    loading: false,
                    success: true,
                    error: null,
                });

                showFlashMessage(
                    'success',
                    'Fluxo de menu salvo localmente com sucesso!'
                );
                return;
            }

            // Salvar no servidor através da API (incluindo ngrok)
            try {
                await saveFlow(updatedData);

                // Atualizar status após salvar com sucesso
                setSaveStatus({
                    loading: false,
                    success: true,
                    error: null,
                });

                showFlashMessage('success', 'Fluxo de menu salvo com sucesso!');
                console.log('Saved menu flow data:', updatedData);
            } catch (apiError) {
                console.error('Error saving flow data to API:', apiError);

                // Mostrar mensagem informativa, já que os dados foram salvos localmente
                showFlashMessage(
                    'error',
                    'Falha ao salvar dados no servidor. Verifique sua conexão.'
                );

                // Atualizar status com erro
                setSaveStatus({
                    loading: false,
                    success: false,
                    error: 'Falha ao conectar com o servidor. As alterações NÃO foram salvas.',
                });
            }
        } catch (error) {
            console.error('Error in handleSave:', error);

            // Atualizar status com erro
            setSaveStatus({
                loading: false,
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Erro desconhecido ao salvar',
            });

            showFlashMessage('error', 'Falha ao salvar os dados');
        }
    };

    // Função para adicionar um novo menu
    const handleAddMenu = useCallback(
        (menuId: string, menuType: string = 'button') => {
            // Verificar se o ID já existe
            if (menuData.menus && menuData.menus[menuId]) {
                showFlashMessage(
                    'error',
                    `Menu com ID "${menuId}" já existe. Escolha outro ID.`
                );
                return;
            }

            // Create a new menu with the given ID
            const newMenu = {
                title:
                    menuId.charAt(0).toUpperCase() +
                    menuId.slice(1).replace(/_/g, ' '),
                content: `Content for ${menuId}`,
                options: {
                    menu_type: menuType,
                    buttons:
                        menuType === 'button'
                            ? [
                                  {
                                      id: 'back',
                                      title: 'Back',
                                      next_menu: 'initial',
                                  },
                              ]
                            : [],
                    sections:
                        menuType === 'list'
                            ? [
                                  {
                                      title: 'Options',
                                      rows: [
                                          {
                                              id: 'back',
                                              title: 'Back',
                                          },
                                      ],
                                  },
                              ]
                            : [],
                },
            };

            // Add the new menu to the data
            setMenuData((prev) => ({
                ...prev,
                menus: {
                    ...prev.menus,
                    [menuId]: newMenu,
                },
            }));

            showFlashMessage(
                'success',
                `Novo menu "${menuId}" adicionado com sucesso`
            );
        },
        [menuData.menus, showFlashMessage]
    );

    // Função para deletar um menu
    const handleDeleteMenu = useCallback(
        (menuId: string) => {
            // Verificar se o menu existe
            if (!menuData.menus || !menuData.menus[menuId]) {
                showFlashMessage('error', `Menu "${menuId}" não encontrado.`);
                return;
            }

            // Verificar se é o menu inicial (que não deve ser removido)
            if (menuId === 'initial') {
                showFlashMessage(
                    'error',
                    'O menu inicial não pode ser excluído.'
                );
                return;
            }

            // Criar uma cópia do estado atual
            const updatedMenuData = { ...menuData };

            // Nome do menu para exibição
            const menuName = updatedMenuData.menus[menuId].title || menuId;

            // Remover o menu do objeto de menus
            delete updatedMenuData.menus[menuId];

            // Verificar e remover referências para este menu em botões de outros menus
            Object.entries(updatedMenuData.menus).forEach(
                ([otherId, menuContent]: [string, any]) => {
                    // Verificar se tem botões com referência para o menu excluído
                    if (menuContent.options?.buttons) {
                        // Remover referências nos botões
                        menuContent.options.buttons =
                            menuContent.options.buttons.filter(
                                (button: any) => button.next_menu !== menuId
                            );
                    }
                }
            );

            // Atualizar o estado
            setMenuData(updatedMenuData);

            // Salvar localmente para persistência
            localStorage.setItem(
                'menuFlowData',
                JSON.stringify(updatedMenuData)
            );

            // Notificar o usuário
            showFlashMessage(
                'info',
                `Menu "${menuName}" excluído com sucesso.`
            );
        },
        [menuData, showFlashMessage]
    );

    // Função para importar JSON
    const handleImportJson = useCallback(
        (jsonData: any) => {
            if (jsonData && typeof jsonData === 'object') {
                // Validar se o objeto possui a estrutura necessária
                if (!jsonData.menus || typeof jsonData.menus !== 'object') {
                    showFlashMessage(
                        'error',
                        'JSON inválido: faltando objeto "menus"'
                    );
                    return;
                }

                try {
                    // Contar o número de menus para feedback
                    const menuCount = Object.keys(jsonData.menus).length;

                    // Atualizar o estado com os dados importados
                    setMenuData(jsonData);

                    // Salvar no localStorage para persistência
                    localStorage.setItem(
                        'menuFlowData',
                        JSON.stringify(jsonData)
                    );

                    showFlashMessage(
                        'success',
                        `Importado com sucesso! ${menuCount} menus carregados.`
                    );
                    console.log('Imported menu flow data:', jsonData);
                } catch (error) {
                    console.error('Error importing JSON:', error);
                    showFlashMessage(
                        'error',
                        'Erro ao processar o JSON importado'
                    );
                }
            } else {
                showFlashMessage('error', 'JSON inválido: formato incorreto');
            }
        },
        [showFlashMessage]
    );

    // Função para exportar para JSON
    const handleExportJson = useCallback(() => {
        try {
            // Criar uma string JSON formatada
            const jsonString = JSON.stringify(menuData, null, 2);

            // Criar um Blob para download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            // Criar um link e disparar o download
            const a = document.createElement('a');
            const timestamp = new Date()
                .toISOString()
                .replace(/[:.]/g, '-')
                .slice(0, 19);
            a.href = url;
            a.download = `menu-flow-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();

            // Limpar recursos
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Número de menus para feedback
            const menuCount = Object.keys(menuData.menus || {}).length;
            showFlashMessage(
                'success',
                `Exportado com sucesso! ${menuCount} menus incluídos.`
            );
        } catch (error) {
            console.error('Error exporting JSON:', error);
            showFlashMessage('error', 'Erro ao exportar o JSON');
        }
    }, [menuData, showFlashMessage]);

    // Exibir tela de carregamento enquanto inicializa
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="spinner w-12 h-12"></div>
                    <p className="text-lg text-gray-600">
                        Carregando fluxo de menu...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Mensagem Flash */}
            {flashMessage && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn
                    ${
                        flashMessage.type === 'success'
                            ? 'bg-green-500'
                            : flashMessage.type === 'error'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                    } 
                    text-white px-4 py-2 rounded-lg shadow-lg flex items-center`}
                >
                    {flashMessage.type === 'success' && (
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                    )}
                    {flashMessage.type === 'error' && (
                        <ExclamationIcon className="h-5 w-5 mr-2" />
                    )}
                    {flashMessage.type === 'info' && (
                        <InformationCircleIcon className="h-5 w-5 mr-2" />
                    )}
                    <span>{flashMessage.message}</span>
                    <button
                        className="ml-4 text-white hover:text-gray-200"
                        onClick={() => setFlashMessage(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            <MenuFlowEditor
                menuData={menuData}
                onSave={handleSave}
                onAddMenu={handleAddMenu}
                onDeleteMenu={handleDeleteMenu}
                onImportJson={handleImportJson}
                onExportJson={handleExportJson}
                isSaving={saveStatus.loading}
            />
        </div>
    );
};

export default MenuFlowApp;
