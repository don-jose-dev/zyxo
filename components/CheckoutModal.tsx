import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Shield, Lock } from 'lucide-react';
import { CONTENT } from '../lib/content';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName }) => {
  // Find the selected plan details
  const plan = CONTENT.pricing.packages.find(p => p.name === planName) || CONTENT.pricing.packages[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white">Order Summary</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-zyxo-green mb-1">{plan.name} Package</h4>
                  <p className="text-xs text-gray-400">{plan.timeline} Delivery</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{plan.currency}{plan.price}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{plan.suffix}</div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest">Includes:</div>
                {plan.features.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-zyxo-green" />
                    <span>{feat}</span>
                  </div>
                ))}
                <div className="text-xs text-gray-500 italic mt-2">+ {plan.features.length - 3} more features</div>
              </div>

              {/* Secure Badge */}
              <div className="flex items-center gap-2 text-xs text-gray-500 justify-center bg-green-900/10 py-2 rounded border border-green-900/30">
                <Lock size={12} className="text-zyxo-green" />
                <span>Secure SSL Encryption</span>
                <span className="mx-1">•</span>
                <Shield size={12} className="text-zyxo-green" />
                <span>Money Back Guarantee</span>
              </div>

              {/* Action Button */}
              <button 
                className="w-full py-4 bg-zyxo-green text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                onClick={() => {
                  // This is where Paddle integration will go
                  alert("Paddle integration coming soon! For now, please contact us.");
                }}
              >
                Proceed to Secure Checkout
              </button>
              
              <p className="text-[10px] text-center text-gray-600">
                By proceeding, you agree to our <a href="/terms.html" className="underline hover:text-white">Terms</a> and <a href="/privacy.html" className="underline hover:text-white">Privacy Policy</a>.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
