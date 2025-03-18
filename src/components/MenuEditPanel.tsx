import React, { useState, useEffect } from 'react';
import { Node } from 'react-flow-renderer';
import { XIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
import { MenuButton, MenuAction, MenuSection } from '../types/menu';

interface MenuEditPanelProps {
    node: Node;
    onUpdate: (menuId: string, data: any) => void;
    onClose: () => void;
}

const MenuEditPanel: React.FC<MenuEditPanelProps> = ({
    node,
    onUpdate,
    onClose,
}) => {
    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        menuType: 'button' | 'list' | string;
        buttons: MenuButton[];
        sections: MenuSection[];
        formType: string;
        extraActions: MenuAction[];
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddButton = () => {
        setFormData((prev) => ({
            ...prev,
            buttons: [
                ...prev.buttons,
                { id: `btn-${Date.now()}`, title: 'New Button', next_menu: '' },
            ],
        }));
    };

    const handleUpdateButton = (
        index: number,
        field: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            buttons: prev.buttons.map((btn: MenuButton, i: number) =>
                i === index ? { ...btn, [field]: value } : btn
            ),
        }));
    };

    const handleRemoveButton = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            buttons: prev.buttons.filter((_: MenuButton, i: number) => i !== index),
        }));
    };

    const handleAddAction = () => {
        setFormData((prev) => ({
            ...prev,
            extraActions: [
                ...prev.extraActions,
                { type: 'message', content: '' } as MenuAction,
            ],
        }));
    };

    const handleUpdateAction = (index: number, field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            extraActions: prev.extraActions.map((action: MenuAction, i: number) =>
                i === index ? { ...action, [field]: value } : action
            ),
        }));
    };

    const handleRemoveAction = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            extraActions: prev.extraActions.filter((_: MenuAction, i: number) => i !== index),
        }));
    };

    const handleSave = () => {
        // Construct options based on menu type
        let options = {};

        if (formData.menuType === 'button') {
            options = {
                menu_type: 'button',
                buttons: formData.buttons,
            };
        } else if (formData.menuType === 'list') {
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
        }

        // Construct form data if applicable
        const form = formData.formType
            ? {
                  type: formData.formType,
                  submit_text: 'Enviar',
                  action: 'submit_form',
              }
            : undefined;

        onUpdate(node.id, {
            title: formData.title,
            content: formData.content,
            menuType: formData.menuType,
            options,
            formType: formData.formType,
            extraActions: formData.extraActions,
        });
        
        // Após salvar, fecha o painel se desejado
        // onClose(); // Descomente se quiser fechar automaticamente após salvar
    };

    const handleClosePanel = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede que o clique se propague
        onClose();
    };

    return (
        <div className="h-full bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Edit Menu: {node.id}</h3>
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
                            Menu Title
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
                            Content
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
                            Menu Type
                        </label>
                        <select
                            name="menuType"
                            value={formData.menuType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="button">Button Menu</option>
                            <option value="list">List Menu</option>
                        </select>
                    </div>

                    {/* Buttons (for button menu) */}
                    {formData.menuType === 'button' && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Buttons
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
                                            placeholder="Button Text"
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
                                            placeholder="Next Menu ID"
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
                            Form Type (optional)
                        </label>
                        <select
                            name="formType"
                            value={formData.formType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">No Form</option>
                            <option value="free_text">Free Text Input</option>
                            <option value="structured">Structured Form</option>
                        </select>
                    </div>

                    {/* Extra Actions */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Extra Actions
                            </label>
                            <button
                                type="button"
                                onClick={handleAddAction}
                                className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        {formData.extraActions.map((action, index) => (
                            <div
                                key={`action-${index}`}
                                className="flex items-center space-x-2 mt-2 p-2 border rounded"
                            >
                                <div className="flex-grow space-y-2">
                                    <select
                                        value={action.type || 'message'}
                                        onChange={(e) =>
                                            handleUpdateAction(
                                                index,
                                                'type',
                                                e.target.value
                                            )
                                        }
                                        className="block w-full text-sm border-gray-300 rounded"
                                    >
                                        <option value="message">Message</option>
                                        <option value="link">Link</option>
                                        <option value="image">Image</option>
                                        <option value="location">
                                            Location
                                        </option>
                                        <option value="contact">Contact</option>
                                    </select>

                                    {action.type === 'message' && (
                                        <textarea
                                            value={action.content || ''}
                                            onChange={(e) =>
                                                handleUpdateAction(
                                                    index,
                                                    'content',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Message content"
                                            rows={2}
                                            className="block w-full text-sm border-gray-300 rounded"
                                        />
                                    )}

                                    {action.type === 'link' && (
                                        <>
                                            <input
                                                type="text"
                                                value={action.title || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'title',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Link title"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={action.url || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'url',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="URL"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={action.button_text || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'button_text',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Button Text"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                        </>
                                    )}

                                    {action.type === 'image' && (
                                        <input
                                            type="text"
                                            value={action.path || ''}
                                            onChange={(e) =>
                                                handleUpdateAction(
                                                    index,
                                                    'path',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Image path"
                                            className="block w-full text-sm border-gray-300 rounded"
                                        />
                                    )}

                                    {action.type === 'location' && (
                                        <>
                                            <input
                                                type="text"
                                                value={action.name || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Location name"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={action.address || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'address',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Address"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={action.latitude || ''}
                                                    onChange={(e) =>
                                                        handleUpdateAction(
                                                            index,
                                                            'latitude',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Latitude"
                                                    className="block w-full text-sm border-gray-300 rounded"
                                                />
                                                <input
                                                    type="text"
                                                    value={action.longitude || ''}
                                                    onChange={(e) =>
                                                        handleUpdateAction(
                                                            index,
                                                            'longitude',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Longitude"
                                                    className="block w-full text-sm border-gray-300 rounded"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {action.type === 'contact' && (
                                        <>
                                            <input
                                                type="text"
                                                value={action.name || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Contact name"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                            <input
                                                type="text"
                                                value={action.phone || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'phone',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Phone number"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                        </>
                                    )}

                                    {action.type === 'message' && action.await_response && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mt-2">
                                                Wait for response:
                                            </label>
                                            <input
                                                type="text"
                                                value={action.await_response || ''}
                                                onChange={(e) =>
                                                    handleUpdateAction(
                                                        index,
                                                        'await_response',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Expected response"
                                                className="block w-full text-sm border-gray-300 rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveAction(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex space-x-3">
                <button
                    type="button"
                    onClick={handleClosePanel}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default MenuEditPanel;