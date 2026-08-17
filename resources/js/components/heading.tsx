export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    if (variant === 'small') {
        return (
            <header>
                <h2 className="mb-0.5 text-base font-medium">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </header>
        );
    }

    return (
        <header className="mb-8 space-y-1">
            <div className="flex items-center gap-2.5">
                <span
                    className="h-5 w-1 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                />
                <h2 className="font-display text-xl font-bold tracking-tight">
                    {title}
                </h2>
            </div>
            {description && (
                <p className="pl-[14px] text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
