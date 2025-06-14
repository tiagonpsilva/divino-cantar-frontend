import { cn } from '../lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-neutral-800 rounded-2xl shadow dark:shadow-none border border-gray-200 dark:border-neutral-700 p-6',
      hover && 'hover:shadow-md dark:hover:shadow-none dark:hover:bg-neutral-700/50 transition-all duration-200',
      className
    )}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-700 dark:text-neutral-100', className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={cn('text-neutral-600 dark:text-neutral-400', className)}>
      {children}
    </div>
  );
}