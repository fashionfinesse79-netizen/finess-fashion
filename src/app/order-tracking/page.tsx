'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getStoredOrders, formatINR } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { Search, Truck, CheckCircle2, Clock, Package, MapPin, ArrowRight, Star } from 'lucide-react';
import ReviewModal from '@/components/ui/ReviewModal';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const defaultId = searchParams.get('id') || '';

  const [searchQuery, setSearchQuery] = useState(defaultId);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [returnReason, setReturnReason] = useState("Size doesn't fit");
  const [returnSubmitting, setReturnSubmitting] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<{ id: string; name: string; images: string[] } | null>(null);

  const handleRequestReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    setReturnSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/orders/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: activeOrder.id, reason: returnReason })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveOrder({
          ...activeOrder,
          returnRequest: data.returnRequest,
          historyTimeline: [
            ...activeOrder.historyTimeline,
            {
              status: activeOrder.orderStatus,
              timestamp: new Date().toLocaleString(),
              description: `Return requested. Reason: ${returnReason}`
            }
          ]
        });
        alert('Return request submitted successfully!');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to submit return request');
      }
    } catch (err) {
      console.error('Error submitting return request:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setReturnSubmitting(false);
    }
  };


  useEffect(() => {
    async function initTrack() {
      let targetId = defaultId;

      if (!targetId) {
        const localOrders = getStoredOrders();
        if (localOrders.length > 0) {
          targetId = localOrders[0].id;
          setActiveOrder(localOrders[0]); // Instant cache display
        } else {
          return;
        }
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/orders/track?id=${encodeURIComponent(targetId)}`);
        if (res.ok) {
          const data = await res.json();
          setActiveOrder(data.order);
        } else {
          // fallback to localStorage
          const localOrders = getStoredOrders();
          const found = localOrders.find((o) => o.id.toLowerCase() === targetId.toLowerCase() || o.trackingNumber.toLowerCase() === targetId.toLowerCase());
          if (found) setActiveOrder(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearched(true);
        setLoading(false);
      }
    }
    initTrack();
  }, [defaultId]);


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setActiveOrder(data.order);
      } else {
        // fallback to localStorage
        const localOrders = getStoredOrders();
        const q = searchQuery.trim().toLowerCase();
        const found = localOrders.find(
          (o) =>
            o.id.toLowerCase() === q ||
            o.trackingNumber.toLowerCase() === q ||
            o.customer.phone.includes(q)
        );
        setActiveOrder(found || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const stepsList: OrderStatus[] = [
    'Pending Payment',
    'Paid',
    'Processing',
    'Shipped',
    'Delivered'
  ];

  const getStepIndex = (status: OrderStatus) => stepsList.indexOf(status);
  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.orderStatus) : 0;


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center pb-8 border-b border-[#58111A]/15">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
          REAL-TIME ATELIER SHIPMENT
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#58111A] mt-1">
          ORDER TRACKING
        </h1>
        <p className="text-xs text-[#7A3B43] mt-2">
          Track the journey of your hand-finished FINESSE garments from our atelier to your doorstep.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto bg-[#FAF6F0] p-6 border border-[#58111A]/15">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ORD-88241) or Tracking Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#D4AF37] uppercase"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-semibold tracking-wider hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </form>
      </div>

      {/* Active Order Results */}
      {loading ? (
        <div className="text-center py-12 bg-[#FAF6F0] border border-[#58111A]/15 space-y-2">
          <div className="w-8 h-8 border-2 border-[#58111A] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#58111A] tracking-wider uppercase">Querying Atelier Ledger...</p>
        </div>
      ) : activeOrder ? (
        <div className="bg-white border border-[#58111A]/15 p-8 space-y-8 shadow-sm">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#58111A]/15 pb-6 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
                ORDER #{activeOrder.id}
              </span>
              <h2 className="font-serif-luxury text-2xl text-[#58111A] font-medium">
                Shipment Status: <span className="text-[#D4AF37]">{
                  activeOrder.returnRequest 
                    ? `Return ${activeOrder.returnRequest.status}` 
                    : activeOrder.orderStatus
                }</span>
              </h2>

              <p className="text-xs text-[#7A3B43] mt-1">
                Air Courier: <strong>{activeOrder.courierName || 'BlueDart Express'}</strong> • Tracking / AWB: <strong>{activeOrder.awbNumber || activeOrder.trackingNumber}</strong>
              </p>

            </div>

            <div className="bg-[#FAF6F0] p-3 border border-[#58111A]/15 text-xs text-right">
              <span className="text-[10px] uppercase text-[#A3757C] block">Estimated Delivery</span>
              <span className="font-semibold text-sm text-[#58111A]">{activeOrder.estimatedDelivery}</span>
            </div>
          </div>

            {/* Cancelled Banner */}
            {activeOrder.orderStatus === 'Cancelled' && (
              <div className="bg-red-50 border border-red-200 p-4 text-center rounded my-4">
                <p className="text-xs text-red-700 uppercase tracking-wider font-semibold">This order has been Cancelled.</p>
              </div>
            )}

            {/* Visual Step-by-Step Progress Bar */}
            {activeOrder.orderStatus !== 'Cancelled' && (
              <div>
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#58111A] mb-6">
                  Live Progress Timeline
                </h3>

                {/* Desktop Horizontal Stepper */}
                <div className="hidden md:block relative mb-8">
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#58111A]/15 -z-0" />
                  <div
                    className="absolute top-4 left-6 h-0.5 bg-[#58111A] transition-all duration-700 -z-0"
                    style={{ width: `${(currentStepIdx / (stepsList.length - 1)) * 90}%` }}
                  />

                  <div className="grid grid-cols-5 text-center relative z-10">
                    {stepsList.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                              isCompleted
                                ? 'bg-[#58111A] text-[#FAF6F0] shadow-md'
                                : 'bg-white border-2 border-[#58111A]/15 text-[#A3757C]'
                            } ${isCurrent ? 'ring-4 ring-[#D4AF37]/30 scale-110' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] uppercase font-medium ${isCompleted ? 'text-[#58111A]' : 'text-[#A3757C]'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Vertical Stepper */}
                <div className="md:hidden space-y-4 border-l-2 border-[#58111A] pl-4">
                  {stepsList.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    return (
                      <div key={step} className="flex items-center gap-3 text-xs">
                        <span className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-[#58111A]' : 'bg-gray-300'}`} />
                        <span className={isCompleted ? 'font-semibold text-[#58111A]' : 'text-[#A3757C]'}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}


          {/* Activity Log Feed */}
          <div className="border-t border-[#58111A]/15 pt-6">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-[#58111A] mb-4">
              Courier Activity History
            </h3>

            <div className="space-y-4">
              {activeOrder.historyTimeline.map((history, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs border-b border-[#58111A]/15 pb-3">
                  <div className="p-2 bg-[#FAF6F0] rounded text-[#58111A]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#58111A]">{history.status}</span>
                      <span className="text-[10px] text-gray-400">• {history.timestamp}</span>
                    </div>
                    <p className="text-[#7A3B43] mt-0.5">{history.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-[#58111A]/15 pt-6">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-[#58111A] mb-4">
              Shipment Contents ({activeOrder.items.length} Items)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeOrder.items.map((item, idx) => {
                const isDelivered = activeOrder.orderStatus?.toUpperCase() === 'DELIVERED';
                return (
                  <div key={idx} className="flex flex-col justify-between p-3 bg-[#FAF6F0] border border-[#58111A]/15">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 bg-[#FAF6F0] flex-shrink-0">
                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div className="text-xs min-w-0">
                        <h4 className="font-semibold text-[#58111A] truncate">{item.productName}</h4>
                        <p className="text-gray-500">Color: {item.selectedColor} • Size: {item.selectedSize}</p>
                        <p className="font-medium text-[#58111A]">{formatINR(item.price)}</p>
                      </div>
                    </div>
                    {isDelivered && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReviewProduct({
                            id: item.productId,
                            name: item.productName,
                            images: [item.productImage]
                          });
                          setIsReviewModalOpen(true);
                        }}
                        className="mt-3 w-full py-2 bg-[#D4AF37] text-[#58111A] hover:bg-[#58111A] hover:text-[#FAF6F0] transition-colors text-[10px] uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3 h-3 fill-current" /> Rate & Review Garment
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Returns Management Section */}
          {activeOrder.orderStatus === 'Delivered' && (
            <div className="border-t border-[#58111A]/15 pt-6 space-y-4">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-[#58111A]">
                Order Returns (Delivered Items)
              </h3>
              
              {!activeOrder.returnRequest ? (
                <form onSubmit={handleRequestReturn} className="bg-[#FAF6F0] p-5 border border-[#58111A]/15 space-y-3 max-w-lg">
                  <p className="text-xs text-[#7A3B43]">
                    If you are not fully satisfied with your Atelier creation, you may request a return. Please select your reason below:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none"
                    >
                      <option value="Size doesn't fit">Size doesn't fit</option>
                      <option value="Defective product">Defective product / Quality issues</option>
                      <option value="Incorrect item sent">Incorrect item sent</option>
                      <option value="Different from images">Different from images</option>
                      <option value="Changed my mind">Changed my mind</option>
                    </select>
                    <button
                      type="submit"
                      disabled={returnSubmitting}
                      className="px-5 py-2.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors disabled:opacity-50"
                    >
                      {returnSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-[#FAF6F0] p-5 border border-[#D4AF37]/35 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#58111A]/10">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block">Return Status</span>
                      <strong className="text-sm text-[#58111A] uppercase tracking-wider">{activeOrder.returnRequest.status}</strong>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-gray-500 uppercase block">Requested Date</span>
                      <span className="text-xs text-[#58111A]">{new Date(activeOrder.returnRequest.requestedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs space-y-2 text-[#7A3B43]">
                    <p><strong>Selected Reason:</strong> {activeOrder.returnRequest.reason}</p>
                    {activeOrder.returnRequest.adminNotes && (
                      <p className="p-3 bg-white border-l-2 border-[#D4AF37] text-[11px] text-[#58111A]">
                        <strong>Atelier Concierge Notes:</strong> "{activeOrder.returnRequest.adminNotes}"
                      </p>
                    )}
                  </div>

                  {/* Return Progress Flow */}
                  <div className="pt-2">
                    <span className="text-[9px] uppercase tracking-wider text-[#A3757C] block mb-2">Return Request Journey</span>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {['Requested', 'Approved', 'Pickup Scheduled', 'Returned', 'Refund Processed'].map((st) => {
                        const isCurrent = activeOrder.returnRequest?.status === st;
                        const isRejected = activeOrder.returnRequest?.status === 'Rejected' && st === 'Approved';
                        return (
                          <span
                            key={st}
                            className={`px-2.5 py-1 rounded-full border ${
                              isCurrent
                                ? 'bg-[#58111A] text-[#FAF6F0] border-[#58111A]'
                                : isRejected
                                ? 'bg-red-50 text-red-700 border-red-200 line-through'
                                : activeOrder.returnRequest?.status === 'Rejected'
                                ? 'bg-gray-50 text-gray-400 border-gray-100'
                                : 'bg-white text-gray-500 border-gray-200'
                            }`}
                          >
                            {isRejected ? 'Rejected' : st}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


        </div>
      ) : searched ? (
        <div className="text-center py-12 bg-[#FAF6F0] border border-[#58111A]/15 space-y-2">
          <p className="font-serif-luxury text-xl text-[#58111A]">No order found for &ldquo;{searchQuery}&rdquo;</p>
          <p className="text-xs text-[#7A3B43]">Please check your Order ID or phone number and try again.</p>
        </div>
      ) : null}

      {/* Customer Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReviewProduct(null);
        }}
        product={selectedReviewProduct}
        orderId={activeOrder?.id}
        initialUserName={activeOrder?.customer?.fullName}
      />

    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Order Tracking...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
