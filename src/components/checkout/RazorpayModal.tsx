'use client';

import React, { useState } from 'react';
import { formatINR } from '@/lib/store';
import { ShippingAddress, OrderItem } from '@/lib/types';
import { ShieldCheck, Lock, CreditCard, QrCode, Building2, Wallet, Banknote, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  customer: ShippingAddress;
  items: OrderItem[];
  couponCode?: string;
  discountAmount: number;
  shippingFee: number;
  onPaymentSuccess: (orderId: string, method: string) => void;
}

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  customer,
  items,
  couponCode,
  discountAmount,
  shippingFee,
  onPaymentSuccess
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(customer.fullName || '');
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  if (!isOpen) return null;

  const handleSimulatePayment = (method: string) => {
    setIsProcessing(true);
    setProcessingStatus('Securing connection with bank server...');

    setTimeout(() => {
      setProcessingStatus('Authenticating transaction authorization...');
    }, 1200);

    setTimeout(() => {
      setProcessingStatus('Payment Approved. Generating order invoice...');
    }, 2400);

    setTimeout(() => {
      const generatedOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      setIsProcessing(false);
      onPaymentSuccess(generatedOrderId, method);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200">
        
        {/* Razorpay Top Header */}
        <div className="bg-[#58111A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="font-serif-luxury font-bold text-lg text-[#D4AF37]">FF</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-white font-serif-luxury">FINESSE FASHION</h3>
              <p className="text-[11px] text-[#D4AF37]">Haute Couture Atelier</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-gray-300 block tracking-wider">Amount Payable</span>
            <span className="text-lg font-bold text-[#D4AF37] font-serif-luxury">{formatINR(amount)}</span>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-3 right-3 text-gray-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Razorpay Trust Badge Sub-header */}
        <div className="bg-[#FAF6F0] px-5 py-2 flex items-center justify-between text-[11px] text-[#7A3B43] border-b border-[#58111A]/15">
          <div className="flex items-center gap-1.5 text-[#58111A] font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RAZORPAY SECURE PAYMENTS</span>
          </div>
          <span>256-Bit SSL Encrypted</span>
        </div>

        {/* Modal Body */}
        {isProcessing ? (
          <div className="p-10 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#58111A] mx-auto" />
            <h4 className="font-semibold text-[#58111A] text-base">{processingStatus}</h4>
            <p className="text-xs text-[#7A3B43]">Please do not refresh or close this window.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row min-h-[380px]">
            
            {/* Sidebar Payment Method Tabs */}
            <div className="w-full md:w-44 bg-[#FAF6F0] border-r border-[#58111A]/15 p-2 space-y-1">
              <button
                onClick={() => setActiveTab('upi')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded text-left text-xs font-medium transition-colors ${
                  activeTab === 'upi' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setActiveTab('card')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded text-left text-xs font-medium transition-colors ${
                  activeTab === 'card' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setActiveTab('netbanking')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded text-left text-xs font-medium transition-colors ${
                  activeTab === 'netbanking' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>NetBanking</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded text-left text-xs font-medium transition-colors ${
                  activeTab === 'wallet' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-white'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Wallets & EMI</span>
              </button>

              <button
                onClick={() => setActiveTab('cod')}
                className={`w-full flex items-center gap-2 px-3 py-3 rounded text-left text-xs font-medium transition-colors ${
                  activeTab === 'cod' ? 'bg-[#58111A] text-[#FAF6F0]' : 'text-[#7A3B43] hover:bg-white'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Main Active Tab Form Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              
              {/* Tab 1: UPI */}
              {activeTab === 'upi' && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#58111A]">Pay via Instant UPI</h4>
                  
                  {/* Apps Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-gray-600">
                    <div className="p-2 border rounded hover:border-[#D4AF37] cursor-pointer bg-gray-50">GPay</div>
                    <div className="p-2 border rounded hover:border-[#D4AF37] cursor-pointer bg-gray-50">PhonePe</div>
                    <div className="p-2 border rounded hover:border-[#D4AF37] cursor-pointer bg-gray-50">Paytm</div>
                    <div className="p-2 border rounded hover:border-[#D4AF37] cursor-pointer bg-gray-50">BHIM</div>
                  </div>

                  <div className="relative border-t border-gray-200 my-4 pt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Enter VPA / UPI ID</label>
                    <input
                      type="text"
                      placeholder="mobile-number@upi / username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-[#58111A] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('UPI')}
                    className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-bold tracking-wider rounded hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors shadow-md"
                  >
                    Pay {formatINR(amount)} via UPI
                  </button>
                </div>
              )}

              {/* Tab 2: Cards */}
              {activeTab === 'card' && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#58111A]">Credit or Debit Card</h4>
                  
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8912"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-xs focus:ring-1 focus:ring-[#58111A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="08/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-xs"
                    />
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('Card')}
                    className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-bold tracking-wider rounded hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors shadow-md mt-2"
                  >
                    Pay {formatINR(amount)} Securely
                  </button>
                </div>
              )}

              {/* Tab 3: NetBanking */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#58111A]">Select Bank</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'IndusInd Bank'].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 border rounded text-left transition-colors ${
                          selectedBank === bank ? 'border-[#58111A] bg-[#FAF6F0] font-semibold text-[#58111A]' : 'hover:bg-gray-50'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSimulatePayment(`NetBanking (${selectedBank || 'HDFC'})`)}
                    className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-bold tracking-wider rounded hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors shadow-md"
                  >
                    Proceed to Bank Portal
                  </button>
                </div>
              )}

              {/* Tab 4: Wallet */}
              {activeTab === 'wallet' && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#58111A]">Wallets & Pay Later</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 border rounded hover:border-[#58111A] cursor-pointer flex justify-between items-center">
                      <span>Paytm Wallet</span>
                      <span className="text-gray-400">Balance Link</span>
                    </div>
                    <div className="p-3 border rounded hover:border-[#58111A] cursor-pointer flex justify-between items-center">
                      <span>Amazon Pay</span>
                      <span className="text-gray-400">Instant One-Click</span>
                    </div>
                    <div className="p-3 border rounded hover:border-[#58111A] cursor-pointer flex justify-between items-center">
                      <span>LazyPay / ZestMoney</span>
                      <span className="text-gray-400">Pay Next Month</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('Wallet')}
                    className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-bold tracking-wider rounded hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors shadow-md"
                  >
                    Authorize Wallet Payment
                  </button>
                </div>
              )}

              {/* Tab 5: Cash on Delivery */}
              {activeTab === 'cod' && (
                <div className="space-y-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[#58111A]">Cash on Delivery (COD)</h4>
                  <div className="p-3 bg-[#FAF6F0] border border-[#58111A]/20 text-xs text-[#58111A] space-y-1">
                    <p className="font-semibold">White-Glove Doorstep Delivery</p>
                    <p className="text-[#7A3B43]">Pay cash or via UPI QR code directly to the BlueDart courier partner at time of delivery.</p>
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('COD')}
                    className="w-full py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-bold tracking-wider rounded hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors shadow-md"
                  >
                    Confirm Order with COD
                  </button>
                </div>
              )}

              {/* Bottom Security Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <Lock className="w-3 h-3" />
                <span>Razorpay PCI-DSS Compliant • Merchant ID: rzp_live_finesse</span>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
