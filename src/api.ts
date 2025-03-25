// api.ts

// Obter a base URL para as chamadas de API
const getBaseUrl = () => {
    // Verificar se temos uma URL base específica definida globalmente
    if ((window as any).BASE_API_URL) {
        return (window as any).BASE_API_URL;
    }
    
    // Verificar a URL atual para determinar o caminho base
    const currentUrl = window.location.href;
    console.log('[API] URL atual:', currentUrl);
    
    // Caso específico do ngrok - tratar como ambiente de produção
    if (currentUrl.includes('ngrok-free.app')) {
        console.log('[API] Detectado ambiente ngrok (tratando como produção)');
        // Usar um caminho direto padronizado para API
        return '/api/v1';
    }
    
    // Se estamos em uma URL com /api/v1/flow-manager, precisamos usar esse prefixo
    const pathname = window.location.pathname;
    if (pathname.includes('/api/v1/flow-manager')) {
        console.log('[API] Detectado path /api/v1/flow-manager na URL');
        return '/api/v1';
    }
    
    // Ambiente de desenvolvimento ou outro ambiente
    return '/api';
};

// Função auxiliar para obter o caminho completo da API
const getApiPath = (endpoint: string) => {
    const base = getBaseUrl();
    
    // Limpar o endpoint para evitar duplicações
    let cleanEndpoint = endpoint;
    
    // Remover prefixos 'api/' ou '/api/' do endpoint
    if (cleanEndpoint.startsWith('api/')) {
        cleanEndpoint = cleanEndpoint.substring(4);
    } else if (cleanEndpoint.startsWith('/api/')) {
        cleanEndpoint = cleanEndpoint.substring(5);
    }
    
    // Garantir que o endpoint comece com '/'
    if (!cleanEndpoint.startsWith('/')) {
        cleanEndpoint = '/' + cleanEndpoint;
    }
    
    // Para ambientes ngrok - montar o caminho correto da API
    if (window.location.href.includes('ngrok-free.app')) {
        return `/api/v1/flow${cleanEndpoint}`;
    }
    
    // Construir o caminho final evitando duplicações
    const fullPath = `${base}${cleanEndpoint}`;
    
    console.log('[API] Caminho final da API:', fullPath);
    return fullPath;
};

// Flag apenas para ambiente de desenvolvimento local (localhost)
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Não tratar ngrok como ambiente especial - é apenas outro ambiente de produção
// O ngrok é apenas um proxy para o servidor real
const isNgrok = window.location.href.includes('ngrok-free.app');

