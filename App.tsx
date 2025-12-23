import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Calculator, DollarSign, Calendar, Percent, RefreshCcw, ChevronDown, CheckCircle } from 'lucide-react';

import { CalculationInput, CalculationResult, CalculationType, PeriodType } from './types';
import { calculateCompoundInterest } from './utils/calculations';
import { formatCurrency, formatNumber } from './utils/formatters';
import { InfoSection } from './components/InfoSection';

const COLORS = ['#4a5568', '#1e40af']; // Gray (Invested), Blue (Interest)
const AREA_COLORS = {
  total: '#1e40af',   // Blue
  invested: '#1e293b', // Slate 800
  target: '#e2e8f0'    // Light Gray line
};

export default function App() {
  const [input, setInput] = useState<CalculationInput>({
    type: CalculationType.TIME_TO_MILLION,
    initialValue: 0,
    monthlyContribution: 500,
    targetYears: 10,
    interestRate: 10,
    ratePeriod: PeriodType.ANNUAL
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Auto calculate on load or simulate an initial calculation
  useEffect(() => {
    // Optional: Pre-calculate with defaults? 
    // Let's wait for user action to keep it clean, or run once.
    // handleCalculate(); 
  }, []);

  const handleCalculate = () => {
    const res = calculateCompoundInterest(input);
    setResult(res);
    
    // Scroll to results
    setTimeout(() => {
      const element = document.getElementById('results-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClear = () => {
    setInput({
      ...input,
      initialValue: 0,
      monthlyContribution: 0,
      targetYears: 0,
      interestRate: 0
    });
    setResult(null);
  };

  const chartData = result ? [
    { name: 'Valor Investido', value: result.totalInvested },
    { name: 'Total em Juros', value: result.totalInterest },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-900 p-2 rounded-lg text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              <span className="text-blue-900">Calculadora para Nossos Filhos - AJF</span>
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Planejamento Financeiro para o Futuro
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              Calculadora para o Futuro - AJF
            </h2>
          </div>
          
          <div className="p-6 md:p-8 grid gap-8">
            
            {/* Row 1: Type & Initial Value */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tipo de Cálculo</label>
                <div className="relative">
                  <select 
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none appearance-none transition-all font-medium text-slate-700"
                    value={input.type}
                    onChange={(e) => {
                      setInput({...input, type: e.target.value as CalculationType});
                      setResult(null);
                    }}
                  >
                    <option value={CalculationType.TIME_TO_MILLION}>Calcular prazo para atingir R$ 1 milhão</option>
                    <option value={CalculationType.CONTRIBUTION_NEEDED}>Calcular aporte mensal necessário</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Valor inicial (R$)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                  <input 
                    type="number"
                    min="0"
                    step="100"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                    placeholder="0,00"
                    value={input.initialValue || ''}
                    onChange={(e) => setInput({...input, initialValue: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Variable Input (Contribution or Time) & Interest Rate */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {input.type === CalculationType.TIME_TO_MILLION ? (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-sm font-semibold text-slate-700">Aporte mensal (R$)</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                    <input 
                      type="number"
                      min="0"
                      step="100"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                      placeholder="0,00"
                      value={input.monthlyContribution || ''}
                      onChange={(e) => setInput({...input, monthlyContribution: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-sm font-semibold text-slate-700">Prazo (Anos)</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-900 transition-colors" />
                    <input 
                      type="number"
                      min="1"
                      step="1"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                      placeholder="Anos"
                      value={input.targetYears || ''}
                      onChange={(e) => setInput({...input, targetYears: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Taxa de Juros (%)</label>
                <div className="flex rounded-lg shadow-sm">
                  <div className="relative flex-grow">
                    <Percent className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300 z-10 relative"
                      placeholder="0.00"
                      value={input.interestRate || ''}
                      onChange={(e) => setInput({...input, interestRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <select 
                    className="bg-slate-100 border border-l-0 border-slate-300 text-slate-700 text-sm font-medium px-4 py-3 rounded-r-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-colors"
                    value={input.ratePeriod}
                    onChange={(e) => setInput({...input, ratePeriod: e.target.value as PeriodType})}
                  >
                    <option value={PeriodType.ANNUAL}>Anual</option>
                    <option value={PeriodType.MONTHLY}>Mensal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button 
                onClick={handleCalculate}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calcular Resultado
              </button>

              <button 
                onClick={handleClear}
                className="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center gap-1.5 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Limpar campos
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div id="results-section" className="space-y-8 animate-fadeIn">
            
            {/* Hero Message Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8 text-center shadow-sm relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
               
               <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 relative z-10">
                 {input.type === CalculationType.CONTRIBUTION_NEEDED 
                    ? <span className="text-blue-900">{formatCurrency(result.requiredMonthlyContribution || 0)} mensais</span>
                    : <span className="text-blue-900">{Math.floor(result.totalMonths / 12)} anos e {result.totalMonths % 12} meses</span>
                 }
               </h3>
               <p className="text-slate-600 font-medium relative z-10">{result.message}</p>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg shadow-blue-900/20 transform hover:scale-[1.02] transition-transform">
                <div className="text-blue-200 text-sm font-medium mb-1 uppercase tracking-wide">Valor Total Final</div>
                <div className="text-3xl font-bold">{formatCurrency(result.finalAmount)}</div>
                <div className="mt-4 text-xs text-blue-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Meta atingida
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">Total Investido</div>
                <div className="text-2xl font-bold text-slate-800">{formatCurrency(result.totalInvested)}</div>
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-600 rounded-full" style={{ width: `${(result.totalInvested / result.finalAmount) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">Total em Juros</div>
                <div className="text-2xl font-bold text-slate-800">{formatCurrency(result.totalInterest)}</div>
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-800 rounded-full" style={{ width: `${(result.totalInterest / result.finalAmount) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Charts & Details Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-blue-900">Composição e Evolução</h3>
              </div>
              
              <div className="p-6 grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Pie Chart */}
                <div className="flex flex-col items-center">
                  <div className="h-64 w-full max-w-xs relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                           formatter={(value: number) => formatCurrency(value)}
                           contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text in Donut */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <span className="block text-xs text-slate-400 font-bold uppercase">Rentabilidade</span>
                        <span className="block text-xl font-bold text-blue-900">
                          {((result.totalInterest / result.finalAmount) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Legend */}
                  <div className="flex gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                      <div className="text-sm">
                        <span className="block text-slate-500">Valor Investido</span>
                        <span className="block font-bold text-slate-800">{((result.totalInvested / result.finalAmount) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                      <div className="text-sm">
                        <span className="block text-slate-500">Juros Compostos</span>
                        <span className="block font-bold text-slate-800">{((result.totalInterest / result.finalAmount) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evolution Chart */}
                <div className="h-80 w-full">
                  <h4 className="text-center text-sm font-bold text-slate-600 mb-4">Evolução do Patrimônio</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={result.yearlyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={AREA_COLORS.total} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={AREA_COLORS.total} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="year" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `Ano ${val}`}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => {
                          if(value >= 1000000) return `${(value/1000000).toFixed(1)}M`;
                          if(value >= 1000) return `${(value/1000).toFixed(0)}k`;
                          return value;
                        }}
                      />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Ano ${label}`}
                        contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Legend iconType="circle" />
                      <Area 
                        type="monotone" 
                        dataKey="totalAccumulated" 
                        name="Total Acumulado"
                        stroke={AREA_COLORS.total} 
                        fillOpacity={1} 
                        fill="url(#colorTotal)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalInvested" 
                        name="Total Investido"
                        stroke={AREA_COLORS.invested} 
                        fill="transparent" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Data Table */}
              <div className="border-t border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Detalhamento Anual</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 rounded-l-lg">Ano</th>
                          <th className="px-6 py-3">Investido (Ano)</th>
                          <th className="px-6 py-3">Juros (Ano)</th>
                          <th className="px-6 py-3">Total Investido</th>
                          <th className="px-6 py-3">Total Juros</th>
                          <th className="px-6 py-3 font-bold text-blue-900 rounded-r-lg">Total Acumulado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyData.map((row, index) => (
                          <tr key={row.year} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                            <td className="px-6 py-4 font-medium">{row.year}</td>
                            <td className="px-6 py-4">{formatCurrency(row.investedAnnual)}</td>
                            <td className="px-6 py-4 text-green-600">+{formatCurrency(row.interestAnnual)}</td>
                            <td className="px-6 py-4 text-slate-500">{formatCurrency(row.totalInvested)}</td>
                            <td className="px-6 py-4 text-slate-500">{formatCurrency(row.totalInterest)}</td>
                            <td className="px-6 py-4 font-bold text-blue-900">{formatCurrency(row.totalAccumulated)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex gap-3 text-sm text-yellow-800">
               <div className="flex-shrink-0 mt-0.5">⚠️</div>
               <div>
                 <strong>Atenção:</strong> Os cálculos apresentados são simulações baseadas nas taxas informadas e não garantem rentabilidade futura. O resultado não considera inflação ou impostos (IR), que podem variar de acordo com o tipo de investimento e o prazo de resgate.
               </div>
            </div>

          </div>
        )}

        <InfoSection />

      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Calculadora para Nossos Filhos - AJF. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}