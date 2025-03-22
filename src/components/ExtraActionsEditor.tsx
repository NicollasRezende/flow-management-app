import React, { useState } from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/solid';

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
            <div className="mt-2 space-y-3">
                {fields.map((field) => {
                    const fieldKey =
                        field.key ||
                        field.label.toLowerCase().replace(/\s+/g, '_');
                    const fieldValue = action[fieldKey] || '';

                    return (
                        <div key={fieldKey} className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                                {field.required && (
                                    <span className="text-red-500">*</span>
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                <h3 className="text-lg font-medium">Ações Extras</h3>
                <button
                    type="button"
                    onClick={handleAddAction}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {actions.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                    Nenhuma ação extra configurada. Clique no botão "+" para
                    adicionar.
                </p>
            )}

            {actions.map((action, index) => (
                <div
                    key={index}
                    className="border rounded-md p-3 hover:shadow-sm transition"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium">
                                {index + 1}.{' '}
                                {actionTypeNames[action.type] || action.type}
                            </span>

                            <select
                                value={action.type}
                                onChange={(e) =>
                                    handleUpdateAction(
                                        index,
                                        'type',
                                        e.target.value
                                    )
                                }
                                className="ml-2 text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setExpanded(
                                        expanded === index ? null : index
                                    )
                                }
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {expanded === index ? 'Minimizar' : 'Editar'}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRemoveAction(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {expanded === index && renderActionFields(action, index)}
                </div>
            ))}
        </div>
    );
};

export default ExtraActionsEditor;
