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
                            className="flex items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-5" />
                            </div>
                            <span className="text-lg">SmartCAIXA</span>
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <CustomLoginForm />
                        </div>
                    </div>
                </div>

                {/* Lado direito - Imagem/Banner */}
                <div className="relative hidden bg-muted lg:block">
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                        <div className="max-w-md space-y-4 p-8 text-center">
                            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10">
                                <AppLogoIcon className="size-12 text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold">
                                Sistema de Gestão
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Controle total das operações do seu caixa com
                                segurança e eficiência
                            </p>
                            <div className="mt-8 grid gap-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                        <svg
                                            className="size-4 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Gestão de Baixas
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Controle eficiente de avarias e
                                            perdas
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                        <svg
                                            className="size-4 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Ferramentas de Gestão
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Recursos avançados para
                                            administração
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                        <svg
                                            className="size-4 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Integração Oracle
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Conexão direta com banco de dados
                                            corporativo
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
