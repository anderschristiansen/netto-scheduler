import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { ValidationError } from "@/lib/types";

interface ValidationIndicatorProps {
  errors: ValidationError[];
  className?: string;
}

export function ValidationIndicator({ errors, className = "" }: ValidationIndicatorProps) {
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  if (errorCount > 0) {
    return (
      <div className={`flex items-center text-red-600 ${className}`}>
        <AlertCircle className="h-4 w-4 mr-1" />
        <span className="text-sm">{errorCount} error{errorCount > 1 ? 's' : ''}</span>
      </div>
    );
  }

  if (warningCount > 0) {
    return (
      <div className={`flex items-center text-yellow-600 ${className}`}>
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-sm">{warningCount} warning{warningCount > 1 ? 's' : ''}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center text-green-600 ${className}`}>
      <CheckCircle className="h-4 w-4 mr-1" />
      <span className="text-sm">Valid</span>
    </div>
  );
}

interface ValidationSummaryProps {
  errors: ValidationError[];
}

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 rounded-lg bg-red-50 p-4">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Schedule Validation Issues
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}