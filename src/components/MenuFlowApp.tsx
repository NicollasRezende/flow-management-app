import React, { useState, useEffect } from 'react';
import MenuFlowEditor from './MenuFlowEditor';

interface MenuFlowAppProps {
    initialData?: Record<string, any>;
}

const MenuFlowApp: React.FC<MenuFlowAppProps> = ({ initialData }) => {
    const [menuData, setMenuData] = useState<Record<string, any>>(
        initialData || {
            greetings: {
                welcome: 'Hello, {name}! Welcome to our service!',
                returning_user: 'Good to see you again, {name}!',
            },
            menus: {
                initial: {
                    title: 'Main Menu',
                    content:
                        'Welcome to our service. How can we help you today?',
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
        }
    );

    // Try to load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('menuFlowData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setMenuData(parsedData);
            } catch (error) {
                console.error('Failed to parse saved data:', error);
            }
        }
    }, []);

    const handleSave = (updatedData: Record<string, any>) => {
        setMenuData(updatedData);
        // Save to localStorage
        localStorage.setItem('menuFlowData', JSON.stringify(updatedData));
        console.log('Saved menu flow data:', updatedData);
    };

    const handleAddMenu = (menuId: string, menuType: string = 'button') => {
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
    };

    const handleImportJson = (jsonData: any) => {
        if (jsonData && typeof jsonData === 'object') {
            // Validate the data has at least a menus property
            if (!jsonData.menus || typeof jsonData.menus !== 'object') {
                alert('Invalid menu data: missing menus object');
                return;
            }

            setMenuData(jsonData);
            // Save to localStorage
            localStorage.setItem('menuFlowData', JSON.stringify(jsonData));
            console.log('Imported menu flow data:', jsonData);
        }
    };

    const handleExportJson = () => {
        // Create a Blob with the JSON data
        const jsonString = JSON.stringify(menuData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a link to download the data
        const a = document.createElement('a');
        a.href = url;
        a.download = `menu-flow-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <MenuFlowEditor
                menuData={menuData}
                onSave={handleSave}
                onAddMenu={handleAddMenu}
                onImportJson={handleImportJson}
                onExportJson={handleExportJson}
            />
        </div>
    );
};

export default MenuFlowApp;
