import { Construction } from 'lucide-react';

export function ComingSoon({ description }: { description?: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 px-6 py-16 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
                <Construction className="size-6" />
            </div>
            <p className="font-display text-sm font-bold">Em desenvolvimento</p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                {description ??
                    'Esta ferramenta ainda está sendo construída e chega em breve.'}
            </p>
        </div>
    );
}
