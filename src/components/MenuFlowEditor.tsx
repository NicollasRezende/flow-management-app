import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Connection,
    addEdge,
    useNodesState,
    useEdgesState,
    NodeTypes,
    ConnectionLineType,
} from 'react-flow-renderer';
import { MenuNode } from '../types/menu';
import MenuNodeComponent from './MenuNodeComponent';
import MenuEditPanel from './MenuEditPanel';
import MenuToolbar from './MenuToolbar';

// Define node types
const nodeTypes: NodeTypes = {
    menuNode: MenuNodeComponent,
};

interface MenuFlowEditorProps {
    menuData: Record<string, any>;
    onSave: (data: Record<string, any>) => void;
    onAddMenu?: (menuId: string, menuType: string) => void;
    onDeleteMenu?: (menuId: string) => void; // Nova propriedade para deleção de menus
    onImportJson?: (jsonData: any) => void;
    onExportJson?: () => void;
    isSaving?: boolean;
}

// Tipos de notificação para feedback visual
type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
    type: NotificationType;
    message: string;
    id: number;
}

const MenuFlowEditor: React.FC<MenuFlowEditorProps> = ({
    menuData,
    onSave,
    onAddMenu,
    onDeleteMenu,
    onImportJson,
    onExportJson,
    isSaving: externalIsSaving = false,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [menuContentChanged, setMenuContentChanged] =
        useState<boolean>(false);
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [internalIsSaving, setInternalIsSaving] = useState(false);

    // Combinamos o estado de salvamento externo (passado via props) com o interno
    const effectivelySaving = externalIsSaving || internalIsSaving;

    // Estado para notificações
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationIdCounter, setNotificationIdCounter] = useState(1);

    // Função para adicionar notificação
    const addNotification = useCallback(
        (type: NotificationType, message: string) => {
            const id = notificationIdCounter;
            setNotificationIdCounter((prev) => prev + 1);

            const newNotification = { type, message, id };
            setNotifications((prev) => [...prev, newNotification]);

            // Remover notificação após 5 segundos
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 5000);
        },
        [notificationIdCounter]
    );

    // Função para deletar um menu
    const handleDeleteMenu = useCallback(
        (menuId: string) => {
            console.log('MenuFlowEditor - handleDeleteMenu:', menuId);

            // Se o menu estiver selecionado, limpar a seleção
            if (selectedNode && selectedNode.id === menuId) {
                setSelectedNode(null);
            }

            // Remover nós e arestas associadas
            setNodes((nds) => nds.filter((node) => node.id !== menuId));
            setEdges((eds) =>
                eds.filter(
                    (edge) => edge.source !== menuId && edge.target !== menuId
                )
            );

            // Marcar como alterado para salvar
            setMenuContentChanged(true);

            // Notificar o usuário
            addNotification('info', `Menu "${menuId}" excluído`);

            // Se houver callback externo para deleção, chamá-lo
            if (onDeleteMenu) {
                onDeleteMenu(menuId);
            }
        },
        [selectedNode, setNodes, setEdges, addNotification, onDeleteMenu]
    );

    // Convert menu data to ReactFlow nodes
    useEffect(() => {
        if (!menuData || !menuData.menus) {
            console.warn(
                'MenuFlowEditor - menuData ou menuData.menus está vazio:',
                menuData
            );
            return;
        }

        console.log('MenuFlowEditor - Convertendo menuData para nodes e edges');

        const menuNodes: Node[] = [];
        const menuEdges: Edge[] = [];
        const processedMenus = new Set();
        const positions: Record<string, { x: number; y: number }> = {};

        // Calculate initial positions in a grid layout
        let col = 0;
        let row = 0;
        const COL_WIDTH = 300;
        const ROW_HEIGHT = 250;
        const COLS_PER_ROW = 5;

        Object.entries(menuData.menus).forEach(
            ([menuId, menuContent]: [string, any]) => {
                // Create positions for each menu
                positions[menuId] = {
                    x: (col % COLS_PER_ROW) * COL_WIDTH + 50,
                    y: Math.floor(col / COLS_PER_ROW) * ROW_HEIGHT + 50,
                };
                col++;

                // Create node
                menuNodes.push({
                    id: menuId,
                    type: 'menuNode',
                    data: {
                        menuId,
                        title: menuContent.title || menuId,
                        content: menuContent.content || '',
                        options: menuContent.options || {},
                        menuType: menuContent.options?.menu_type || 'button',
                        formType: menuContent.form?.type,
                        extraActions: menuContent.extra_actions || [],
                        onEdit: () =>
                            setSelectedNode(
                                menuNodes.find((n) => n.id === menuId) || null
                            ),
                        onDelete: handleDeleteMenu, // Adicionamos a função de deleção aqui
                    },
                    position: positions[menuId],
                });

                processedMenus.add(menuId);
            }
        );

        // Create edges for connections between nodes
        Object.entries(menuData.menus).forEach(
            ([menuId, menuContent]: [string, any]) => {
                const options = menuContent.options;

                if (options && options.buttons) {
                    options.buttons.forEach((button: any) => {
                        if (
                            button.next_menu &&
                            processedMenus.has(button.next_menu)
                        ) {
                            menuEdges.push({
                                id: `${menuId}-to-${button.next_menu}`,
                                source: menuId,
                                target: button.next_menu,
                                label: button.title,
                                type: 'default',
                                animated: false,
                            });
                        }
                    });
                }

                // Handle list menu options
                if (
                    options &&
                    options.menu_type === 'list' &&
                    options.sections
                ) {
                    options.sections.forEach((section: any) => {
                        if (section.rows) {
                            section.rows.forEach((row: any) => {
                                if (
                                    row.id === 'VOLTAR' &&
                                    menuData.menus[row.title.toLowerCase()]
                                ) {
                                    menuEdges.push({
                                        id: `${menuId}-to-${row.title.toLowerCase()}`,
                                        source: menuId,
                                        target: row.title.toLowerCase(),
                                        label: row.title,
                                        type: 'default',
                                        animated: false,
                                    });
                                }
                            });
                        }
                    });
                }
            }
        );

        console.log(
            'MenuFlowEditor - Criados',
            menuNodes.length,
            'nodes e',
            menuEdges.length,
            'edges'
        );
        setNodes(menuNodes);
        setEdges(menuEdges);
    }, [menuData, handleDeleteMenu]);

    const onConnect = useCallback(
        (params: Connection) => {
            console.log('MenuFlowEditor - Conexão criada:', params);
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        animated: true,
                        type: 'smoothstep',
                        style: { stroke: '#4f46e5', strokeWidth: 2 },
                    },
                    eds
                )
            );
            setMenuContentChanged(true); // Marcar como alterado ao adicionar conexão
        },
        [setEdges]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        console.log('MenuFlowEditor - Node clicado:', node.id);
        event.stopPropagation(); // Impede que o evento propague para o ReactFlow
        setSelectedNode(node);
    }, []);

    const handleUpdateMenu = useCallback(
        (menuId: string, updatedData: any) => {
            console.log('MenuFlowEditor - Atualizando menu:', menuId);

            // Update node in the flow
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === menuId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                ...updatedData,
                                onDelete: handleDeleteMenu, // Garantir que a função de deleção seja mantida
                            },
                        };
                    }
                    return node;
                })
            );

            // Mark as changed so we know to update the overall menu data
            setMenuContentChanged(true);

            // Mostrar notificação de atualização bem-sucedida
            addNotification(
                'info',
                `Menu "${menuId}" atualizado, clique em Salvar para aplicar as mudanças`
            );

            console.log(
                'MenuFlowEditor - Menu atualizado, menuContentChanged =',
                true
            );
        },
        [setNodes, addNotification, handleDeleteMenu]
    );

    const handleSaveMenuData = useCallback(() => {
        console.log('MenuFlowEditor - handleSaveMenuData chamado');
        console.log(
            'MenuFlowEditor - menuContentChanged =',
            menuContentChanged
        );

        // Evitar múltiplos salvamentos simultâneos
        if (effectivelySaving) {
            console.log(
                'MenuFlowEditor - Salvamento já em andamento, ignorando chamada'
            );
            addNotification('info', 'Salvamento em andamento, aguarde...');
            return;
        }

        try {
            setInternalIsSaving(true);
            addNotification('info', 'Salvando alterações...');
            console.log('MenuFlowEditor - Preparando dados para salvar');

            // Criar um novo objeto de dados (para não modificar o original)
            const updatedMenuData = { ...menuData };

            // Resetar o objeto de menus para conter apenas os menus que existem nos nós
            updatedMenuData.menus = {};

            // Update the menu data with changes from nodes - agora só inclui os menus existentes
            nodes.forEach((node) => {
                updatedMenuData.menus[node.id] = {
                    title: node.data.title,
                    content: node.data.content,
                    options: node.data.options,
                    form: node.data.formType
                        ? {
                              type: node.data.formType,
                              submit_text: 'Enviar',
                              action: 'submit_form',
                          }
                        : undefined,
                    extra_actions: node.data.extraActions,
                };
            });

            // Update connections in the menu data
            edges.forEach((edge) => {
                const sourceMenu = updatedMenuData.menus[edge.source];
                if (sourceMenu && sourceMenu.options) {
                    // Handle button menus
                    if (
                        sourceMenu.options.menu_type === 'button' &&
                        sourceMenu.options.buttons
                    ) {
                        // Find button that points to this target
                        const buttonIndex =
                            sourceMenu.options.buttons.findIndex(
                                (btn: any) => btn.next_menu === edge.target
                            );

                        if (buttonIndex === -1) {
                            // Add new button if none exists
                            sourceMenu.options.buttons.push({
                                id: `btn-${Date.now()}`,
                                title: edge.label || 'Navigate',
                                next_menu: edge.target,
                            });
                        }
                    }

                    // Handle list menus - more complex, would need more detailed implementation
                }
            });

            console.log(
                'MenuFlowEditor - Chamando onSave com dados atualizados'
            );

            // Verificar onSave antes de chamar
            if (typeof onSave !== 'function') {
                console.error(
                    'MenuFlowEditor - ERRO: onSave não é uma função:',
                    onSave
                );
                addNotification(
                    'error',
                    'Erro ao salvar: função de salvamento não está disponível'
                );
                setInternalIsSaving(false);
                return;
            }

            // Chamar onSave com try/catch para capturar erros
            try {
                onSave(updatedMenuData);
                console.log('MenuFlowEditor - onSave executado com sucesso');
                setMenuContentChanged(false);
                addNotification('success', 'Alterações salvas com sucesso!');
            } catch (error) {
                console.error(
                    'MenuFlowEditor - Erro ao executar onSave:',
                    error
                );
                addNotification(
                    'error',
                    `Erro ao salvar: ${
                        (error as Error).message || 'Falha desconhecida'
                    }`
                );
            } finally {
                setInternalIsSaving(false);
            }
        } catch (error) {
            console.error(
                'MenuFlowEditor - Erro ao preparar dados para salvar:',
                error
            );
            addNotification(
                'error',
                `Erro ao preparar dados: ${
                    (error as Error).message || 'Falha desconhecida'
                }`
            );
            setInternalIsSaving(false);
        }
    }, [
        menuData,
        nodes,
        edges,
        menuContentChanged,
        onSave,
        effectivelySaving,
        addNotification,
    ]);

    const handleCloseEditPanel = useCallback(() => {
        setSelectedNode(null);
    }, []);

    const toggleMiniMap = useCallback(() => {
        setShowMiniMap((prev) => !prev);
    }, []);

    const panelWidth = '350px';

    // Detectar alterações nos nodes e edges para marcar como alterado
    useEffect(() => {
        if (nodes.length > 0 || edges.length > 0) {
            console.log('MenuFlowEditor - Detectada alteração em nodes/edges');
            setMenuContentChanged(true);
        }
    }, [nodes, edges]);

    // Componente para renderizar notificações
    const NotificationDisplay = useMemo(() => {
        return () => (
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {notifications.map((notification) => {
                    // Definir classes baseadas no tipo de notificação
                    const notificationClass = `notification notification-${notification.type}`;

                    return (
                        <div
                            key={notification.id}
                            className={notificationClass}
                        >
                            <span className="mr-2">
                                {notification.type === 'success' && '✅'}
                                {notification.type === 'error' && '❌'}
                                {notification.type === 'warning' && '⚠️'}
                                {notification.type === 'info' && 'ℹ️'}
                            </span>
                            <span className="flex-grow">
                                {notification.message}
                            </span>
                            <button
                                onClick={() =>
                                    setNotifications((prev) =>
                                        prev.filter(
                                            (n) => n.id !== notification.id
                                        )
                                    )
                                }
                                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    }, [notifications]);

    return (
        <div className="h-screen flex flex-col">
            {/* Componente de notificações */}
            <NotificationDisplay />

            <MenuToolbar
                onSave={handleSaveMenuData}
                onAddMenu={onAddMenu}
                onImportJson={onImportJson}
                onToggleMiniMap={toggleMiniMap}
                showMiniMap={showMiniMap}
                onExportJson={onExportJson}
                isSaving={effectivelySaving}
            />

            <div className="flex-grow relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    defaultZoom={1}
                    minZoom={0.2}
                    maxZoom={2}
                    snapToGrid={true}
                    snapGrid={[10, 10]}
                    fitView
                >
                    <Background color="#aaa" gap={16} size={1} />
                    <Controls
                        showInteractive={false}
                        className="react-flow__controls"
                    />
                    {showMiniMap && (
                        <div
                            className="absolute bottom-4 right-4"
                            style={{ zIndex: 5 }}
                        >
                            <MiniMap
                                nodeStrokeColor={(n) => {
                                    if (n.type === 'menuNode') return '#4f46e5';
                                    return '#000';
                                }}
                                nodeColor={(n) => {
                                    if (n.type === 'menuNode') {
                                        const type =
                                            n.data?.menuType || 'default';
                                        if (type === 'button') return '#e0e7ff';
                                        if (type === 'list') return '#dcfce7';
                                        return '#f3f4f6';
                                    }
                                    return '#f3f4f6';
                                }}
                                nodeBorderRadius={3}
                            />
                        </div>
                    )}
                </ReactFlow>

                {selectedNode && (
                    <div
                        className="absolute top-0 right-0 h-full bg-white shadow-xl side-panel"
                        style={{
                            width: panelWidth,
                            zIndex: 10,
                        }}
                    >
                        <MenuEditPanel
                            node={selectedNode}
                            onUpdate={handleUpdateMenu}
                            onClose={handleCloseEditPanel}
                            onDelete={
                                selectedNode.id !== 'initial'
                                    ? handleDeleteMenu
                                    : undefined
                            } // Adicionamos a opção de deleção
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuFlowEditor;
