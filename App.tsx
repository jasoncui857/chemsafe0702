
import React, { useState } from 'react';
import { fetchChemicalInfo } from './geminiService';
import { COMPATIBILITY_MATRIX, CATEGORY_LABELS } from './constants';
import { ChemicalInfo, CompatibilityResult } from './types';

// Icons
const IconCheck = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
const IconX = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconWarning = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

const App: React.FC = () => {
  const [casA, setCasA] = useState('');
  const [casB, setCasB] = useState('');
  const [infoA, setInfoA] = useState<ChemicalInfo | null>(null);
  const [infoB, setInfoB] = useState<ChemicalInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const handleAssessment = async () => {
    if (!casA || !casB) {
      setError('请输入两个化学品的CAS号');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const [dataA, dataB] = await Promise.all([
        fetchChemicalInfo(casA),
        fetchChemicalInfo(casB)
      ]);

      setInfoA(dataA);
      setInfoB(dataB);

      const key1 = `${dataA.category}-${dataB.category}`;
      const key2 = `${dataB.category}-${dataA.category}`;
      
      const matrixResult = COMPATIBILITY_MATRIX[key1] ?? COMPATIBILITY_MATRIX[key2];

      if (matrixResult === undefined) {
        setResult({
          compatible: 'special',
          reason: `分类 ${dataA.category} 或 ${dataB.category} 未在提供的基础相容矩阵中列出。对于高反应性物质（如爆炸物、过氧化物等），通常建议进行特殊的隔离储存。`
        });
      } else {
        setResult({
          compatible: matrixResult,
          reason: matrixResult 
            ? `依据相容矩阵，分类 ${dataA.category} 与 ${dataB.category} 原则上可以混存。` 
            : `依据相容矩阵，分类 ${dataA.category} 与 ${dataB.category} 互不相容，严禁混存。`
        });
      }
    } catch (err: any) {
      setError(`获取化学品信息失败: ${err.message || '请检查CAS号是否正确'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">化学品储存相容性评估系统</h1>
        <p className="text-slate-500">基于 CAS、H短语及 GHS 分类准则的专业评估工具</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">化学品 A (CAS号)</label>
            <input
              type="text"
              value={casA}
              onChange={(e) => setCasA(e.target.value)}
              placeholder="例如: 64-17-5"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">化学品 B (CAS号)</label>
            <input
              type="text"
              value={casB}
              onChange={(e) => setCasB(e.target.value)}
              placeholder="例如: 7647-01-0"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleAssessment}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center space-x-2 ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>评估中...</span>
            </>
          ) : (
            <span>开始评估</span>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center space-x-2">
            <IconWarning />
            <span>{error}</span>
          </div>
        )}
      </div>

      {(infoA && infoB) && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChemicalCard title="化学品 A" info={infoA} />
            <ChemicalCard title="化学品 B" info={infoB} />
          </div>

          {result && (
            <div className={`p-8 rounded-2xl border-2 ${
              result.compatible === true ? 'bg-emerald-50 border-emerald-200' :
              result.compatible === false ? 'bg-rose-50 border-rose-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-full ${
                  result.compatible === true ? 'bg-emerald-100 text-emerald-600' :
                  result.compatible === false ? 'bg-rose-100 text-rose-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {result.compatible === true ? <IconCheck /> : result.compatible === false ? <IconX /> : <IconWarning />}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${
                    result.compatible === true ? 'text-emerald-800' :
                    result.compatible === false ? 'text-rose-800' :
                    'text-amber-800'
                  }`}>
                    {result.compatible === true ? '评估结果：相容' : 
                     result.compatible === false ? '评估结果：不相容' : 
                     '评估结果：需特殊评估'}
                  </h3>
                  <p className="text-slate-600 mt-1">{result.reason}</p>
                </div>
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">判断依据说明</h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  本评估系统根据提供的 GHS 分类准则将 CAS 号映射至储存分类，并参考储存相容矩阵给出结论。
                  <br />
                  <span className="font-semibold">提示：</span> 实际操作中请务必参考官方最新的《危险化学品安全技术说明书》(MSDS/SDS)。
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ChemicalCardProps {
  title: string;
  info: ChemicalInfo;
}

const ChemicalCard: React.FC<ChemicalCardProps> = ({ title, info }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-3">
        <div>
          <span className="text-slate-400 text-xs block">名称</span>
          <span className="text-lg font-bold text-slate-800 leading-tight">{info.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 text-xs block">CAS 号</span>
            <span className="text-slate-700 font-mono">{info.cas}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs block">可燃性</span>
            <span className={`font-semibold ${info.isFlammable ? 'text-amber-600' : 'text-slate-500'}`}>
              {info.isFlammable ? '可燃' : '不可燃'}
            </span>
          </div>
        </div>
        <div>
          <span className="text-slate-400 text-xs block mb-1">H 短语</span>
          <div className="flex flex-wrap gap-1">
            {info.hStatements.map(h => (
              <span key={h} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">{h}</span>
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <span className="text-slate-400 text-xs block">检测到的储存分类</span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-blue-900">{info.category}</span>
            <span className="text-xs text-slate-500 truncate max-w-[150px]">{info.categoryLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
