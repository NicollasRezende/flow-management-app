// api.ts

// Obter a base URL para as chamadas de API
const getBaseUrl = () => {
    return (window as any).BASE_API_URL || '/api/v1/flow-manager/api';
};

export const fetchFlow = async () => {
    const response = await fetch(`${getBaseUrl()}/flow`);
    if (!response.ok) {
        throw new Error('Failed to fetch flow data');
    }
    return response.json();
};

export const saveFlow = async (flowData: any) => {
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
};

export const validateFlow = async (flowData: any) => {
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
};

export const importFlow = async (file: File) => {
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
};

export const exportFlow = async () => {
    const response = await fetch(`${getBaseUrl()}/flow/export`);
    if (!response.ok) {
        throw new Error('Failed to export flow data');
    }
    return response.json();
};