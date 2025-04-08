import { initToaster } from "./toaster.js";

export function initNotifications() {
    const toaster = initToaster(document.body);

    document.addEventListener('event-create', () => {
        toaster.success('Evento criado com sucesso');
    });

    document.addEventListener('event-delete', () => {
        toaster.success('Evento excluido com sucesso');
    });

    document.addEventListener('event-edit', () => {
        toaster.success('Evento editado com sucesso');
    });
}