import React from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../lib/content';
import type { ComparisonRow } from '../lib/types';
import { CheckCircle, Minus } from 'lucide-react';

interface ComparisonProps {
  onNavigate?: (idx: number) => void;
}

const Comparison: React.FC<ComparisonProps> = () => {
  return (
    <section 
      className="min-h-full flex flex-col justify-center px-4 md:px-6 relative py-16 md:py-20"
      aria-labelledby="comparison-title"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-12 pt-8 md:pt-0"
        >
          <h2 
            id="comparison-title" 
            className="text-xl md:text-2xl font-bold text-white mb-2 font-mono flex items-center gap-3"
          >
            <span className="w-2 h-6 md:h-8 bg-zyxo-green block shadow-[0_0_15px_#ccff00]" aria-hidden="true" />
            {CONTENT.comparison.title}
          </h2>
          <p className="text-gray-400 text-xs md:text-sm ml-5">{CONTENT.comparison.subtitle}</p>
        </motion.div>

        {/* Mobile View: Cards */}
        <div className="block lg:hidden space-y-3">
          {CONTENT.comparison.rows.map((row, index) => (
            <div
              key={index}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4"
            >
              <h3 className="text-xs font-mono text-white mb-3 pb-2 border-b border-white/10">
                {row.item}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-[10px] uppercase tracking-widest text-zyxo-blue font-bold">Starter</span>
                  <MobileStatusIcon status={row.a} isGreen={false} />
                </div>
                <div className="flex flex-col items-center gap-2 py-2 border-l border-white/10 bg-zyxo-green/5 rounded-r">
                  <span className="text-[10px] uppercase tracking-widest text-zyxo-green font-bold">Business</span>
                  <MobileStatusIcon status={row.b} isGreen={true} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
          {/* Business Column Highlight Glow - Behind table */}
          <div 
            className="absolute top-0 right-0 w-[30%] h-full bg-zyxo-green/5 blur-xl pointer-events-none" 
            aria-hidden="true"
          />
          
          <div className="overflow-x-auto">
            <table 
              className="w-full text-left border-collapse relative z-10 min-w-[600px]"
              role="table"
              aria-label="Feature comparison between Starter and Business plans"
            >
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th 
                    scope="col"
                    className="p-6 text-xs uppercase tracking-widest text-gray-500 font-normal w-1/2"
                  >
                    {CONTENT.comparison.headers[0]}
                  </th>
                  <th 
                    scope="col"
                    className="p-6 text-xs uppercase tracking-widest text-zyxo-blue font-bold text-center w-1/4 border-l border-white/10"
                  >
                    {CONTENT.comparison.headers[1]}
                  </th>
                  <th 
                    scope="col"
                    className="p-6 text-xs uppercase tracking-widest text-zyxo-green font-bold text-center w-1/4 border-l border-white/10 bg-zyxo-green/5"
                  >
                    {CONTENT.comparison.headers[2]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {CONTENT.comparison.rows.map((row, index) => (
                  <TableRow key={index} row={row} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TableRowProps {
  row: ComparisonRow;
  index: number;
}

const TableRow: React.FC<TableRowProps> = ({ row, index }) => {
  return (
    <motion.tr 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
    >
      <th 
        scope="row"
        className="p-6 text-sm text-gray-300 font-mono font-normal group-hover:text-white transition-colors"
      >
        {row.item}
      </th>
      <td className="p-6 text-center border-l border-white/10">
        <StatusIcon 
          status={row.a} 
          color="text-zyxo-blue" 
          shadow="shadow-[0_0_10px_#00f0ff]" 
          label={row.a ? `${row.item} included in Starter` : `${row.item} not included in Starter`}
        />
      </td>
      <td className="p-6 text-center border-l border-white/10 bg-zyxo-green/[0.02] group-hover:bg-zyxo-green/[0.05] transition-colors">
        <StatusIcon 
          status={row.b} 
          color="text-zyxo-green" 
          shadow="shadow-[0_0_10px_#ccff00]" 
          label={row.b ? `${row.item} included in Business` : `${row.item} not included in Business`}
        />
      </td>
    </motion.tr>
  );
};

// Simple mobile status icon without animations that might not trigger
const MobileStatusIcon: React.FC<{ status: boolean; isGreen: boolean }> = ({ status, isGreen }) => {
  if (status) {
    return (
      <div className={`rounded-full ${isGreen ? 'shadow-[0_0_10px_#ccff00]' : 'shadow-[0_0_10px_#00f0ff]'}`}>
        <CheckCircle className={`w-5 h-5 ${isGreen ? 'text-zyxo-green' : 'text-zyxo-blue'}`} />
      </div>
    );
  }
  return <Minus className="w-5 h-5 text-gray-600" />;
};

interface StatusIconProps {
  status: boolean;
  color: string;
  shadow: string;
  label: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, color, shadow, label }) => {
  if (status) {
    return (
      <motion.div 
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        className="flex justify-center"
        role="img"
        aria-label={label}
      >
        <div className={`rounded-full ${shadow}`}>
          <CheckCircle className={`w-5 h-5 ${color}`} />
        </div>
      </motion.div>
    );
  }
  return (
    <div 
      className="flex justify-center"
      role="img"
      aria-label={label}
    >
      <Minus className="w-5 h-5 text-gray-800" />
    </div>
  );
};

export default Comparison;
