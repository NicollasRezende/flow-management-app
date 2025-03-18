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
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-lg font-medium text-gray-600">
                    Loading menu flow editor...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Menu Flow Management System
                    </h1>
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
