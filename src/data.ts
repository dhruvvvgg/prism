import { Instrument, PortfolioAsset, HoldingDetail, Persona } from './types';

export const mockPortfolioAssets: PortfolioAsset[] = [
  {
    name: 'Equities & Mutual Funds',
    value: 812300,
    percentage: 56.8,
    change24h: 1.25,
    icon: 'TrendingUp',
    count: 14
  },
  {
    name: 'REITs (Real Estate)',
    value: 250000,
    percentage: 17.5,
    change24h: 0.45,
    icon: 'Building2',
    count: 2
  },
  {
    name: 'InvITs (Infrastructure)',
    value: 180000,
    percentage: 12.6,
    change24h: -0.22,
    icon: 'Radio',
    count: 1
  },
  {
    name: 'Corporate Bonds (Debt)',
    value: 110000,
    percentage: 7.7,
    change24h: 0.05,
    icon: 'ShieldAlert',
    count: 3
  },
  {
    name: 'Sovereign Gold Bonds',
    value: 76150,
    percentage: 5.4,
    change24h: 0.88,
    icon: 'Coins',
    count: 2
  }
];

export const mockTotalValue = 1428450;
export const mockTotalChange24h = 0.82;

export const instrumentsData: Instrument[] = [
  {
    id: 'reits',
    name: 'Real Estate Investment Trusts',
    shortName: 'REITs',
    tagline: 'Commercial Real Estate ownership without buying physical property.',
    description: 'REITs pool investor money to buy, operate, and manage income-generating commercial properties (like office parks, malls, warehouses). They are legally mandated to distribute at least 90% of their net distributable cash flows to investors.',
    riskLevel: 'Moderate',
    riskLabel: 'Moderate (Subject to vacancy rates and property value cycles)',
    taxTreatment: 'Dividends might be taxable or exempt depending on the trust\'s tax election. Interest is fully taxable. Capital gains standard.',
    taxLabel: 'Partially Exempt / Dependent on Trust structure (Sec 115UA)',
    yieldPotential: '6.5% - 8.5% (Dividend yield) + Capital appreciation',
    minInvestment: '₹300 - ₹500',
    liquidity: 'Moderate (Exchange-traded, volume dependent)',
    governanceScore: 85,
    governanceMetrics: {
      boardIndependence: 67,
      boardIndependenceCitation: 'Source: Embassy Office Parks REIT FY24 Annual Report, Corporate Governance Section, p.142',
      regulatoryTrackRecordScore: 95,
      regulatoryTrackRecordDetails: '0 active SEBI show-cause notices; 1 administrative delay in quarterly disclosure in Q2 FY23, resolved in 24 hours.',
      regulatoryTrackRecordCitation: 'Source: SEBI SCORES Compliances Portal & NSE Disclosure Logs, Trailing 24 Months',
      distributionConsistencyScore: 98,
      distributionConsistencyDetails: '16 consecutive quarters of timely payouts. Distribution timing variance is < 1.5 days from target announcement date.',
      distributionConsistencyCitation: 'Source: Trust Deed Audits & Cash Flow Apportionment Reports, Note 8, Q4 FY24 filings',
      weights: {
        boardIndependence: 40,
        regulatoryTrackRecord: 30,
        distributionConsistency: 30
      }
    },
    suitabilityInsights: {
      income: 'Highly suitable if your goal is regular passive income. REITs must distribute 90% of cash flows, making them an excellent alternative to physical rental property.',
      inflation: 'Excellent inflation protection since commercial lease rents are often linked to CPI escalations (typically 12-15% escalation every 3 years).',
      growth: 'Moderate capital growth. Properties appreciate, but because 90% of cash is distributed, reinvestment and compounding inside the trust is limited.',
      citation: 'Grounding: AMFI Alternative Investments Playbook 2024, Section 3.2, p.45'
    }
  },
  {
    id: 'invits',
    name: 'Infrastructure Investment Trusts',
    shortName: 'InvITs',
    tagline: 'Yield-generating infrastructure assets like toll roads and power grids.',
    description: 'InvITs operate like mutual funds but invest in cash-flowing infrastructure projects like highways, power transmission lines, and telecom towers. They provide stable long-term cash distributions.',
    riskLevel: 'High',
    riskLabel: 'High (Subject to traffic/usage levels and long-term concessions)',
    taxTreatment: 'Distribution components (interest, dividend, capital repayment) are taxed differently depending on the trust\'s structural choices.',
    taxLabel: 'Component-wise taxation (Interest taxable, Dividend depends on Trust tax election)',
    yieldPotential: '8.5% - 11.0% (Higher yield to offset longer asset depletion times)',
    minInvestment: '₹500 - ₹1,000',
    liquidity: 'Low to Moderate',
    governanceScore: 75,
    governanceMetrics: {
      boardIndependence: 50,
      boardIndependenceCitation: 'Source: PowerGrid InvIT FY24 Annual Governance Disclosure, Board Composition, p.78',
      regulatoryTrackRecordScore: 90,
      regulatoryTrackRecordDetails: '0 active show-cause notices; no delayed disclosures. Satisfies all SEBI leverage norms (<70% debt-to-asset ratio).',
      regulatoryTrackRecordCitation: 'Source: BSE Corporate Filings Tracker, Trailing 24 Months Compliance Report',
      distributionConsistencyScore: 94,
      distributionConsistencyDetails: '8 consecutive bi-annual payouts met. Maximum distribution timing variance of 4 days across trailing cycles.',
      distributionConsistencyCitation: 'Source: Trustee Distribution Certificates, FY21-FY24 Audited Financials, Note 4',
      weights: {
        boardIndependence: 40,
        regulatoryTrackRecord: 30,
        distributionConsistency: 30
      }
    },
    suitabilityInsights: {
      income: 'Strong fit for regular cash flows. InvIT payouts are higher than REITs on average, though assets (like highways) have a finite concession life.',
      inflation: 'Good inflation hedge if toll-rates are linked to inflation indexes, but power transmission tariffs are fixed, offering weaker inflation correlation.',
      growth: 'Low capital growth. Infrastructure assets deplete in value over their lease/concession life, meaning capital return is bundled into distributions.',
      citation: 'Grounding: SEBI InvIT Regulations Guide, Chapter II, Clause 18 (Distribution Framework)'
    }
  },
  {
    id: 'bonds',
    name: 'High-Yield Corporate Bonds',
    shortName: 'Corporate Bonds',
    tagline: 'Fixed-interest debt instruments issued by verified private corporations.',
    description: 'Senior or subordinated debt issued by companies to fund expansion. They offer higher interest rates than Government Securities but carry credit risk (default risk).',
    riskLevel: 'High',
    riskLabel: 'High (Credit risk depending on rating, e.g., A to BBB-)',
    taxTreatment: 'Interest is added to your income and taxed at your normal slab rate. Capital gains on sale are taxed based on holding period.',
    taxLabel: 'Fully Taxable at normal slab rates (STCG/LTCG as per holding period)',
    yieldPotential: '9.0% - 12.0% (Depending on credit ratings)',
    minInvestment: '₹10,000',
    liquidity: 'Low (Secondary market trading can be highly illiquid)',
    governanceScore: 68,
    governanceMetrics: {
      boardIndependence: 45,
      boardIndependenceCitation: 'Source: Debenture Trustee quarterly report, Axis Trustee Services, Q2 FY25',
      regulatoryTrackRecordScore: 80,
      regulatoryTrackRecordDetails: '1 minor delayed disclosure in FY23 regarding promoter pledge; resolved. Rating downgraded by 1 notch in trailing 18 months.',
      regulatoryTrackRecordCitation: 'Source: NSE Corporate Announcement Ledger & CRISIL Rating Action Release (May 2024)',
      distributionConsistencyScore: 85,
      distributionConsistencyDetails: 'Interest payments made on-time; 1 grace-period activation in 2022 for a sub-entity. No defaults.',
      distributionConsistencyCitation: 'Source: CRISIL Credit Bulletin & Company FY24 Disclosures, Debt Serviceability Section',
      weights: {
        boardIndependence: 40,
        regulatoryTrackRecord: 30,
        distributionConsistency: 30
      }
    },
    suitabilityInsights: {
      income: 'Suited for investors looking for fixed monthly/quarterly interest. Ensure you diversify across multiple issuers to mitigate credit default risk.',
      inflation: 'Poor inflation protection. Fixed-interest payouts do not adjust upward if inflation rises, meaning real purchasing power can decrease.',
      growth: 'No capital growth. Bonds repay face value at maturity. Your return comes entirely from interest coupons.',
      citation: 'Grounding: SEBI Debt Securities Regulations, Section 4 (Disclosures and Credit Covenants)'
    }
  },
  {
    id: 'etfs',
    name: 'Debt ETFs & Bharat Bond ETFs',
    shortName: 'Debt ETFs',
    tagline: 'Diversified baskets of public sector and government bonds traded on exchanges.',
    description: 'Exchange-Traded Funds tracking a debt index (like AAA-rated public sector bonds or government papers). They offer index-like safety, low cost, and high transparency.',
    riskLevel: 'Low',
    riskLabel: 'Low (Highly rated state-backed and AAA debt)',
    taxTreatment: 'Taxed at slab rates since April 2023. No indexation benefits apply to new purchases.',
    taxLabel: 'Taxable at slab rates (Debt mutual fund rules, Finance Act 2023)',
    yieldPotential: '6.8% - 7.5% (Tied to public sector bond yields)',
    minInvestment: '₹1,000',
    liquidity: 'High (Market makers provide continuous liquidity)',
    governanceScore: 90,
    governanceMetrics: {
      boardIndependence: 80,
      boardIndependenceCitation: 'Source: Edelweiss AMC Board Composition Disclosure, Q3 FY25',
      regulatoryTrackRecordScore: 98,
      regulatoryTrackRecordDetails: 'Perfect compliance record; no regulatory warnings or delayed filings. Strict SEBI investment limit adherence.',
      regulatoryTrackRecordCitation: 'Source: SEBI AMC Audit & Compliance Bulletin, Dec 2024',
      distributionConsistencyScore: 95,
      distributionConsistencyDetails: 'Returns are reflected in Net Asset Value (NAV). Accrued interest re-invested daily with 100% compliance.',
      distributionConsistencyCitation: 'Source: Scheme Information Document (SID), Bharat Bond ETF, Asset Allocation, p.42',
      weights: {
        boardIndependence: 40,
        regulatoryTrackRecord: 30,
        distributionConsistency: 30
      }
    },
    suitabilityInsights: {
      income: 'Moderate fit. These are typically growth-option ETFs where returns accrue to the NAV, though they can be liquidated instantly for cash.',
      inflation: 'Moderate inflation hedge. While yields adjust as new bonds are bought, a rapid inflation spike causes short-term bond price drops (duration risk).',
      growth: 'Steady compounding. Ideal for low-risk capital preservation where safety and liquidity are paramount.',
      citation: 'Grounding: AMFI Debt Fund Product Note, Revision April 2023'
    }
  },
  {
    id: 'gold',
    name: 'Sovereign Gold Bonds (SGB)',
    shortName: 'SGB / Gold',
    tagline: 'Gold investments backed by Government of India with 2.5% assured interest.',
    description: 'SGBs are government securities denominated in grams of gold. They are a substitute for holding physical gold. Investors pay the issue price and bonds are redeemed in cash on maturity.',
    riskLevel: 'Low',
    riskLabel: 'Low (Sovereign backing, though market gold prices fluctuate)',
    taxTreatment: 'Capital gains tax is completely exempt if held until maturity (8 years). Interest of 2.5% is taxable at slab rates.',
    taxLabel: 'Capital Gains Exempt at Maturity (Sec 47(viib) of Income Tax Act)',
    yieldPotential: 'Gold price return + 2.5% fixed interest per annum',
    minInvestment: '1 gram of Gold (~₹7,500)',
    liquidity: 'Moderate (Traded on exchanges, but volumes can be low before 8-year maturity)',
    governanceScore: 98,
    governanceMetrics: {
      boardIndependence: 95,
      boardIndependenceCitation: 'Source: Reserve Bank of India Governing Board Disclosures, Institutional Governance Report',
      regulatoryTrackRecordScore: 100,
      regulatoryTrackRecordDetails: 'Issued by Reserve Bank of India on behalf of Government of India. Perfect regulatory backing and execution history.',
      regulatoryTrackRecordCitation: 'Source: RBI SGB Issuance Notification Series FY24-25',
      distributionConsistencyScore: 100,
      distributionConsistencyDetails: 'Interest credited exactly every 6 months without a single day\'s delay directly to registered bank accounts.',
      distributionConsistencyCitation: 'Source: RBI Public Debt Office Ledger, Sovereign Debt Service Records',
      weights: {
        boardIndependence: 40,
        regulatoryTrackRecord: 30,
        distributionConsistency: 30
      }
    },
    suitabilityInsights: {
      income: 'Low fit for active income. The 2.5% fixed interest is a nice bonus, but gold is primarily an inflation-hedging asset, not an income generator.',
      inflation: 'Outstanding inflation hedge. Gold has historically preserved purchasing power over decades and acts as a safe haven during market crises.',
      growth: 'Tied directly to global gold prices. Fits a conservative long-term wealth preservation goal.',
      citation: 'Grounding: Reserve Bank of India SGB FAQ, Question 14 (Taxation and Sovereign Guarantees)'
    }
  },
  {
    id: 'gsecs',
    name: 'Government Securities (G-Secs)',
    shortName: 'G-Secs',
    tagline: 'Direct investment in central/state government debt. Maximum safety.',
    description: 'G-Secs are debt instruments issued by the Central Government or State Governments (State Development Loans - SDLs) to finance deficits. They carry absolute zero credit risk.',
    riskLevel: 'Low',
    riskLabel: 'Sovereign (No credit risk; subject only to interest rate volatility)',
    taxTreatment: 'Interest is added to your income and taxed at slab rates. No TDS is deducted at source.',
    taxLabel: 'Taxable at slab rates (No TDS applied on interest payouts)',
    yieldPotential: '7.0% - 7.5% (Tied to sovereign yield curve)',
    minInvestment: '₹10,000',
    liquidity: 'Moderate to High (via RBI Retail Direct or exchange brokers)',
    governanceScore: 96,
    governanceMetrics: {
      boardIndependence: 90,
      boardIndependenceCitation: 'Source: RBI Governance Framework and Fiscal Responsibility Disclosures',
      regulatoryTrackRecordScore: 100,
      regulatoryTrackRecordDetails: 'Fully sovereign-backed, guaranteed by the Consolidated Fund of India. Zero defaults in India\'s history.',
      regulatoryTrackRecordCitation: 'Source: Government of India Union Budget, Public Debt Management Strategy Report',
      distributionConsistencyScore: 100,
      distributionConsistencyDetails: 'Semi-annual interest coupon payments made with absolute promptness on pre-determined fiscal dates.',
      distributionConsistencyCitation: 'Source: RBI Public Debt Office Registry & Central Debt Ledger',
      weights: {
        boardIndependence: 40,
        regulatoryTrackRecord: 30,
        distributionConsistency: 30
      }
    },
    suitabilityInsights: {
      income: 'Excellent fit for long-term secure income. Semi-annual coupons are highly predictable and safe.',
      inflation: 'Poor inflation protection if yields are locked in, but highly effective for preserving nominal capital value.',
      growth: 'Purely interest income-driven. No capital compounding inside the security; mature bonds return original face value.',
      citation: 'Grounding: RBI Retail Direct Portal, Product Specifications Guide 2024'
    }
  }
];

