import { Head, Link } from '@inertiajs/react';
import { Lock, Home, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error403() {
    return (
        <>
            <Head title="403 - Acesso Negado" />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                            <Lock className="size-8 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl font-bold">403</CardTitle>
                        <CardDescription className="text-lg">
                            Acesso Negado
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Você não tem permissão para acessar esta página ou recurso.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => window.history.back()}
                        >
                            <Shield className="mr-2 size-4" />
                            Voltar
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
