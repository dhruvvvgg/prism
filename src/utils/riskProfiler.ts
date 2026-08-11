import { RiskProfile } from '../types';

export interface RiskQuestion {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    points: number;
  }[];
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 'horizon',
    title: '1. Investment Time Horizon',
    subtitle: 'When do you anticipate needing access to these invested funds?',
    options: [
      { label: '< 2 Years', description: 'Immediate capital preservation & liquidity needs', points: 1 },
      { label: '2 - 5 Years', description: 'Near-retirement / steady income distribution phase', points: 2 },
      { label: '5 - 10 Years', description: 'Medium-term wealth building with moderate lock-in', points: 3 },
      { label: '10+ Years', description: 'Long-term aggressive compounding & capital growth', points: 4 },
    ],
  },
  {
    id: 'lossTolerance',
    title: '2. Comfort with Portfolio Volatility & Drawdowns',
    subtitle: 'How would you react if your portfolio dropped temporary during market stress?',
    options: [
      { label: 'Minimal Loss Tolerance', description: 'Cannot tolerate loss; seek guaranteed capital return', points: 1 },
      { label: 'Moderate (5% - 10% Drop)', description: 'Accept minor temporary fluctuations for steady yield', points: 2 },
      { label: 'High (10% - 20% Drop)', description: 'Accept market swings for long-term growth potential', points: 3 },
      { label: 'Very High (> 25% Volatility)', description: 'Comfortable with sharp swings to maximize total returns', points: 4 },
    ],
  },
  {
    id: 'incomeGoal',
    title: '3. Primary Financial Goal & Income Stability',
    subtitle: 'What is your primary mandate for this alternative asset allocation?',
    options: [
      { label: 'Capital Preservation & Pension', description: 'Depend on fixed salary/pension for daily living', points: 1 },
      { label: 'Inflation-Protected Yield', description: 'Desire reliable quarterly cash flows above inflation', points: 2 },
      { label: 'Balanced Yield & Growth', description: 'Mix of regular dividends and capital growth', points: 3 },
      { label: 'Maximum Capital Growth', description: 'High business income; reinvesting payouts for growth', points: 4 },
    ],
  },
  {
    id: 'experience',
    title: '4. Alternative Investment Experience',
    subtitle: 'How familiar are you with Indian alternative security structures?',
    options: [
      { label: 'Beginner', description: 'Primarily hold Bank FDs, Savings, & Sovereign Bonds', points: 1 },
      { label: 'Intermediate', description: 'Familiar with Mutual Funds, G-Secs, & Debt ETFs', points: 2 },
      { label: 'Advanced', description: 'Hold REITs, InvITs, Corporate Bonds, & Equities', points: 3 },
      { label: 'Expert', description: 'Active in Private Credit, InvITs, & Multi-Asset Arbitrage', points: 4 },
    ],
  },
];

export const PRESET_PERSONA_ANSWERS: Record<'Rajesh' | 'Ananya', Record<string, number>> = {
  Rajesh: {
    horizon: 1, // 2 - 5 Years (2 pts)
    lossTolerance: 0, // Minimal Loss (1 pt)
    incomeGoal: 0, // Capital Preservation (1 pt)
    experience: 1, // Intermediate (2 pts)
  },
  Ananya: {
    horizon: 3, // 10+ Years (4 pts)
    lossTolerance: 3, // Very High (4 pts)
    incomeGoal: 3, // Max Capital Growth (4 pts)
    experience: 2, // Advanced (3 pts)
  },
};

export function calculateRiskProfile(answers: Record<string, number>): RiskProfile {
  let rawPoints = 0;
  let totalMax = 0;

  RISK_QUESTIONS.forEach((q) => {
    const selectedIdx = answers[q.id] ?? 0;
    const option = q.options[selectedIdx] || q.options[0];
    rawPoints += option.points;
    totalMax += 4;
  });

  // Scale 0 to 100
  const minPoints = RISK_QUESTIONS.length * 1;
  const maxPoints = totalMax;
  const score = Math.round(((rawPoints - minPoints) / (maxPoints - minPoints)) * 100);

  let category: 'Conservative' | 'Moderate' | 'Aggressive' = 'Conservative';
  if (score >= 65) {
    category = 'Aggressive';
  } else if (score >= 35) {
    category = 'Moderate';
  }

  const horizonOption = RISK_QUESTIONS[0].options[answers.horizon ?? 0] || RISK_QUESTIONS[0].options[0];
  const lossOption = RISK_QUESTIONS[1].options[answers.lossTolerance ?? 0] || RISK_QUESTIONS[1].options[0];
  const goalOption = RISK_QUESTIONS[2].options[answers.incomeGoal ?? 0] || RISK_QUESTIONS[2].options[0];
  const expOption = RISK_QUESTIONS[3].options[answers.experience ?? 0] || RISK_QUESTIONS[3].options[0];

  return {
    score,
    category,
    horizon: horizonOption.label,
    lossTolerance: lossOption.label,
    incomeStability: goalOption.label,
    experience: expOption.label,
    rawPoints,
    answers,
  };
}
