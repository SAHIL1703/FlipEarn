import { X } from 'lucide-react';
import React, { useState } from 'react';

const WithdrawModel = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState([
    { type: "text", name: "Account Holder", value: "" }, // Shortened name for mobile fit
    { type: "text", name: "Bank Name", value: "" },
    { type: "number", name: "Account Number", value: "" },
    { type: "text", name: "SWIFT", value: "" },
    { type: "text", name: "Branch", value: "" },
  ]);

  const handleSubmission = async (e) => {
    e.preventDefault();
    console.log({ amount, account });
  };

  return (
    // 1. Overlay Container
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4'>
      
      {/* 2. Modal Card Wrapper (White background, defined width) */}
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200'>
        
        {/* Header */}
        <div className='bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4 flex items-center justify-between'>
          <h3 className='font-semibold text-lg tracking-wide'>Withdraw Funds</h3>
          <button 
            onClick={onClose} 
            className='p-1.5 hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Body / Form */}
        <form onSubmit={handleSubmission} className='p-6 space-y-4 max-h-[80vh] overflow-y-auto'>
          
          {/* Amount Field */}
          <div className='grid grid-cols-[120px_1fr] items-center gap-4'>
            <label className='text-sm font-medium text-gray-700'>Amount</label>
            <div className='relative'>
               <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
               <input 
                 onChange={(e) => setAmount(e.target.value)} 
                 value={amount} 
                 type='number' 
                 className='w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all' 
                 required 
                 placeholder="0.00"
               />
            </div>
          </div>

          {/* Dynamic Fields */}
          {account.map((field, index) => (
            <div key={index} className='grid grid-cols-[120px_1fr] items-center gap-4'>
              <label className='text-sm font-medium text-gray-700 truncate'>
                {field.name}
              </label>
              <input 
                type={field.type} 
                value={field.value} 
                onChange={(e) => setAccount((prev) => prev.map((c, i) => (i === index ? { ...c, value: e.target.value } : c)))}
                className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all'
                required
              />
            </div>
          ))}

          {/* Footer / Submit Button */}
          <div className='pt-4 mt-2 border-t border-gray-100'>
            <button 
                type='submit' 
                className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]'
            >
                Confirm Withdrawal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default WithdrawModel;