
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionAlertProps {
  status: {
    is_active: boolean;
    days_remaining: number;
    status: string;
    message: string;
  };
}

const SubscriptionAlert = ({ status }: SubscriptionAlertProps) => {
  if (status.status === 'admin' || status.status === 'active') {
    return null;
  }

  const getAlertVariant = () => {
    if (status.status === 'expired' || status.status === 'inactive') {
      return 'destructive';
    }
    return 'default';
  };

  const getIcon = () => {
    if (status.status === 'expired' || status.status === 'inactive') {
      return <XCircle className="h-4 w-4" />;
    }
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getTitle = () => {
    switch (status.status) {
      case 'expired':
        return 'انتهى الاشتراك';
      case 'inactive':
        return 'تم إيقاف الحساب';
      case 'expiring_soon':
        return 'تنبيه انتهاء الاشتراك';
      default:
        return 'تنبيه';
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Alert variant={getAlertVariant()} className="border-2">
        {getIcon()}
        <AlertTitle className="font-bold">{getTitle()}</AlertTitle>
        <AlertDescription className="mt-2">
          {status.message}
          {status.status === 'inactive' && (
            <div className="mt-3">
              <Button size="sm" variant="outline">
                تواصل مع الإدارة
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SubscriptionAlert;
