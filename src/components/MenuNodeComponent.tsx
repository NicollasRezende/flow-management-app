import React, { memo, ReactNode } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import {
    ChatAlt2Icon,
    CollectionIcon,
    DocumentTextIcon,
    LocationMarkerIcon,
    PhotographIcon,
    LinkIcon,
    PhoneIcon,
    DotsHorizontalIcon,
    TrashIcon,
} from '@heroicons/react/outline';

interface MenuNodeData {
    menuId: string;
    title: string;
    content: string;
    menuType: 'button' | 'list' | string;
    options: any;
    formType?: string;
    extraActions?: any[];
    onEdit: () => void;
    onDelete?: (id: string) => void; // Nova prop para deleção
}

const MenuNodeComponent: React.FC<NodeProps<MenuNodeData>> = ({
    data,
    isConnectable,
    selected,
}) => {
    const {
        menuId,
        title,
        menuType,
        formType,
        extraActions = [],
        onEdit,
        onDelete,
    } = data;

    // Determine node color based on menu type
    let nodeClass = 'node-default';

    switch (menuType) {
        case 'button':
            nodeClass = 'node-button';
            break;
        case 'list':
            nodeClass = 'node-list';
            break;
        default:
            nodeClass = 'node-default';
    }

    // Badge style based on menu type
    let badgeClass = 'menu-badge menu-badge-button';

    if (menuType === 'list') {
        badgeClass = 'menu-badge menu-badge-list';
    }

    // Count number of buttons or list items
    const optionsCount =
        data.options?.buttons?.length ||
        data.options?.sections?.reduce(
            (acc: number, section: any) => acc + (section.rows?.length || 0),
            0
        ) ||
        0;

    // Detect if node has form
    const hasForm = !!formType;

    // Count extra actions
    const actionIcons: ReactNode[] = [];

    if (extraActions.length > 0) {
        extraActions.forEach((action, index) => {
            if (action.type === 'location') {
                actionIcons.push(
                    <LocationMarkerIcon
                        key={`loc-${index}`}
                        className="h-4 w-4 text-red-500"
                        aria-label="Localização"
                    />
                );
            } else if (action.type === 'image') {
                actionIcons.push(
                    <PhotographIcon
                        key={`img-${index}`}
                        className="h-4 w-4 text-purple-500"
                        aria-label="Imagem"
                    />
                );
            } else if (action.type === 'link') {
                actionIcons.push(
                    <LinkIcon
                        key={`link-${index}`}
                        className="h-4 w-4 text-blue-500"
                        aria-label="Link"
                    />
                );
            } else if (action.type === 'message') {
                actionIcons.push(
                    <ChatAlt2Icon
                        key={`msg-${index}`}
                        className="h-4 w-4 text-gray-500"
                        aria-label="Mensagem Adicional"
                    />
                );
            } else if (action.type === 'contact') {
                actionIcons.push(
                    <PhoneIcon
                        key={`contact-${index}`}
                        className="h-4 w-4 text-green-500"
                        aria-label="Contato"
                    />
                );
            }
        });
    }

    // Manipulador para deletar menu
    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation(); // Evita que o clique propague e abra o editor

        if (onDelete && menuId !== 'initial') {
            // Impedir deleção do menu inicial
            // Confirmar antes de deletar
            if (
                window.confirm(
                    `Tem certeza que deseja excluir o menu "${title}"?`
                )
            ) {
                onDelete(menuId);
            }
        } else if (menuId === 'initial') {
            alert('O menu inicial não pode ser excluído.');
        }
    };

    return (
        <div
            className={`px-4 py-3 rounded-lg shadow border-2 ${nodeClass} min-w-[220px] ${
                selected ? 'border-indigo-500 shadow-md' : ''
            }`}
            onClick={onEdit}
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="w-3 h-3"
            />

            <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-800 truncate max-w-[150px]">
                    {title}
                </div>
                <div className="flex items-center space-x-1">
                    <div className={badgeClass}>{menuId}</div>
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="ml-2 p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                            title="Excluir menu"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-2 text-xs text-gray-600 space-y-2">
                <div className="flex items-center space-x-1.5">
                    <CollectionIcon className="h-4 w-4 text-indigo-500" />
                    <span className="font-medium">
                        {menuType === 'button'
                            ? 'Botões'
                            : menuType === 'list'
                            ? 'Lista'
                            : menuType}
                        {optionsCount > 0 && (
                            <span className="ml-1 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                                {optionsCount}
                            </span>
                        )}
                    </span>
                </div>

                {hasForm && (
                    <div className="flex items-center space-x-1.5">
                        <DocumentTextIcon className="h-4 w-4 text-yellow-500" />
                        <span>Formulário: {formType}</span>
                    </div>
                )}

                {actionIcons.length > 0 && (
                    <div className="flex items-center mt-1.5 pt-1.5 border-t border-gray-200">
                        <span className="text-xs text-gray-500 mr-2">
                            Ações:
                        </span>
                        <div className="flex space-x-1.5">
                            {actionIcons.slice(0, 3)}
                            {actionIcons.length > 3 && (
                                <div className="flex items-center justify-center h-4 w-4 bg-gray-200 rounded-full text-xs text-gray-700">
                                    <DotsHorizontalIcon className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="w-3 h-3"
            />
        </div>
    );
};

export default memo(MenuNodeComponent);
