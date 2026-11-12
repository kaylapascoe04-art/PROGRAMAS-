import React from 'react';
import { ShieldCheck, HardHat, Wrench, Cog, Building2 } from 'lucide-react';
import { WarehouseConfig } from '../../types/inventory';

interface PlatformLogoProps {
  config: WarehouseConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  config,
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const renderVisual = () => {
    // If a custom image/data URL is provided
    if (config.logoUrl && config.logoUrl.trim().length > 0) {
      return (
        <img
          src={config.logoUrl}
          alt={`Logo de ${config.companyName}`}
          className={`${sizeClasses[size]} object-contain rounded-lg border border-slate-200 bg-white p-1 shadow-2xs dark:border-slate-800 dark:bg-slate-800`}
        />
      );
    }

    // Otherwise render selected preset icon
    const preset = config.logoPreset || 'shield';

    switch (preset) {
      case 'shield':
        return (
          <div
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs`}
          >
            <ShieldCheck className={iconSizes[size]} />
          </div>
        );
      case 'helmet':
        return (
          <div
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs`}
          >
            <HardHat className={iconSizes[size]} />
          </div>
        );
      case 'crane':
        return (
          <div
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs`}
          >
            <Building2 className={iconSizes[size]} />
          </div>
        );
      case 'gear':
        return (
          <div
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs`}
          >
            <Cog className={iconSizes[size]} />
          </div>
        );
      default:
        return (
          <div
            className={`flex ${sizeClasses[size]} shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs`}
          >
            <Wrench className={iconSizes[size]} />
          </div>
        );
    }
  };

  if (!showText) {
    return <div className={`inline-flex items-center ${className}`}>{renderVisual()}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {renderVisual()}
      <div className="flex flex-col">
        <span className="font-bold tracking-tight text-slate-900 leading-tight dark:text-white">
          {config.companyName}
        </span>
        <span className="text-[11px] text-slate-500 leading-tight dark:text-slate-400">
          {config.facilityName}
        </span>
      </div>
    </div>
  );
};
