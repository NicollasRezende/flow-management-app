import React, { useState, useEffect, useCallback } from 'react';
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
    onImportJson?: (jsonData: any) => void;
    onExportJson?: () => void;
}

const MenuFlowEditor: React.FC<MenuFlowEditorProps> = ({
    menuData,
    onSave,
    onAddMenu,
    onImportJson,
    onExportJson,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [menuContentChanged, setMenuContentChanged] =
        useState<boolean>(false);
    const [showMiniMap, setShowMiniMap] = useState(true);

    // Convert menu data to ReactFlow nodes
    useEffect(() => {
        if (!menuData || !menuData.menus) return;

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

        setNodes(menuNodes);
        setEdges(menuEdges);
    }, [menuData]);

    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        event.stopPropagation(); // Impede que o evento propague para o ReactFlow
        setSelectedNode(node);
    }, []);

    const handleUpdateMenu = useCallback(
        (menuId: string, updatedData: any) => {
            // Update node in the flow
            setNodes((nds) =>
                nds.map((node) => {
                    if (node.id === menuId) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                ...updatedData,
                            },
                        };
                    }
                    return node;
                })
            );

            // Mark as changed so we know to update the overall menu data
            setMenuContentChanged(true);
        },
        [setNodes]
    );

    const handleSaveMenuData = useCallback(() => {
        if (!menuContentChanged) return;

        const updatedMenuData = { ...menuData };

        // Update the menu data with changes from nodes
        nodes.forEach((node) => {
            if (node.id in updatedMenuData.menus) {
                updatedMenuData.menus[node.id] = {
                    ...updatedMenuData.menus[node.id],
                    title: node.data.title,
                    content: node.data.content,
                    options: node.data.options,
                    form: node.data.formType
                        ? {
                              type: node.data.formType,
                              // Other form properties would be here
                          }
                        : undefined,
                    extra_actions: node.data.extraActions,
                };
            }
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
                    const buttonIndex = sourceMenu.options.buttons.findIndex(
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

        onSave(updatedMenuData);
        setMenuContentChanged(false);
    }, [menuData, nodes, edges, menuContentChanged, onSave]);

    const handleCloseEditPanel = () => {
        setSelectedNode(null);
    };

    const toggleMiniMap = () => {
        setShowMiniMap(!showMiniMap);
    };

    const panelWidth = '350px';

    return (
        <div className="h-screen flex flex-col">
            <MenuToolbar
                onSave={handleSaveMenuData}
                onAddMenu={onAddMenu}
                onImportJson={onImportJson}
                onToggleMiniMap={toggleMiniMap}
                showMiniMap={showMiniMap}
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
                    connectionLineType={ConnectionLineType.Bezier}
                    fitView
                >
                    <Background />
                    <Controls />
                    {showMiniMap && (
                        <div
                            className="absolute bottom-10 right-10"
                            style={{ zIndex: 5 }}
                        >
                            <MiniMap
                                nodeStrokeColor={(n) => {
                                    if (n.type === 'menuNode') return '#0041d0';
                                    return '#000';
                                }}
                                nodeColor={(n) => {
                                    if (n.type === 'menuNode') {
                                        const type =
                                            n.data?.menuType || 'default';
                                        if (type === 'button') return '#bbdefb';
                                        if (type === 'list') return '#c8e6c9';
                                        return '#e1e1e1';
                                    }
                                    return '#eee';
                                }}
                                style={{
                                    backgroundColor: '#f8f8f8',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                }}
                            />
                        </div>
                    )}
                </ReactFlow>

                {selectedNode && (
                    <div
                        className="absolute top-0 right-0 h-full bg-white shadow-lg overflow-y-auto"
                        style={{
                            width: panelWidth,
                            zIndex: 10,
                        }}
                    >
                        <MenuEditPanel
                            node={selectedNode}
                            onUpdate={handleUpdateMenu}
                            onClose={handleCloseEditPanel}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuFlowEditor;
