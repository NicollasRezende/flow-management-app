import React, { useState } from 'react';
import { TrashIcon, PlusIcon, PencilIcon } from '@heroicons/react/solid';
import {
    ChatAlt2Icon,
    LocationMarkerIcon,
    PhotographIcon,
    LinkIcon,
    PhoneIcon,
} from '@heroicons/react/outline';

// Tipos de ações extras
export interface ExtraAction {
    type: string;
    [key: string]: any;
}

// Props do componente
interface ExtraActionsEditorProps {
    actions: ExtraAction[];
    onChange: (actions: ExtraAction[]) => void;
}

// Definição dos campos para cada tipo de ação
const actionFields: Record<
    string,
    { label: string; type: string; required: boolean; key?: string }[]
> = {
    message: [
        { label: 'Conteúdo', type: 'textarea', required: true, key: 'content' },
    ],
    contact: [
        { label: 'Nome', type: 'text', required: true, key: 'name' },
        { label: 'Telefone', type: 'text', required: true, key: 'phone' },
    ],
    location: [
        { label: 'Latitude', type: 'text', required: true, key: 'latitude' },
        { label: 'Longitude', type: 'text', required: true, key: 'longitude' },
        { label: 'Nome', type: 'text', required: true, key: 'name' },
        { label: 'Endereço', type: 'text', required: true, key: 'address' },
    ],
    link: [
        { label: 'Título', type: 'text', required: true, key: 'title' },
        { label: 'Mensagem', type: 'textarea', required: true, key: 'message' },
        { label: 'URL', type: 'text', required: true, key: 'url' },
        {
            label: 'Texto do botão',
            type: 'text',
            required: true,
            key: 'button_text',
        },
    ],
    image: [{ label: 'Caminho', type: 'text', required: true, key: 'path' }],
};

// Mapeamento de tipos para nomes amigáveis
const actionTypeNames: Record<string, string> = {
    message: 'Mensagem adicional',
    contact: 'Contato',
    location: 'Localização',
    link: 'Link',
    image: 'Imagem',
};

// Ícones para cada tipo de ação
const actionIcons: Record<string, React.ReactNode> = {
    message: <ChatAlt2Icon className="h-4 w-4 text-gray-500" />,
    contact: <PhoneIcon className="h-4 w-4 text-green-500" />,
    location: <LocationMarkerIcon className="h-4 w-4 text-red-500" />,
    link: <LinkIcon className="h-4 w-4 text-blue-500" />,
    image: <PhotographIcon className="h-4 w-4 text-purple-500" />,
};

const ExtraActionsEditor: React.FC<ExtraActionsEditorProps> = ({
    actions,
    onChange,
}) => {
    const [expanded, setExpanded] = useState<number | null>(null);

    // Adicionar uma nova ação
    const handleAddAction = () => {
        const newAction: ExtraAction = { type: 'message', content: '' };
        onChange([...actions, newAction]);
        setExpanded(actions.length); // Expandir a nova ação
    };

    // Atualizar uma ação existente
    const handleUpdateAction = (index: number, field: string, value: any) => {
        const updatedActions = [...actions];
        updatedActions[index] = { ...updatedActions[index], [field]: value };
        onChange(updatedActions);
    };

    // Remover uma ação
    const handleRemoveAction = (index: number) => {
        const updatedActions = actions.filter((_, i) => i !== index);
        onChange(updatedActions);
        setExpanded(null);
    };

    // Renderizar os campos com base no tipo da ação
    const renderActionFields = (action: ExtraAction, index: number) => {
        const fields = actionFields[action.type] || [];

        return (
            <div className="mt-3 space-y-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                {fields.map((field) => {
                    const fieldKey =
                        field.key ||
                        field.label.toLowerCase().replace(/\s+/g, '_');
                    const fieldValue = action[fieldKey] || '';

                    return (
                        <div key={fieldKey} className="flex flex-col">
                            <label className="form-label">
                                {field.label}
                                {field.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </label>

                            {field.type === 'textarea' ? (
                                <textarea
                                    value={fieldValue}
                                    onChange={(e) =>
                                        handleUpdateAction(
                                            index,
                                            fieldKey,
                                            e.target.value
                                        )
                                    }
                                    className="form-textarea"
                                    rows={3}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    value={fieldValue}
                                    onChange={(e) =>
                                        handleUpdateAction(
                                            index,
                                            fieldKey,
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                    Adicione ações extras como mensagens, imagens, localização,
                    etc.
                </p>
                <button
                    type="button"
                    onClick={handleAddAction}
                    className="btn btn-primary btn-icon"
                >
                    <PlusIcon className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>

            {actions.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                    <p className="text-sm text-gray-500 italic">
                        Nenhuma ação extra configurada. Clique no botão "+" para
                        adicionar.
                    </p>
                </div>
            )}

            <div className="space-y-3">
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-md overflow-hidden transition-all duration-150 hover:shadow-sm"
                    >
                        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                                    {index + 1}
                                </span>
                                <div className="flex items-center space-x-2">
                                    {actionIcons[action.type]}
                                    <span className="font-medium text-gray-700">
                                        {actionTypeNames[action.type] ||
                                            action.type}
                                    </span>
                                </div>

                                <select
                                    value={action.type}
                                    onChange={(e) =>
                                        handleUpdateAction(
                                            index,
                                            'type',
                                            e.target.value
                                        )
                                    }
                                    className="form-select text-sm py-1 ml-2"
                                >
                                    {Object.entries(actionTypeNames).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpanded(
                                            expanded === index ? null : index
                                        )
                                    }
                                    className="btn btn-icon btn-secondary"
                                    title={
                                        expanded === index ? 'Fechar' : 'Editar'
                                    }
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveAction(index)}
                                    className="btn btn-icon btn-danger"
                                    title="Remover"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {expanded === index &&
                            renderActionFields(action, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExtraActionsEditor;