export const personasData: Persona[] = [
  {
    persona_name: "Rajesh",
    persona_tagline: "Conservative, income-focused, capital preservation near retirement",
    total_portfolio_value: 6000000,
    total_change_24h: 0.18,
    asset_allocation: [
      {
        name: "Government Securities",
        value: 2400000,
        percentage: 40,
        count: 2,
        change24h: 0.12,
        icon: "ShieldCheck"
      },
      {
        name: "Debt ETFs",
        value: 1200000,
        percentage: 20,
        count: 1,
        change24h: 0.05,
        icon: "Percent"
      },
      {
        name: "Equities & Mutual Funds",
        value: 900000,
        percentage: 15,
        count: 2,
        change24h: -0.45,
        icon: "TrendingUp"
      },
      {
        name: "Sovereign Gold Bonds",
        value: 900000,
        percentage: 15,
        count: 2,
        change24h: 0.85,
        icon: "Coins"
      },
      {
        name: "Corporate Bonds",
        value: 600000,
        percentage: 10,
        count: 1,
        change24h: 0.02,
        icon: "ShieldAlert"
      }
    ],
    holdings_detail: [
      {
        instrument_name: "7.18% GOI 2033",
        category: "Government Securities",
        value: 1400000,
        units_or_quantity: "14000 units"
      },
      {
        instrument_name: "7.26% GOI 2032",
        category: "Government Securities",
        value: 1000000,
        units_or_quantity: "10000 units"
      },
      {
        instrument_name: "Nippon India ETF Nifty 8-13 yr G-Sec",
        category: "Debt ETFs",
        value: 1200000,
        units_or_quantity: "52000 units"
      },
      {
        instrument_name: "SBI Bluechip Fund - Direct Growth",
        category: "Equities & Mutual Funds",
        value: 600000,
        units_or_quantity: "7500 units"
      },
      {
        instrument_name: "ITC Limited",
        category: "Equities & Mutual Funds",
        value: 300000,
        units_or_quantity: "650 shares"
      },
      {
        instrument_name: "SGB 2023-24 Series I",
        category: "Sovereign Gold Bonds",
        value: 500000,
        units_or_quantity: "80 grams"
      },
      {
        instrument_name: "SGB 2020-21 Series V",
        category: "Sovereign Gold Bonds",
        value: 400000,
        units_or_quantity: "85 grams"
      },
      {
        instrument_name: "8.50% REC Ltd 2028",
        category: "Corporate Bonds",
        value: 600000,
        units_or_quantity: "600 units"
      }
    ]
  },
  {
    persona_name: "Ananya",
    persona_tagline: "Growth-oriented, high risk tolerance, aggressive capital appreciation",
    total_portfolio_value: 1200000,
    total_change_24h: 1.05,
    asset_allocation: [
      {
        name: "Equities & Mutual Funds",
        value: 780000,
        percentage: 65,
        count: 4,
        change24h: 1.25,
        icon: "TrendingUp"
      },
      {
        name: "REITs (Real Estate)",
        value: 180000,
        percentage: 15,
        count: 2,
        change24h: 0.45,
        icon: "Building2"
      },
      {
        name: "InvITs (Infrastructure)",
        value: 180000,
        percentage: 15,
        count: 2,
        change24h: 0.30,
        icon: "Radio"
      },
      {
        name: "Debt ETFs",
        value: 60000,
        percentage: 5,
        count: 1,
        change24h: 0.08,
        icon: "Percent"
      }
    ],
    holdings_detail: [
      {
        instrument_name: "Parag Parikh Flexi Cap Fund - Direct Growth",
        category: "Equities & Mutual Funds",
        value: 300000,
        units_or_quantity: "4500 units"
      },
      {
        instrument_name: "Quant Small Cap Fund - Direct Plan",
        category: "Equities & Mutual Funds",
        value: 150000,
        units_or_quantity: "800 units"
      },
      {
        instrument_name: "HDFC Bank Ltd",
        category: "Equities & Mutual Funds",
        value: 180000,
        units_or_quantity: "110 shares"
      },
      {
        instrument_name: "Larsen & Toubro Ltd",
        category: "Equities & Mutual Funds",
        value: 150000,
        units_or_quantity: "42 shares"
      },
      {
        instrument_name: "Embassy Office Parks REIT",
        category: "REITs (Real Estate)",
        value: 100000,
        units_or_quantity: "285 units"
      },
      {
        instrument_name: "Mindspace Business Parks REIT",
        category: "REITs (Real Estate)",
        value: 80000,
        units_or_quantity: "250 units"
      },
      {
        instrument_name: "India Grid Trust (IndiGrid)",
        category: "InvITs (Infrastructure)",
        value: 100000,
        units_or_quantity: "720 units"
      },
      {
        instrument_name: "PowerGrid Infrastructure Investment Trust",
        category: "InvITs (Infrastructure)",
        value: 80000,
        units_or_quantity: "750 units"
      },
      {
        instrument_name: "Bharat Bond ETF - April 2030",
        category: "Debt ETFs",
        value: 60000,
        units_or_quantity: "50 units"
      }
    ]
  }
];
