import React from 'react';
import { type Spark } from '../types';
import SparkleIcon from './icons/SparkleIcon';
import HandoffIcon from './icons/HandoffIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';
import BuildIcon from './icons/BuildIcon';
import { DOMAINS } from '../constants';


interface SparkCardProps {
  spark: Spark;
  onClick: () => void;
  currentDomainId: 'alpha' | 'bravo';
}

type StatusDisplay = {
    text: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    animate?: string;
};

const SparkStatus: React.FC<{ status: Spark['status'] }> = ({ status }) => {
    const statusMap: Record<Spark['status'], StatusDisplay> = {
        unconfigured: { text: 'Unconfigured', icon: BuildIcon, color: 'text-slate-400' },
        configured: { text: 'Configured', icon: BuildIcon, color: 'text-blue-400' },
        building: { text: 'Building', icon: ArrowPathIcon, color: 'text-yellow-400', animate: 'animate-spin' },
        built: { text: 'Built', icon: CheckCircleIcon, color: 'text-green-400' },
        error: { text: 'Error', icon: SparkleIcon, color: 'text-red-400' }
    };

    const currentStatus = statusMap[status || 'unconfigured'];
    const Icon = currentStatus.icon;

    return (
        <div className={`text-xs font-semibold flex items-center gap-1.5 ${currentStatus.color}`}>
            <Icon className={`w-3.5 h-3.5 ${currentStatus.animate || ''}`} />
            <span>{currentStatus.text}</span>
        </div>
    )
}

const SparkCard: React.FC<SparkCardProps> = ({ spark, onClick, currentDomainId }) => {
  const lastResponse = spark.history?.slice().reverse().find(msg => msg.role === 'model')?.content || 'A new idea waiting to ignite...';
  const isFromOtherDomain = spark.origin && spark.origin.domainId !== currentDomainId;
  
  const originDomainId = spark.origin?.domainId;
  const badgeColor = originDomainId === 'alpha' ? 'bg-red-500/30 text-red-300' : 'bg-teal-500/30 text-teal-300';

  return (
    <div
      onClick={onClick}
      className="bg-slate-900/70 p-3 rounded-md cursor-pointer border border-red-900/40 hover:border-red-700/80 transition-all duration-200 shadow-[0_0_8px_rgba(255,255,255,0.08)] hover:shadow-[0_0_16px_rgba(255,255,255,0.12)] relative flex flex-col gap-2"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
            <SparkleIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <h3 className="font-semibold text-slate-200 truncate pr-4">{spark.title || 'Untitled Spark'}</h3>
        </div>
        {isFromOtherDomain && originDomainId && (
            <div title={`From ${DOMAINS[originDomainId].name}`} className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${badgeColor} flex-shrink-0`}>
                <HandoffIcon className="w-3 h-3"/>
                {DOMAINS[originDomainId].name.split(' ')[0]}
            </div>
        )}
      </div>
      <p className="text-sm text-slate-400 line-clamp-2">
        {lastResponse}
      </p>
      <div className="mt-auto pt-2 border-t border-slate-700/50">
          <SparkStatus status={spark.status} />
      </div>
    </div>
  );
};

export default SparkCard;