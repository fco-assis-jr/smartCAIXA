import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type CustomAlertProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    variant?: 'default' | 'error' | 'warning' | 'success';
};

export function CustomAlert({
    open,
    onClose,
    title,
    message,
    variant = 'default',
}: CustomAlertProps) {
    const getTitle = () => {
        if (title) return title;

        switch (variant) {
            case 'error':
                return 'Erro';
            case 'warning':
                return 'Atenção';
            case 'success':
                return 'Sucesso';
            default:
                return 'Aviso';
        }
    };

    const getIcon = () => {
        switch (variant) {
            case 'error':
                return <XCircle className="h-6 w-6 text-red-600" />;
            case 'warning':
                return <AlertCircle className="h-6 w-6 text-yellow-600" />;
            case 'success':
                return <CheckCircle2 className="h-6 w-6 text-green-600" />;
            default:
                return <Info className="h-6 w-6 text-blue-600" />;
        }
    };

    const getIconBackgroundColor = () => {
        switch (variant) {
            case 'error':
                return 'bg-red-100';
            case 'warning':
                return 'bg-yellow-100';
            case 'success':
                return 'bg-green-100';
            default:
                return 'bg-blue-100';
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-start gap-4">
                        <div className={`shrink-0 rounded-full p-2 ${getIconBackgroundColor()}`}>
                            {getIcon()}
                        </div>
                        <div className="flex-1 pt-1">
                            <AlertDialogTitle className="text-left">
                                {getTitle()}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left mt-2">
                                {message}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose}>
                        OK
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
