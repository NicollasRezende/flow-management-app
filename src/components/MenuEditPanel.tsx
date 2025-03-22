import React, { useState, useEffect } from 'react';
import { Node } from 'react-flow-renderer';
import {
    XIcon,
    PlusIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/solid';
import { MenuButton, MenuAction, MenuSection } from '../types/menu';
import ExtraActionsEditor, { ExtraAction } from './ExtraActionsEditor';

interface MenuEditPanelProps {
    node: Node;
    onUpdate: (menuId: string, data: any) => void;
    onClose: () => void;
    onDelete?: (menuId: string) => void; // Nova prop para deleção
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

// Interface para definir quais seções podem ser expandidas
interface ExpandedSections {
    basicInfo: boolean;
    options: boolean;
    form: boolean;
    extraActions: boolean;
    [key: string]: boolean; // Assinatura de índice para permitir acesso dinâmico
}

const MenuEditPanel: React.FC<MenuEditPanelProps> = ({
    node,
    onUpdate,
    onClose,
    onDelete,
}) => {
    console.log('MenuEditPanel - Inicializando com node:', node.id);

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

    // Estado para controlar seções expandidas
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        basicInfo: true,
        options: true,
        form: false,
        extraActions: false,
    });

    // Estado para controlar se o modal de confirmação está aberto
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        console.log(
            'MenuEditPanel - useEffect acionado com novo node:',
            node.id
        );

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

    const toggleSection = (section: keyof ExpandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleDeleteMenu = () => {
        // Abrir modal de confirmação
        setShowDeleteConfirm(true);
    };

    const confirmDeleteMenu = () => {
        console.log('MenuEditPanel - confirmDeleteMenu:', node.id);
        if (onDelete) {
            onDelete(node.id);
            onClose(); // Fechar o painel após a deleção
        }
        setShowDeleteConfirm(false);
    };

    const handleSave = () => {
        console.log('MenuEditPanel - handleSave iniciado');

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

            // Construct form data if applicable
            const form = formData.formType
                ? {
                      type: formData.formType,
                      submit_text: 'Enviar',
                      action: 'submit_form',
                  }
                : undefined;

            // Reúne todos os dados em um objeto
            const updateData = {
                title: formData.title,
                content: formData.content,
                menuType: formData.menuType,
                options,
                formType: formData.formType,
                extraActions: formData.extraActions,
            };

            onUpdate(node.id, updateData);
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
        e.stopPropagation(); // Impede que o clique se propague
        onClose();
    };

    // Modal de confirmação de deleção
    const DeleteConfirmModal = () => {
        if (!showDeleteConfirm) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Confirmar exclusão
                    </h3>
                    <p className="text-gray-700 mb-6">
                        Tem certeza que deseja excluir o menu{' '}
                        <span className="font-semibold">{node.data.title}</span>
                        ? Esta ação não pode ser desfeita e todas as conexões
                        para este menu serão removidas.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={confirmDeleteMenu}
                            className="btn btn-danger"
                        >
                            <TrashIcon className="h-4 w-4 mr-1.5" />
                            Excluir Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full bg-white side-panel flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="inline-block w-2 h-6 bg-indigo-500 rounded mr-2"></span>
                    Editar Menu: {node.id}
                </h3>
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                    onClick={handleClosePanel}
                >
                    <XIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto">
                <div className="p-4 space-y-4">
                    {/* Basic Information Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('basicInfo')}
                        >
                            <h4 className="font-medium text-gray-700">
                                Informações Básicas
                            </h4>
                            {expandedSections.basicInfo ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </div>

                        {expandedSections.basicInfo && (
                            <div className="p-4 space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="form-label">
                                        Título do Menu
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="form-label">
                                        Conteúdo
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="form-textarea"
                                    />
                                </div>

                                {/* Menu Type */}
                                <div>
                                    <label className="form-label">
                                        Tipo de Menu
                                    </label>
                                    <select
                                        name="menuType"
                                        value={formData.menuType}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="button">
                                            Menu de Botões
                                        </option>
                                        <option value="list">
                                            Menu de Lista
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Options Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('options')}
                        >
                            <h4 className="font-medium text-gray-700">
                                Opções de Menu
                            </h4>
                            {expandedSections.options ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </div>

                        {expandedSections.options && (
                            <div className="p-4">
                                {/* Buttons (for button menu) */}
                                {formData.menuType === 'button' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="form-label mb-0">
                                                Botões
                                            </label>
                                            <button
                                                type="button"
                                                onClick={handleAddButton}
                                                className="btn btn-primary btn-icon"
                                            >
                                                <PlusIcon
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>

                                        {formData.buttons.length === 0 && (
                                            <p className="text-sm text-gray-500 italic mb-2">
                                                Sem botões. Clique no botão "+"
                                                para adicionar.
                                            </p>
                                        )}

                                        <div className="space-y-3">
                                            {formData.buttons.map(
                                                (button, index) => (
                                                    <div
                                                        key={`btn-${index}`}
                                                        className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150"
                                                    >
                                                        <div className="flex-grow space-y-3">
                                                            <div>
                                                                <label className="text-xs text-gray-500 mb-1 block">
                                                                    Texto do
                                                                    Botão
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        button.title
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateButton(
                                                                            index,
                                                                            'title',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Texto do Botão"
                                                                    className="form-input"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-500 mb-1 block">
                                                                    Próximo Menu
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        button.next_menu ||
                                                                        ''
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateButton(
                                                                            index,
                                                                            'next_menu',
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="ID do Próximo Menu"
                                                                    className="form-input"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveButton(
                                                                    index
                                                                )
                                                            }
                                                            className="btn btn-icon btn-danger self-start"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {formData.menuType === 'list' && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="form-label mb-0">
                                                Seções da Lista
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        sections: [
                                                            ...prev.sections,
                                                            {
                                                                title: 'Nova Seção',
                                                                rows: [],
                                                            },
                                                        ],
                                                    }));
                                                }}
                                                className="btn btn-primary btn-icon"
                                            >
                                                <PlusIcon
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>

                                        {formData.sections.length === 0 && (
                                            <p className="text-sm text-gray-500 italic mb-2">
                                                Sem seções de lista. Clique no
                                                botão "+" para adicionar.
                                            </p>
                                        )}

                                        <div className="space-y-4">
                                            {formData.sections.map(
                                                (section, sectionIndex) => (
                                                    <div
                                                        key={`section-${sectionIndex}`}
                                                        className="border border-gray-200 rounded-md p-3"
                                                    >
                                                        <div className="mb-3">
                                                            <label className="text-xs text-gray-500 mb-1 block">
                                                                Título da Seção
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    section.title
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newSections =
                                                                        [
                                                                            ...formData.sections,
                                                                        ];
                                                                    newSections[
                                                                        sectionIndex
                                                                    ].title =
                                                                        e.target.value;
                                                                    setFormData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            sections:
                                                                                newSections,
                                                                        })
                                                                    );
                                                                }}
                                                                className="form-input"
                                                            />
                                                        </div>

                                                        <div className="mb-2 flex justify-between items-center">
                                                            <label className="text-xs text-gray-500">
                                                                Itens da Seção
                                                            </label>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newSections =
                                                                            [
                                                                                ...formData.sections,
                                                                            ];
                                                                        newSections[
                                                                            sectionIndex
                                                                        ].rows.push(
                                                                            {
                                                                                id: `row-${Date.now()}`,
                                                                                title: 'Novo Item',
                                                                            }
                                                                        );
                                                                        setFormData(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                sections:
                                                                                    newSections,
                                                                            })
                                                                        );
                                                                    }}
                                                                    className="btn btn-secondary btn-icon btn-sm"
                                                                >
                                                                    <PlusIcon className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newSections =
                                                                            formData.sections.filter(
                                                                                (
                                                                                    _,
                                                                                    i
                                                                                ) =>
                                                                                    i !==
                                                                                    sectionIndex
                                                                            );
                                                                        setFormData(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                sections:
                                                                                    newSections,
                                                                            })
                                                                        );
                                                                    }}
                                                                    className="btn btn-danger btn-icon btn-sm"
                                                                >
                                                                    <TrashIcon className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {section.rows.length ===
                                                        0 ? (
                                                            <p className="text-xs text-gray-500 italic">
                                                                Sem itens nesta
                                                                seção. Adicione
                                                                pelo menos um
                                                                item.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-2 mt-2">
                                                                {section.rows.map(
                                                                    (
                                                                        row,
                                                                        rowIndex
                                                                    ) => (
                                                                        <div
                                                                            key={`row-${sectionIndex}-${rowIndex}`}
                                                                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
                                                                        >
                                                                            <div className="flex-grow">
                                                                                <input
                                                                                    type="text"
                                                                                    value={
                                                                                        row.title
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        const newSections =
                                                                                            [
                                                                                                ...formData.sections,
                                                                                            ];
                                                                                        newSections[
                                                                                            sectionIndex
                                                                                        ].rows[
                                                                                            rowIndex
                                                                                        ].title =
                                                                                            e.target.value;
                                                                                        setFormData(
                                                                                            (
                                                                                                prev
                                                                                            ) => ({
                                                                                                ...prev,
                                                                                                sections:
                                                                                                    newSections,
                                                                                            })
                                                                                        );
                                                                                    }}
                                                                                    className="form-input text-sm py-1"
                                                                                    placeholder="Texto do item"
                                                                                />
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const newSections =
                                                                                        [
                                                                                            ...formData.sections,
                                                                                        ];
                                                                                    newSections[
                                                                                        sectionIndex
                                                                                    ].rows.splice(
                                                                                        rowIndex,
                                                                                        1
                                                                                    );
                                                                                    setFormData(
                                                                                        (
                                                                                            prev
                                                                                        ) => ({
                                                                                            ...prev,
                                                                                            sections:
                                                                                                newSections,
                                                                                        })
                                                                                    );
                                                                                }}
                                                                                className="btn btn-icon btn-danger btn-sm"
                                                                            >
                                                                                <TrashIcon className="h-3 w-3" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('form')}
                        >
                            <h4 className="font-medium text-gray-700">
                                Formulário
                            </h4>
                            {expandedSections.form ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </div>

                        {expandedSections.form && (
                            <div className="p-4">
                                <div>
                                    <label className="form-label">
                                        Tipo de Formulário (opcional)
                                    </label>
                                    <select
                                        name="formType"
                                        value={formData.formType}
                                        onChange={handleInputChange}
                                        className="form-select"
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
                                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                                            <p className="text-sm text-blue-800">
                                                Este menu aguardará uma resposta
                                                de texto livre do usuário antes
                                                de prosseguir.
                                            </p>
                                        </div>
                                    )}

                                    {formData.formType === 'structured' && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                                            <p className="text-sm text-blue-800">
                                                Este menu apresentará um
                                                formulário estruturado para o
                                                usuário preencher.
                                            </p>
                                            <p className="text-xs text-blue-600 mt-2">
                                                A configuração dos campos do
                                                formulário estruturado será
                                                implementada em uma versão
                                                futura.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Extra Actions Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 px-4 py-2 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('extraActions')}
                        >
                            <h4 className="font-medium text-gray-700">
                                Ações Extras
                            </h4>
                            {expandedSections.extraActions ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </div>

                        {expandedSections.extraActions && (
                            <div className="p-4">
                                <ExtraActionsEditor
                                    actions={formData.extraActions}
                                    onChange={handleUpdateExtraActions}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-wrap gap-3">
                    {/* Botão de Deleção */}
                    {onDelete && node.id !== 'initial' && (
                        <button
                            type="button"
                            onClick={handleDeleteMenu}
                            className="btn btn-danger flex-none"
                        >
                            <TrashIcon className="h-4 w-4 mr-1.5" />
                            Excluir Menu
                        </button>
                    )}

                    <div className="flex-grow flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClosePanel}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="btn btn-primary"
                            data-testid="edit-panel-save-button"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmação de exclusão */}
            <DeleteConfirmModal />
        </div>
    );
};

export default MenuEditPanel;
