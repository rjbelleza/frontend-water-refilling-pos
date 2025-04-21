import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Snackbar = ({ message, type = 'info', duration = 10000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colorMap = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`fixed bottom-4 flex items-start gap-3 p-4 pr-8 rounded-lg border shadow-sm max-w-xs ${colorMap[type]}`}>
      <div className="mt-0.5">
        {iconMap[type]}
      </div>
      <p className="text-sm flex-1">
        {message}
      </p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Snackbar;
