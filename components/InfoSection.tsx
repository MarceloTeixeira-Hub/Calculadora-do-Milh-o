import React from 'react';
import { BookOpen, TrendingUp, Target, AlertCircle } from 'lucide-react';

export const InfoSection: React.FC = () => {
  return (
    <div className="mt-12 space-y-12 text-slate-700">
      
      {/* How to use */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-red-800" />
          Como usar a Calculadora do Primeiro Milhão
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-900">1. Escolha o tipo de cálculo</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="font-medium text-slate-900">Calcular prazo:</span>
                descubra quanto tempo levará para atingir R$ 1 milhão mantendo um aporte constante.
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-slate-900">Calcular aporte:</span>
                descubra quanto precisa investir mensalmente para chegar ao milhão em uma data específica.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-900">2. Configure os valores</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><span className="font-medium">Valor Inicial:</span> Quanto você já tem investido hoje. Se está começando, use 0.</li>
              <li><span className="font-medium">Taxa de Juros:</span> A rentabilidade esperada. Ex: 8% a.a. é uma referência conservadora para renda variável/FIIs.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Difference between modes */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-red-800" />
          Qual modalidade escolher?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-red-800">
            <h3 className="font-bold text-lg mb-2">Calcular Prazo</h3>
            <p className="text-sm text-slate-600 mb-4">Ideal se você já sabe quanto pode poupar por mês e quer saber quando alcançará sua liberdade financeira.</p>
            <ul className="text-sm list-disc list-inside text-slate-600">
              <li>Visualiza o poder dos juros no longo prazo.</li>
              <li>Mostra a evolução anual do patrimônio.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-blue-800">
            <h3 className="font-bold text-lg mb-2">Calcular Aporte Necessário</h3>
            <p className="text-sm text-slate-600 mb-4">Ideal se você tem uma meta de data (ex: aposentar em 15 anos) e precisa ajustar seu orçamento.</p>
            <ul className="text-sm list-disc list-inside text-slate-600">
              <li>Define metas de economia mensal.</li>
              <li>Ajuda no planejamento familiar e aposentadoria.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="bg-slate-900 text-slate-100 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
          Como é feito o cálculo?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-yellow-500 mb-2">Fórmula Base</h4>
            <p className="text-sm text-slate-300">
              Utilizamos a fórmula clássica de juros compostos com aportes mensais, considerando o reinvestimento automático de todos os dividendos e rendimentos.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-yellow-500 mb-2">Conversão de Taxas</h4>
            <p className="text-sm text-slate-300">
              Para garantir precisão, convertemos taxas anuais para mensais utilizando a fórmula de equivalência: <br/>
              <code className="text-xs bg-slate-800 p-1 rounded mt-1 block w-fit">(1 + taxa_anual)^(1/12) - 1</code>
            </p>
          </div>
          <div>
            <h4 className="font-bold text-yellow-500 mb-2">Considerações</h4>
            <div className="flex gap-2 items-start text-sm text-slate-300">
              <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" />
              <p>Os cálculos são brutos e nominais. Não descontam inflação ou Imposto de Renda, que variam conforme o investimento escolhido.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
