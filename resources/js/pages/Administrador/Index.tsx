import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import administrador from '@/routes/administrador';

type Menu = {
    chave: string;
    label: string;
};

type Setor = {
    codsetor: number;
    descricao: string;
};

type Props = {
    menus: Menu[];
    setores: Setor[];
    permissoes: Record<string, number[]>;
};

type AlertState = {
    open: boolean;
    message: string;
    variant: 'default' | 'error' | 'warning' | 'success';
};

export default function AdministradorIndex({
    menus,
    setores,
    permissoes,
}: Props) {
    const [selecionados, setSelecionados] = useState<
        Record<string, Set<number>>
    >(() => {
        const inicial: Record<string, Set<number>> = {};
        menus.forEach((menu) => {
            inicial[menu.chave] = new Set(permissoes[menu.chave] ?? []);
        });
        return inicial;
    });
    const [salvando, setSalvando] = useState<string | null>(null);
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const showAlert = (
        message: string,
        variant: AlertState['variant'] = 'default',
    ) => setAlert({ open: true, message, variant });

    const closeAlert = () => setAlert((atual) => ({ ...atual, open: false }));

    const alternarSetor = (menuChave: string, codsetor: number) => {
        setSelecionados((atual) => {
            const proximo = new Set(atual[menuChave]);
            if (proximo.has(codsetor)) {
                proximo.delete(codsetor);
            } else {
                proximo.add(codsetor);
            }
            return { ...atual, [menuChave]: proximo };
        });
    };

    const salvar = async (menuChave: string) => {
        setSalvando(menuChave);
        try {
            await axios.post(administrador.menuAcesso.atualizar.url(), {
                menu: menuChave,
                codsetores: Array.from(selecionados[menuChave] ?? []),
            });
            showAlert('Permissões salvas com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar permissões:', error);
            showAlert(
                'Não foi possível salvar as permissões. Tente novamente.',
                'error',
            );
        } finally {
            setSalvando(null);
        }
    };

    return (
        <>
            <Head title="Administrador" />

            <CustomAlert
                open={alert.open}
                onClose={closeAlert}
                message={alert.message}
                variant={alert.variant}
            />

            <div className="px-4 py-6">
                <Heading
                    title="Administrador"
                    description="Controle quais setores podem acessar cada menu do sistema"
                />

                <div className="mt-6 space-y-4">
                    {menus.map((menu) => (
                        <Card key={menu.chave}>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-4 text-muted-foreground" />
                                    <CardTitle>{menu.label}</CardTitle>
                                </div>
                                <CardDescription>
                                    Setores autorizados a acessar este menu —
                                    quem não estiver marcado recebe acesso
                                    negado ao tentar entrar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {setores.map((setor) => {
                                        const marcado =
                                            selecionados[menu.chave]?.has(
                                                setor.codsetor,
                                            ) ?? false;
                                        return (
                                            <label
                                                key={setor.codsetor}
                                                className="flex items-center gap-2 rounded-md border p-2 text-sm transition-colors hover:bg-accent/50"
                                            >
                                                <Checkbox
                                                    checked={marcado}
                                                    onCheckedChange={() =>
                                                        alternarSetor(
                                                            menu.chave,
                                                            setor.codsetor,
                                                        )
                                                    }
                                                />
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {setor.codsetor}
                                                </span>
                                                <span className="truncate">
                                                    {setor.descricao}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button
                                    onClick={() => salvar(menu.chave)}
                                    disabled={salvando === menu.chave}
                                >
                                    {salvando === menu.chave
                                        ? 'Salvando...'
                                        : 'Salvar'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

AdministradorIndex.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            {
                title: 'Administrador',
                href: administrador.menuAcesso.index.url(),
            },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
