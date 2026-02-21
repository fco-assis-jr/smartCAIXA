import { useCallback } from 'react';

export type GetInitialsFn = (fullName: string) => string;

export function useInitials(): GetInitialsFn {
    return useCallback((fullName: string): string => {
        // Proteção contra valores undefined, null ou vazios
        if (!fullName || typeof fullName !== 'string') {
            return 'U'; // Retorna 'U' de Usuário como fallback
        }

        const names = fullName.trim().split(' ');

        if (names.length === 0) return 'U';
        if (names.length === 1) return names[0].charAt(0).toUpperCase() || 'U';

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}
