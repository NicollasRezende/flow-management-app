import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configurar base URL para chamadas de API
window.BASE_API_URL = '/api/v1/flow-manager/api';

// Função para marcar o corpo como carregado após a inicialização
const markBodyAsLoaded = () => {
    // Marcar o corpo como carregado após um pequeno atraso para garantir que o CSS foi aplicado
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 10); // 10ms deve ser suficiente
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Marcar o corpo como carregado
markBodyAsLoaded();
