import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error500() {
    return (
        <>
            <Head title="500 - Erro do Servidor" />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="size-8 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl font-bold">500</CardTitle>
                        <CardDescription className="text-lg">
                            Erro do Servidor
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Ops! Algo deu errado no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="mr-2 size-4" />
                            Tentar Novamente
                        </Button>
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
