import { cn } from '@/lib/utils';

export type StatusState = 'online' | 'offline' | 'checking' | 'idle';

const STATE_TEXT_CLASS: Record<StatusState, string> = {
    online: 'text-success',
    offline: 'text-destructive',
    checking: 'text-warning',
    idle: 'text-muted-foreground',
};

type StatusIndicatorProps = {
    state: StatusState;
    label: string;
    className?: string;
};

/**
 * Indicador em formato de LED, como o de um terminal de caixa físico.
 * Usar apenas para refletir um estado real (ex.: conexão do DBLink) — nunca decorativo.
 */
export function StatusIndicator({
    state,
    label,
    className,
}: StatusIndicatorProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 text-sm font-medium',
                STATE_TEXT_CLASS[state],
                className,
            )}
        >
            <span
                className="status-dot"
                data-state={state}
                aria-hidden="true"
            />
            {label}
        </span>
    );
}
