'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Crown, Zap, Flame, BookOpen, Users, User,
  Trophy, Medal, Target, CheckCircle, X,
  ChevronRight, Settings, Edit
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RANK_LEVELS, getVisualConfig } from '@/lib/rbac';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideWelcomeModal', 'true');
    }
    onClose();
    router.push('/courses');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-fade-in">
        <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 shadow-2xl shadow-blue-500/20">
          {/* Header Image */}
          <div className="h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55?w=800')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
            
            {/* Decorative */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl" />
            
            {/* Icon */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-12 p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Dobrodošao u zajednicu! 👋
            </h2>
            
            <p className="text-dark-400 mb-6">
              Ovde smo svi istomišljenici koji žele da promene svoj život na bolje. 
              Spreman si da započneš svoju priču?
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-dark-700/50 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-dark-400">Kursevi</p>
              </div>
              <div className="p-3 bg-dark-700/50 rounded-xl">
                <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-dark-400">Zajednica</p>
              </div>
              <div className="p-3 bg-dark-700/50 rounded-xl">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-xs text-dark-400">Napredak</p>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center justify-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-blue-500"
              />
              <span className="text-sm text-dark-400">Ne prikazuj ponovo</span>
            </label>

            {/* CTA Button */}
            <button
              onClick={handleStart}
              className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center justify-center gap-2">
                Započni put Uspeha
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-dark-800/50 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-dark-400" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
