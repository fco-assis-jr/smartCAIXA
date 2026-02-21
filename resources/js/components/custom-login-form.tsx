import { useForm } from '@inertiajs/react';
import { AlertCircle, Clock } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function CustomLoginForm({
    className,
    ...props
}: React.ComponentProps<'form'>) {
    const { data, setData, post, processing, errors } = useForm({
        usuario: '',
        senha: '',
        remember: false,
    });

    const [countdown, setCountdown] = useState<number | null>(null);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Detectar se é erro de rate limiting
    const checkRateLimit = useCallback(() => {
        if (errors.usuario) {
            const match = errors.usuario.match(/aguarde (\d+) segundo/i);
            if (match) {
                const seconds = parseInt(match[1]);
                // Usar setTimeout para evitar setState síncrono no effect
                setTimeout(() => {
                    setCountdown(seconds);
                    setIsRateLimited(true);
                }, 0);
            } else {
                setTimeout(() => {
                    setIsRateLimited(false);
                    setCountdown(null);
                }, 0);
            }
        } else {
            setTimeout(() => {
                setIsRateLimited(false);
                setCountdown(null);
            }, 0);
        }
    }, [errors.usuario]);

    // Executar verificação quando erro mudar
    useEffect(() => {
        checkRateLimit();
    }, [checkRateLimit]);

    // Countdown timer
    useEffect(() => {
        // Limpar timer anterior
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (countdown !== null && countdown > 0) {
            timerRef.current = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setTimeout(() => {
                setIsRateLimited(false);
                setCountdown(null);
            }, 0);
        }

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [countdown]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!isRateLimited || countdown === 0) {
            post('/login');
        }
    };

    return (
        <form
            className={cn('flex flex-col gap-6', className)}
            onSubmit={submit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Bem-vindo</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Entre com seu usuário e senha para acessar o sistema
                    </p>
                </div>

                {errors.usuario && (
                    <div
                        className={cn(
                            'rounded-lg border p-4 text-sm',
                            isRateLimited
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                : 'border-destructive/50 bg-destructive/10 text-destructive'
                        )}
                    >
                        <div className="flex items-start gap-3">
                            {isRateLimited ? (
                                <Clock className="mt-0.5 size-5 shrink-0" />
                            ) : (
                                <AlertCircle className="mt-0.5 size-5 shrink-0" />
                            )}
                            <div className="flex-1 space-y-2">
                                <p className="font-semibold">
                                    {isRateLimited
                                        ? 'Muitas tentativas de login'
                                        : 'Erro de autenticação'}
                                </p>
                                <p>{errors.usuario}</p>
                                {countdown !== null && countdown > 0 && (
                                    <div className="mt-3 flex items-center gap-2 rounded-md bg-amber-500/20 px-3 py-2">
                                        <Clock className="size-4 animate-pulse" />
                                        <p className="text-xs font-medium">
                                            Aguarde {countdown} segundo
                                            {countdown !== 1 ? 's' : ''} para
                                            tentar novamente
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Field>
                    <FieldLabel htmlFor="usuario">Usuário</FieldLabel>
                    <Input
                        id="usuario"
                        type="text"
                        value={data.usuario}
                        onChange={(e) => setData('usuario', e.target.value)}
                        placeholder="Digite seu usuário"
                        required
                        autoFocus
                        autoComplete="username"
                        className={errors.usuario ? 'border-destructive' : ''}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="senha">Senha</FieldLabel>
                    <Input
                        id="senha"
                        type="password"
                        value={data.senha}
                        onChange={(e) => setData('senha', e.target.value)}
                        placeholder="Digite sua senha"
                        required
                        autoComplete="current-password"
                        className={errors.usuario ? 'border-destructive' : ''}
                    />
                </Field>

                <Field>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="size-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-muted-foreground">
                            Lembrar de mim
                        </span>
                    </label>
                </Field>

                <Field>
                    <Button
                        type="submit"
                        disabled={
                            processing ||
                            (isRateLimited && (countdown ?? 0) > 0)
                        }
                        className="w-full"
                    >
                        {processing
                            ? 'Entrando...'
                            : isRateLimited && (countdown ?? 0) > 0
                              ? `Aguarde ${countdown}s`
                              : 'Entrar'}
                    </Button>
                </Field>

                <FieldDescription className="text-center text-xs">
                    Sistema SmartCAIXA - Acesso restrito a usuários autorizados
                </FieldDescription>
            </FieldGroup>
        </form>
    );
}
