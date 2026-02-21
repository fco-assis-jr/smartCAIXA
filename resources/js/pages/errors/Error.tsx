import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    status?: number;
    message?: string;
};

export default function Error({ status = 500, message }: Props) {
    const getStatusInfo = () => {
        switch (status) {
            case 404:
                return {
                    title: '404',
                    description: 'Página Não Encontrada',
                    message: message || 'A página que você está procurando não existe ou foi movida.',
                    icon: AlertCircle,
                };
            case 403:
                return {
                    title: '403',
                    description: 'Acesso Negado',
                    message: message || 'Você não tem permissão para acessar esta página ou recurso.',
                    icon: AlertCircle,
                };
            case 500:
                return {
                    title: '500',
                    description: 'Erro do Servidor',
                    message: message || 'Ops! Algo deu errado no servidor. Nossa equipe foi notificada.',
                    icon: AlertCircle,
                };
            case 503:
                return {
                    title: '503',
                    description: 'Serviço Indisponível',
                    message: message || 'Estamos realizando manutenção no sistema. Tente novamente em alguns instantes.',
                    icon: AlertCircle,
                };
            default:
                return {
                    title: status.toString(),
                    description: 'Erro',
                    message: message || 'Ocorreu um erro inesperado. Por favor, tente novamente.',
                    icon: AlertCircle,
                };
        }
    };

    const statusInfo = getStatusInfo();
    const Icon = statusInfo.icon;

    return (
        <>
            <Head title={`${statusInfo.title} - ${statusInfo.description}`} />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                            <Icon className="size-8 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl font-bold">{statusInfo.title}</CardTitle>
                        <CardDescription className="text-lg">
                            {statusInfo.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            {statusInfo.message}
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        {status !== 503 && (
                            <Button 
                                variant="outline" 
                                className="w-full sm:w-auto" 
                                onClick={() => window.history.back()}
                            >
                                <RefreshCw className="mr-2 size-4" />
                                Voltar
                            </Button>
                        )}
                        <Button asChild variant="default" className="w-full sm:w-auto">
                            <Link href="/smartcaixa/dashboard">
                                <Home className="mr-2 size-4" />
                                Ir para Home
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
