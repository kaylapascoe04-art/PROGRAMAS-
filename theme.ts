import { AccentColor } from '../types/platform';

export interface AccentThemeClasses {
  bgPrimary: string;
  bgHover: string;
  textPrimary: string;
  bgLight: string;
  borderLight: string;
  ringFocus: string;
}

export const getAccentClasses = (color: AccentColor): AccentThemeClasses => {
  switch (color) {
    case 'emerald':
      return {
        bgPrimary: 'bg-emerald-600 dark:bg-emerald-500',
        bgHover: 'hover:bg-emerald-700 dark:hover:bg-emerald-600',
        textPrimary: 'text-emerald-600 dark:text-emerald-400',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
        borderLight: 'border-emerald-200 dark:border-emerald-800/60',
        ringFocus: 'focus:ring-emerald-500',
      };
    case 'violet':
      return {
        bgPrimary: 'bg-violet-600 dark:bg-violet-500',
        bgHover: 'hover:bg-violet-700 dark:hover:bg-violet-600',
        textPrimary: 'text-violet-600 dark:text-violet-400',
        bgLight: 'bg-violet-50 dark:bg-violet-950/40',
        borderLight: 'border-violet-200 dark:border-violet-800/60',
        ringFocus: 'focus:ring-violet-500',
      };
    case 'amber':
      return {
        bgPrimary: 'bg-amber-600 dark:bg-amber-500',
        bgHover: 'hover:bg-amber-700 dark:hover:bg-amber-600',
        textPrimary: 'text-amber-600 dark:text-amber-400',
        bgLight: 'bg-amber-50 dark:bg-amber-950/40',
        borderLight: 'border-amber-200 dark:border-amber-800/60',
        ringFocus: 'focus:ring-amber-500',
      };
    case 'blue':
      return {
        bgPrimary: 'bg-blue-600 dark:bg-blue-500',
        bgHover: 'hover:bg-blue-700 dark:hover:bg-blue-600',
        textPrimary: 'text-blue-600 dark:text-blue-400',
        bgLight: 'bg-blue-50 dark:bg-blue-950/40',
        borderLight: 'border-blue-200 dark:border-blue-800/60',
        ringFocus: 'focus:ring-blue-500',
      };
    case 'rose':
      return {
        bgPrimary: 'bg-rose-600 dark:bg-rose-500',
        bgHover: 'hover:bg-rose-700 dark:hover:bg-rose-600',
        textPrimary: 'text-rose-600 dark:text-rose-400',
        bgLight: 'bg-rose-50 dark:bg-rose-950/40',
        borderLight: 'border-rose-200 dark:border-rose-800/60',
        ringFocus: 'focus:ring-rose-500',
      };
    case 'indigo':
    default:
      return {
        bgPrimary: 'bg-indigo-600 dark:bg-indigo-500',
        bgHover: 'hover:bg-indigo-700 dark:hover:bg-indigo-600',
        textPrimary: 'text-indigo-600 dark:text-indigo-400',
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
        borderLight: 'border-indigo-200 dark:border-indigo-800/60',
        ringFocus: 'focus:ring-indigo-500',
      };
  }
};
