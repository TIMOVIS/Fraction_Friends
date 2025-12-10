import React, { useState } from 'react';
import { Share2, X, Copy, Check, Smartphone } from 'lucide-react';

interface ShareToolsProps {
  params: Record<string, string | number>;
}

export const ShareButton: React.FC<ShareToolsProps> = ({ params }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.search = ''; 
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
    return url.toString();
  };

  const shareUrl = getShareUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-bold transition-colors shadow-sm"
        title="Share with Student"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline">Share Activity</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative transform transition-all scale-100">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Student Access</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Scan this code with a tablet. The student will have <strong>full interactive access</strong> to this activity.
                </p>
              </div>

              <div className="flex justify-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=334155&data=${encodeURIComponent(shareUrl)}`}
                  alt="QR Code"
                  className="w-40 h-40 mix-blend-multiply"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <div className="flex-1 px-3 py-2 text-xs text-slate-500 truncate font-mono select-all">
                    {shareUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-lg transition-colors shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-600 hover:text-indigo-600'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};