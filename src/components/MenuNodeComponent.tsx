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
    MailIcon,
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
}

const MenuNodeComponent: React.FC<NodeProps<MenuNodeData>> = ({
    data,
    isConnectable,
}) => {
    const {
        menuId,
        title,
        menuType,
        formType,
        extraActions = [],
        onEdit,
    } = data;

    // Determine node color based on menu type
    let bgColor = 'bg-white';
    let borderColor = 'border-gray-200';

    switch (menuType) {
        case 'button':
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-200';
            break;
        case 'list':
            bgColor = 'bg-green-50';
            borderColor = 'border-green-200';
            break;
        default:
            bgColor = 'bg-gray-50';
            borderColor = 'border-gray-200';
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

    return (
        <div
            className={`px-4 py-3 rounded-lg shadow border-2 ${bgColor} ${borderColor} min-w-[200px]`}
            onClick={onEdit}
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="w-3 h-3"
            />

            <div className="flex items-center justify-between">
                <div className="font-medium text-gray-800 truncate max-w-[150px]">
                    {title}
                </div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {menuId}
                </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                    <CollectionIcon className="h-4 w-4" />
                    <span>
                        {menuType === 'button'
                            ? 'Botões'
                            : menuType === 'list'
                            ? 'Lista'
                            : menuType}
                        {optionsCount > 0 && ` (${optionsCount})`}
                    </span>
                </div>

                {hasForm && (
                    <div className="mt-1">
                        <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                        <span>Formulário: {formType}</span>
                    </div>
                )}

                {actionIcons.length > 0 && (
                    <div className="mt-1 flex items-center space-x-1">
                        <span className="mr-1">Ações:</span>
                        {actionIcons.slice(0, 3)}
                        {actionIcons.length > 3 && (
                            <span className="text-xs text-gray-500">
                                +{actionIcons.length - 3}
                            </span>
                        )}
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
