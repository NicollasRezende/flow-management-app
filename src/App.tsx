import React, { useState, useEffect } from 'react';
import MenuFlowApp from './components/MenuFlowApp';
import './index.css';

function App() {
    const [initialData, setInitialData] = useState<Record<string, any> | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    // Try to load the JSON from the file if available
    useEffect(() => {
        const loadJsonData = async () => {
            try {
                // Check if there's a saved flow in localStorage first
                const savedFlow = localStorage.getItem('menuFlowData');
                if (savedFlow) {
                    setInitialData(JSON.parse(savedFlow));
                    setIsLoading(false);
                    return;
                }

                // If no saved flow, try to load the provided JSON
                const response = await fetch('/assets/flow-template.json');
                if (response.ok) {
                    const data = await response.json();
                    setInitialData(data);
                }
            } catch (error) {
                console.error('Failed to load initial JSON data:', error);
                // Continue with empty flow if file can't be loaded
            } finally {
                setIsLoading(false);
            }
        };

        loadJsonData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <svg
                        className="animate-spin h-10 w-10 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <div className="text-lg font-medium text-gray-700">
                        Carregando o editor de fluxo...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-indigo-600 mr-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Menu Flow Manager
                        </h1>
                    </div>
                    <div className="text-sm text-gray-500">Versão 1.0</div>
                </div>
            </header>
            <main className="flex-grow">
                <div className="max-w-full h-full">
                    <MenuFlowApp initialData={initialData || undefined} />
                </div>
            </main>
        </div>
    );
}

export default App;
