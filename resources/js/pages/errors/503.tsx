import { Head, Link } from '@inertiajs/react';
import { Wrench, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error503() {
    return (
        <>
            <Head title="503 - Serviço Indisponível" />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-yellow-500/10">
                            <Wrench className="size-8 text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <CardTitle className="text-3xl font-bold">503</CardTitle>
                        <CardDescription className="text-lg">
                            Serviço Indisponível
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Estamos realizando manutenção no sistema. Por favor, tente novamente em alguns instantes.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => window.location.reload()}
                        >
                            <Clock className="mr-2 size-4" />
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