export const fetchFlow = async () => {
    try {
        console.log('[API] Iniciando fetchFlow para obter dados atualizados do backend');
        
        // Usar localStorage apenas em ambiente de desenvolvimento local
        if (isDevelopment && !isNgrok) {
            console.log('[API] Ambiente de desenvolvimento local detectado, usando localStorage');
            const savedData = localStorage.getItem('menuFlowData');
            if (savedData) {
                return JSON.parse(savedData);
            }
            throw new Error('Nenhum dado encontrado no localStorage');
        }
        
        // Para outros ambientes (incluindo ngrok), tentar acessar a API
        const endpoint = getApiPath('flow');
        console.log('[API] URL da requisição:', endpoint);
        
        try {
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                console.error('[API] Resposta de erro do fetchFlow:', response.status, response.statusText);
                throw new Error(`Failed to fetch flow data: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('[API] Dados obtidos com sucesso do backend');
            return data;
        } catch (fetchError) {
            console.error('[API] Erro na requisição fetchFlow:', fetchError);
            
            // Se a requisição falhar, tentar fallback para localStorage como último recurso
            const savedData = localStorage.getItem('menuFlowData');
            if (savedData) {
                console.log('[API] Usando dados do localStorage como fallback após falha na API');
                return JSON.parse(savedData);
            }
            
            throw fetchError;
        }
    } catch (error) {
        console.error('[API] Erro geral em fetchFlow:', error);
        throw error;
    }
};


export const saveFlow = async (flowData: any) => {
    try {
        // Log dos dados sendo enviados
        console.log('[API] Enviando dados para o backend:', flowData);
        
        // Sempre salvar no localStorage como backup/fallback
        localStorage.setItem('menuFlowData', JSON.stringify(flowData));
        console.log('[API] Dados salvos no localStorage como backup');
        
        // Em ambiente de desenvolvimento local apenas, simular sucesso
        if (isDevelopment && !isNgrok) {
            console.log('[API] Ambiente de desenvolvimento local detectado, simulando resposta de sucesso');
            return { status: 'success', message: 'Dados salvos com sucesso (modo local)' };
        }
        
        // Para outros ambientes (incluindo ngrok), tentar acessar a API
        const endpoint = getApiPath('flow');
        console.log('[API] Tentando salvar no endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flowData),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('[API] Resposta de erro do servidor:', errorData);
            throw new Error(`Falha ao salvar dados: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('[API] Salvo com sucesso:', result);
        return result;
    } catch (error) {
        // Para ambiente de desenvolvimento local apenas
        if (isDevelopment && !isNgrok) {
            console.warn('[API] Erro ao salvar dados no servidor, mas continuando em modo local:', error);
            return { status: 'success', message: 'Dados salvos localmente (modo offline)' };
        }
        
        console.error('[API] Erro ao salvar dados:', error);
        throw error;
    }
};

// Funções restantes permanecem similares, mas ajustadas para tratar ngrok como ambiente de produção

export const validateFlow = async (flowData: any) => {
    try {
        // Apenas em ambiente de desenvolvimento local
        if (isDevelopment && !isNgrok) {
            console.log('[API MOCK] Simulando validateFlow no ambiente de desenvolvimento local');
            return { success: true, valid: true, message: 'Flow data is valid' };
        }

        const endpoint = getApiPath('flow/validate');
        console.log('[API] Validando fluxo no endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
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
        console.error('[API] Erro em validateFlow:', error);
        if (isDevelopment && !isNgrok) {
            return { success: true, valid: true, message: 'Mocked flow data is valid' };
        }
        throw error;
    }
};

export const importFlow = async (file: File) => {
    try {
        // Apenas em ambiente de desenvolvimento local
        if (isDevelopment && !isNgrok) {
            console.log('[API MOCK] Simulando importFlow no ambiente de desenvolvimento local');
            return { success: true, message: 'Flow data imported successfully' };
        }

        const endpoint = getApiPath('flow/import');
        console.log('[API] Importando fluxo no endpoint:', endpoint);
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Failed to import flow data');
        }
        return response.json();
    } catch (error) {
        console.error('[API] Erro em importFlow:', error);
        if (isDevelopment && !isNgrok) {
            return { success: true, message: 'Mocked flow data imported successfully' };
        }
        throw error;
    }
};

export const exportFlow = async () => {
    try {
        // Apenas em ambiente de desenvolvimento local
        if (isDevelopment && !isNgrok) {
            console.log('[API MOCK] Simulando exportFlow no ambiente de desenvolvimento local');
            const savedData = localStorage.getItem('menuFlowData');
            if (savedData) {
                return JSON.parse(savedData);
            }
            return { success: true, message: 'No data found in localStorage' };
        }

        const endpoint = getApiPath('flow/export');
        console.log('[API] Exportando fluxo do endpoint:', endpoint);
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error('Failed to export flow data');
        }
        return response.json();
    } catch (error) {
        console.error('[API] Erro em exportFlow:', error);
        if (isDevelopment && !isNgrok) {
            const savedData = localStorage.getItem('menuFlowData');
            if (savedData) {
                return JSON.parse(savedData);
            }
            return { success: true, message: 'Mocked flow data exported successfully' };
        }
        throw error;
    }
};