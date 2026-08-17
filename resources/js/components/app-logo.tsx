import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-4.5" />
            </div>
            <div className="ml-2 grid flex-1 text-left leading-none">
                <span className="truncate font-display text-[15px] font-bold tracking-tight text-sidebar-foreground">
                    Smart<span className="text-sidebar-primary">CAIXA</span>
                </span>
                <span className="mt-1 truncate text-[10.5px] text-sidebar-foreground/55">
                    Painel do operador
                </span>
            </div>
        </>
    );
}
