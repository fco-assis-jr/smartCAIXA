import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error404() {
    return (
        <>
            <Head title="404 - Página Não Encontrada" />
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="size-8 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl font-bold">404</CardTitle>
                        <CardDescription className="text-lg">
                            Página Não Encontrada
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">
                            Desculpe, a página que você está procurando não existe ou foi movida.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto" 
                            onClick={() => window.history.back()}
                        >
                            <Search className="mr-2 size-4" />
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
