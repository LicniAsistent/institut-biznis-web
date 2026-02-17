'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { 
  TrendingUp, CheckCircle, Clock, AlertTriangle, Award,
  ChevronDown, ChevronUp, Info, Send
} from 'lucide-react';
import { 
  AUTO_PROMOTION_RULES, 
  type AutoPromotionRule,
  checkAutoPromotionEligibility,
  getVisualConfig,
  getAllPermissions
} from '@/lib/rbac';
import { useAuth } from '@/context/AuthContext';

interface AutoPromotionProps {
  userStats: {
    daysActive: number;
    qualityPosts: number;
    recommendations: number;
    warnings: number;
    currentRank: number;
    totalPosts?: number;
    totalComments?: number;
    streakDays?: number;
  };
}

export function AutoPromotionEngine({ userStats }: AutoPromotionProps) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [requestedRoles, setRequestedRoles] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const handleRequestRole = (rule: AutoPromotionRule) => {
    // In real app: send API request to admin
    console.log(`Requesting role: ${rule.targetRole}`);
    setRequestedRoles(prev => new Set([...prev, rule.id]));
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
      <CardHeader>
        <h3 className="font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Auto-Promotion Engine
        </h3>
        <p className="text-sm text-dark-400">Automatsko praćenje aktivnosti i predlozi za uloge</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {AUTO_PROMOTION_RULES.map((rule) => {
            const { eligible, progress } = checkAutoPromotionEligibility(userStats, rule);
            const visual = getVisualConfig(rule.targetRole);
            
            return (
              <div 
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  eligible 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-dark-700 border-dark-600'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                >
                  <div className="flex items-center gap-3">
                    {eligible ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-dark-400" />
                    )}
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {visual.icon} {visual.name}
                      </p>
                      <p className="text-xs text-dark-400">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {eligible ? (
                      requestedRoles.has(rule.id) ? (
                        <span className="text-sm text-blue-400">Poslato!</span>
                      ) : (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestRole(rule);
                          }}
                          variant="primary" 
                          size="sm"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Zatraži
                        </Button>
                      )
                    ) : (
                      <span className={`text-sm font-medium ${eligible ? 'text-green-400' : 'text-dark-400'}`}>
                        {Math.round(Math.max(...Object.values(progress)) || 0)}%
                      </span>
                    )}
                    {expandedRule === rule.id ? (
                      <ChevronUp className="w-4 h-4 text-dark-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-dark-400" />
                    )}
                  </div>
                </div>

                {expandedRule === rule.id && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <p className="text-sm font-bold mb-3">Kriterijumi:</p>
                    <div className="space-y-2">
                      {rule.conditions.minDaysActive && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-dark-300">Dana aktivnosti: {userStats.daysActive}/{rule.conditions.minDaysActive}</span>
                          <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${progress.daysActive || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {rule.conditions.minQualityPosts && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-dark-300">Kvalitetnih postova: {userStats.qualityPosts || userStats.totalPosts || 0}/{rule.conditions.minQualityPosts}</span>
                          <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${progress.qualityPosts || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {rule.conditions.minRecommendations && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-dark-300">Preporuke: {userStats.recommendations}/{rule.conditions.minRecommendations}</span>
                          <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${progress.recommendations || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {rule.conditions.minRank && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-dark-300">Rang: {userStats.currentRank}/{rule.conditions.minRank}</span>
                          <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gold-500 rounded-full"
                              style={{ width: `${progress.rank || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {rule.conditions.maxWarnings !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-dark-300">Opomene: {userStats.warnings}/{rule.conditions.maxWarnings}</span>
                          <div className="w-20 h-2 bg-dark-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                userStats.warnings <= rule.conditions.maxWarnings ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${progress.warnings || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {eligible && (
                      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-400 font-medium flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Ispunjavate uslove! Pošaljite zahtev za ovu ulogu.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="font-bold text-blue-400">Kako funkcioniše?</p>
              <p className="text-sm text-dark-300 mt-1">
                Sistem automatski prati vašu aktivnost. Kada ispunite kriterijume za neku ulogu, 
                možete poslati zahtev. Admin tim će pregledati i odobriti.
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AutoPromotionEngine;