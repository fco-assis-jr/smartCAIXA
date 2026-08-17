import { Head } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { CustomLoginForm } from '@/components/custom-login-form';

export default function CustomLoginPage() {
    return (
        <>
            <Head title="Login" />

            <div className="grid min-h-svh lg:grid-cols-2">
                {/* Lado esquerdo - Formulário */}
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a
                            href="/"
                            className="flex items-center gap-2 font-display font-bold"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-4.5" />
                            </div>
                            <span className="text-lg tracking-tight">
                                Smart<span className="text-primary">CAIXA</span>
                            </span>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <CustomLoginForm />
                        </div>
                    </div>
                </div>

                {/* Lado direito - Console da operação */}
                <div className="relative hidden overflow-hidden bg-sidebar lg:block">
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, oklch(1 0 0 / 0.05) 1px, transparent 1px)',
                            backgroundSize: '22px 22px',
                        }}
                    />
                    <div
                        className="absolute inset-x-0 top-0 h-64"
                        style={{
                            background:
                                'radial-gradient(60% 100% at 50% 0%, oklch(0.73 0.175 57 / 0.18), transparent)',
                        }}
                    />

                    <div className="relative z-10 flex h-full flex-col justify-between p-10 text-sidebar-foreground">
                        <div className="flex items-center gap-2 font-display font-bold">
                            <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                                <AppLogoIcon className="size-4.5" />
                            </div>
                            <span className="text-lg tracking-tight">
                                Smart
                                <span className="text-sidebar-primary">
                                    CAIXA
                                </span>
                            </span>
                        </div>

                        <div className="max-w-md space-y-6">
                            <h2 className="font-display text-3xl leading-tight font-bold">
                                O painel de operação da sua loja.
                            </h2>
                            <p className="text-sidebar-foreground/65">
                                Baixas de estoque, consulta de vendas e
                                reconexão de caixas — tudo integrado ao Winthor,
                                num só lugar.
                            </p>

                            <div className="space-y-2.5 border-t border-sidebar-border pt-6 font-mono text-sm text-sidebar-foreground/70">
                                <p>
                                    <span className="text-sidebar-primary">
                                        &gt;
                                    </span>{' '}
                                    Baixa de produtos com controle de estoque
                                </p>
                                <p>
                                    <span className="text-sidebar-primary">
                                        &gt;
                                    </span>{' '}
                                    Consulta de vendas integrada ao Winthor
                                </p>
                                <p>
                                    <span className="text-sidebar-primary">
                                        &gt;
                                    </span>{' '}
                                    Reconexão de caixas com o servidor central
                                </p>
                            </div>
                        </div>

                        <p className="font-mono text-xs text-sidebar-foreground/40">
                            Autenticação validada diretamente no Winthor.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
