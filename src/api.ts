// api.ts

// Obter a base URL para as chamadas de API
const getBaseUrl = () => {
    return (window as any).BASE_API_URL || '/api/v1/flow-manager/api';
};

// Flag para ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

export const fetchFlow = async () => {
    try {
        // No ambiente de desenvolvimento, simulamos uma chamada bem-sucedida
        if (isDevelopment) {
            console.log('[API MOCK] Simulando fetchFlow no ambiente de desenvolvimento');
            return { success: true, message: 'Flow data fetched successfully' };
        }

        const response = await fetch(`${getBaseUrl()}/flow`);
        if (!response.ok) {
            throw new Error('Failed to fetch flow data');
        }
        return response.json();
    } catch (error) {
        console.error('Error in fetchFlow:', error);
        if (isDevelopment) {
            return { success: true, message: 'Mocked flow data fetched successfully' };
        }
        throw error;
    }
};

export const saveFlow = async (flowData: any) => {
    try {
        // No ambiente de desenvolvimento, simulamos uma chamada bem-sucedida
        if (isDevelopment) {
            console.log('[API MOCK] Simulando saveFlow no ambiente de desenvolvimento');
            // Simular um pequeno atraso para dar feedback visual
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, message: 'Flow data saved successfully' };
        }

        const response = await fetch(`${getBaseUrl()}/flow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flowData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to save flow data');
        }
        return response.json();
    } catch (error) {
        console.error('Error in saveFlow:', error);
        if (isDevelopment) {
            return { success: true, message: 'Mocked flow data saved successfully' };
        }
        throw error;
    }
};

export const validateFlow = async (flowData: any) => {
    try {
        // No ambiente de desenvolvimento, simulamos uma chamada bem-sucedida
        if (isDevelopment) {
            console.log('[API MOCK] Simulando validateFlow no ambiente de desenvolvimento');
            return { success: true, valid: true, message: 'Flow data is valid' };
        }

        const response = await fetch(`${getBaseUrl()}/flow/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flowData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to validate flow data');
        }
        return response.json();
    } catch (error) {
        console.error('Error in validateFlow:', error);
        if (isDevelopment) {
            return { success: true, valid: true, message: 'Mocked flow data is valid' };
        }
        throw error;
    }
};

export const importFlow = async (file: File) => {
    try {
        // No ambiente de desenvolvimento, simulamos uma chamada bem-sucedida
        if (isDevelopment) {
            console.log('[API MOCK] Simulando importFlow no ambiente de desenvolvimento');
            return { success: true, message: 'Flow data imported successfully' };
        }

        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${getBaseUrl()}/flow/import`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Failed to import flow data');
        }
        return response.json();
    } catch (error) {
        console.error('Error in importFlow:', error);
        if (isDevelopment) {
            return { success: true, message: 'Mocked flow data imported successfully' };
        }
        throw error;
    }
};

export const exportFlow = async () => {
    try {
        // No ambiente de desenvolvimento, simulamos uma chamada bem-sucedida
        if (isDevelopment) {
            console.log('[API MOCK] Simulando exportFlow no ambiente de desenvolvimento');
            return { success: true, message: 'Flow data exported successfully' };
        }

        const response = await fetch(`${getBaseUrl()}/flow/export`);
        
        if (!response.ok) {
            throw new Error('Failed to export flow data');
        }
        return response.json();
    } catch (error) {
        console.error('Error in exportFlow:', error);
        if (isDevelopment) {
            return { success: true, message: 'Mocked flow data exported successfully' };
        }
        throw error;
    }
};