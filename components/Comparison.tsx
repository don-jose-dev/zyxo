import React from 'react';
import { motion } from 'framer-motion';
import { CONTENT } from '../lib/content';
import { CheckCircle, Minus } from 'lucide-react';

const Comparison = () => {
  return (
    <section className="min-h-full flex flex-col justify-center px-6 relative py-20">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
            <h2 className="text-2xl font-bold text-white mb-2 font-mono flex items-center gap-3">
                <span className="w-2 h-8 bg-zyxo-green block shadow-[0_0_15px_#ccff00]"></span>
                {CONTENT.comparison.title}
            </h2>
            <p className="text-gray-400 text-sm ml-5">{CONTENT.comparison.subtitle}</p>
        </motion.div>

        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
            {/* Business Column Highlight Glow - Behind table */}
            <div className="absolute top-0 right-0 w-[30%] h-full bg-zyxo-green/5 blur-xl pointer-events-none" />
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse relative z-10 min-w-[600px]">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="p-6 text-xs uppercase tracking-widest text-gray-500 font-normal w-1/2">
                                {CONTENT.comparison.headers[0]}
                            </th>
                            <th className="p-6 text-xs uppercase tracking-widest text-zyxo-blue font-bold text-center w-1/4 border-l border-white/10">
                                {CONTENT.comparison.headers[1]}
                            </th>
                            <th className="p-6 text-xs uppercase tracking-widest text-zyxo-green font-bold text-center w-1/4 border-l border-white/10 bg-zyxo-green/5">
                                {CONTENT.comparison.headers[2]}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {CONTENT.comparison.rows.map((row: any, index: number) => (
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

const TableRow = ({ row, index }: { row: any; index: number }) => {
    return (
        <motion.tr 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
        >
            <td className="p-6 text-sm text-gray-300 font-mono group-hover:text-white transition-colors">
                {row.item}
            </td>
            <td className="p-6 text-center border-l border-white/10">
                <StatusIcon status={row.a} color="text-zyxo-blue" shadow="shadow-[0_0_10px_#00f0ff]" />
            </td>
            <td className="p-6 text-center border-l border-white/10 bg-zyxo-green/[0.02] group-hover:bg-zyxo-green/[0.05] transition-colors">
                <StatusIcon status={row.b} color="text-zyxo-green" shadow="shadow-[0_0_10px_#ccff00]" />
            </td>
        </motion.tr>
    )
}

const StatusIcon = ({ status, color, shadow }: { status: boolean; color: string; shadow: string }) => {
    if (status) {
        return (
            <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                className="flex justify-center"
            >
                <div className={`rounded-full ${shadow}`}>
                    <CheckCircle className={`w-5 h-5 ${color}`} />
                </div>
            </motion.div>
        );
    }
    return (
        <div className="flex justify-center">
            <Minus className="w-5 h-5 text-gray-800" />
        </div>
    );
}

export default Comparison;