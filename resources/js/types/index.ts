export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    /** Menus restritos por setor (config/menu_access.php) que o usuário logado pode ver. */
    menuAccess: Record<string, boolean>;
    [key: string]: unknown;
};
