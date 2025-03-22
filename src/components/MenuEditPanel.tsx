import React, { useState, useEffect } from 'react';
import { Node } from 'react-flow-renderer';
import { XIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { MenuButton, MenuAction, MenuSection } from '../types/menu';
import ExtraActionsEditor, { ExtraAction } from './ExtraActionsEditor';

interface MenuEditPanelProps {
    node: Node;
    onUpdate: (menuId: string, data: any) => void;
    onClose: () => void;
}

// Interfaces para tipagem dos objetos de opções
interface ButtonMenuOptions {
    menu_type: 'button';
    buttons: MenuButton[];
}

interface ListMenuOptions {
    menu_type: 'list';
    header: string;
    footer: string;
    button_text: string;
    sections: MenuSection[];
}

type MenuOptions = ButtonMenuOptions | ListMenuOptions;

const MenuEditPanel: React.FC<MenuEditPanelProps> = ({
    node,
    onUpdate,
    onClose,
}) => {
    console.log('MenuEditPanel - Inicializando com node:', node.id);
    console.log(
        'MenuEditPanel - onUpdate é função?',
        typeof onUpdate === 'function'
    );
    console.log(
        'MenuEditPanel - onClose é função?',
        typeof onClose === 'function'
    );

    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        menuType: 'button' | 'list' | string;
        buttons: MenuButton[];
        sections: MenuSection[];
        formType: string;
        extraActions: ExtraAction[];
    }>({
        title: node.data.title || '',
        content: node.data.content || '',
        menuType: node.data.menuType || 'button',
        buttons: node.data.options?.buttons || [],
        sections: node.data.options?.sections || [],
        formType: node.data.formType || '',
        extraActions: node.data.extraActions || [],
    });

    useEffect(() => {
        console.log(
            'MenuEditPanel - useEffect acionado com novo node:',
            node.id
        );
        console.log('MenuEditPanel - dados iniciais:', {
            title: node.data.title,
            menuType: node.data.menuType,
            optionsCount: node.data.options
                ? Object.keys(node.data.options).length
                : 0,
            extraActionsCount: node.data.extraActions
                ? node.data.extraActions.length
                : 0,
        });

        setFormData({
            title: node.data.title || '',
            content: node.data.content || '',
            menuType: node.data.menuType || 'button',
            buttons: node.data.options?.buttons || [],
            sections: node.data.options?.sections || [],
            formType: node.data.formType || '',
            extraActions: node.data.extraActions || [],
        });
    }, [node]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        console.log('MenuEditPanel - handleInputChange:', name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddButton = () => {
        console.log('MenuEditPanel - handleAddButton');

        setFormData((prev) => ({
            ...prev,
            buttons: [
                ...prev.buttons,
                { id: `btn-${Date.now()}`, title: 'Novo Botão', next_menu: '' },
            ],
        }));
    };

    const handleUpdateButton = (
        index: number,
        field: string,
        value: string
    ) => {
        console.log('MenuEditPanel - handleUpdateButton:', index, field, value);

        setFormData((prev) => ({
            ...prev,
            buttons: prev.buttons.map((btn: MenuButton, i: number) =>
                i === index ? { ...btn, [field]: value } : btn
            ),
        }));
    };

    const handleRemoveButton = (index: number) => {
        console.log('MenuEditPanel - handleRemoveButton:', index);

        setFormData((prev) => ({
            ...prev,
            buttons: prev.buttons.filter(
                (_: MenuButton, i: number) => i !== index
            ),
        }));
    };

    const handleUpdateExtraActions = (extraActions: ExtraAction[]) => {
        console.log(
            'MenuEditPanel - handleUpdateExtraActions:',
            extraActions.length,
            'ações'
        );

        setFormData((prev) => ({
            ...prev,
            extraActions,
        }));
    };

    const handleSave = () => {
        console.log('MenuEditPanel - handleSave iniciado');

        // Verificar se onUpdate é uma função
        if (typeof onUpdate !== 'function') {
            console.error(
                'MenuEditPanel - ERRO: onUpdate não é uma função:',
                onUpdate
            );
            alert('Erro: A função de atualização não está disponível');
            return;
        }

        try {
            console.log('MenuEditPanel - Construindo objeto de opções');

            // Construct options based on menu type
            let options: MenuOptions;

            if (formData.menuType === 'button') {
                console.log(
                    'MenuEditPanel - Tipo de menu: button, com',
                    formData.buttons.length,
                    'botões'
                );
                options = {
                    menu_type: 'button',
                    buttons: formData.buttons,
                };
            } else if (formData.menuType === 'list') {
                console.log(
                    'MenuEditPanel - Tipo de menu: list, com',
                    formData.sections.length,
                    'seções'
                );
                options = {
                    menu_type: 'list',
                    header: 'Menu',
                    footer: 'Escolha uma opção:',
                    button_text: 'Clique aqui',
                    sections:
                        formData.sections.length > 0
                            ? formData.sections
                            : [
                                  {
                                      title: 'Opções de serviço',
                                      rows: [],
                                  },
                              ],
                };
            } else {
                console.log(
                    'MenuEditPanel - Tipo de menu não reconhecido:',
                    formData.menuType
                );
                // Fallback para menu de tipo botão se o tipo não for reconhecido
                options = {
                    menu_type: 'button',
                    buttons: formData.buttons,
                };
            }

            console.log('MenuEditPanel - Opções criadas:', {
                tipo: options.menu_type,
                // outras propriedades específicas podem ser acessadas com type guard
                botoes:
                    options.menu_type === 'button'
                        ? options.buttons.length
                        : 'N/A',
                secoes:
                    options.menu_type === 'list'
                        ? options.sections.length
                        : 'N/A',
            });

            // Construct form data if applicable
            const form = formData.formType
                ? {
                      type: formData.formType,
                      submit_text: 'Enviar',
                      action: 'submit_form',
                  }
                : undefined;

            console.log('MenuEditPanel - Preparando dados para atualização:', {
                title: formData.title,
                menuType: formData.menuType,
                optionsType: options.menu_type,
                formType: formData.formType ? 'presente' : 'ausente',
                extraActionsCount: formData.extraActions.length,
            });

            // Reúne todos os dados em um objeto
            const updateData = {
                title: formData.title,
                content: formData.content,
                menuType: formData.menuType,
                options,
                formType: formData.formType,
                extraActions: formData.extraActions,
            };

            console.log(
                'MenuEditPanel - Chamando onUpdate para node:',
                node.id
            );

            // Chamar onUpdate dentro de um try/catch para capturar erros
            try {
                onUpdate(node.id, updateData);
                console.log('MenuEditPanel - onUpdate executado com sucesso');
            } catch (error) {
                console.error(
                    'MenuEditPanel - Erro ao executar onUpdate:',
                    error
                );
                alert(
                    'Erro ao atualizar o menu. Por favor, verifique o console para detalhes.'
                );
            }
        } catch (error) {
            console.error(
                'MenuEditPanel - Erro ao processar dados para salvar:',
                error
            );
            alert(
                'Erro ao processar dados para salvar. Por favor, verifique o console para detalhes.'
            );
        }
    };

    const handleClosePanel = (e: React.MouseEvent) => {
        console.log('MenuEditPanel - handleClosePanel');
        e.stopPropagation(); // Impede que o clique se propague

        if (typeof onClose !== 'function') {
            console.error('MenuEditPanel - ERRO: onClose não é uma função');
            return;
        }

        try {
            onClose();
            console.log('MenuEditPanel - Painel fechado com sucesso');
        } catch (error) {
            console.error('MenuEditPanel - Erro ao fechar painel:', error);
        }
    };

    return (
        <div className="h-full bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Editar Menu: {node.id}</h3>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 p-1"
                    onClick={handleClosePanel}
                >
                    <XIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto">
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Título do Menu
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Conteúdo
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={5}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Menu Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Menu
                        </label>
                        <select
                            name="menuType"
                            value={formData.menuType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="button">Menu de Botões</option>
                            <option value="list">Menu de Lista</option>
                        </select>
                    </div>

                    {/* Buttons (for button menu) */}
                    {formData.menuType === 'button' && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Botões
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddButton}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>

                            {formData.buttons.map((button, index) => (
                                <div
                                    key={`btn-${index}`}
                                    className="flex items-center space-x-2 mt-2 p-2 border rounded"
                                >
                                    <div className="flex-grow space-y-2">
                                        <input
                                            type="text"
                                            value={button.title}
                                            onChange={(e) =>
                                                handleUpdateButton(
                                                    index,
                                                    'title',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Texto do Botão"
                                            className="block w-full text-sm border-gray-300 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={button.next_menu || ''}
                                            onChange={(e) =>
                                                handleUpdateButton(
                                                    index,
                                                    'next_menu',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="ID do Próximo Menu"
                                            className="block w-full text-sm border-gray-300 rounded"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveButton(index)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Formulário (opcional)
                        </label>
                        <select
                            name="formType"
                            value={formData.formType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Sem Formulário</option>
                            <option value="free_text">
                                Entrada de Texto Livre
                            </option>
                            <option value="structured">
                                Formulário Estruturado
                            </option>
                        </select>

                        {formData.formType === 'free_text' && (
                            <div className="mt-2 p-3 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">
                                    Este menu aguardará uma resposta de texto
                                    livre do usuário antes de prosseguir.
                                </p>
                            </div>
                        )}

                        {formData.formType === 'structured' && (
                            <div className="mt-2 p-3 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">
                                    Este menu apresentará um formulário
                                    estruturado para o usuário preencher.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Extra Actions - Usando o componente ExtraActionsEditor */}
                    <div className="mt-4 border-t pt-4">
                        <ExtraActionsEditor
                            actions={formData.extraActions}
                            onChange={handleUpdateExtraActions}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 flex space-x-3">
                <button
                    type="button"
                    onClick={handleClosePanel}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    data-testid="edit-panel-save-button"
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default MenuEditPanel;
