import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-white/[0.05] rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function TicketSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex flex-col items-start md:items-end w-full md:w-auto">
        <Skeleton className="h-8 w-28 mb-4" />
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>
    </div>
  );
}

export function ConnectionSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-8">
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
      <Skeleton className="h-14 w-full rounded-full" />
    </div>
  );
}

export function ProjectSkeleton() {
  return (
    <div className="backdrop-blur-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.05] rounded-3xl overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-8 flex flex-col flex-1">
        <Skeleton className="h-6 w-28 mb-6 rounded-full" />
        <Skeleton className="h-7 w-48 mb-3" />
        <Skeleton className="h-16 w-full mb-8" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6">
          <Icon size={28} className="text-white/30" />
        </div>
      )}
      <h3 className="text-xl font-bold text-white/70 mb-2">{title}</h3>
      <p className="text-white/50 text-sm max-w-sm">{description}</p>
    </motion.div>
  );
}
