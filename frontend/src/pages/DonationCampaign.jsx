import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Receipt, AlertTriangle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import ProgressBar from '../components/ui/ProgressBar';
import { ErrorState } from '../components/ui/StateViews';
import loadRazorpayScript from '../lib/loadRazorpay';
import { DONATION_PRESETS } from '../lib/constants';

export default function DonationCampaign() {
  const { caseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`/rescue-cases/${caseId}`);

  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');
  const [mockPending, setMockPending] = useState(null); // { orderId }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-charcoal-300" size={28} />
      </div>
    );
  }

  const rescueCase = data?.case;
  if (error || !rescueCase) {
    return (
      <div className="pt-32">
        <ErrorState message={error || 'This case could not be found.'} />
      </div>
    );
  }

  if (!rescueCase.campaign?.isApproved) {
    return (
      <div className="pt-32 pb-24">
        <div className="container-px max-w-lg mx-auto text-center">
          <h1 className="text-display font-display font-bold text-charcoal-900">No active campaign</h1>
          <p className="text-charcoal-500 mt-3">
            This case does not have an approved donation campaign yet. Campaigns open once treatment estimates are reviewed and approved by our team.
          </p>
          <Link to="/donate" className="btn-outline mt-8 inline-flex">
            View active campaigns
          </Link>
        </div>
      </div>
    );
  }

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const { campaign } = rescueCase;
  const totalApprovedExpenses = (campaign.approvedExpenses || []).reduce((sum, e) => sum + e.amount, 0);

  const startPayment = async () => {
    setPayError('');
    if (!finalAmount || finalAmount < 10) {
      setPayError('Please choose an amount of at least ₹10.');
      return;
    }
    setProcessing(true);

    try {
      const { data: orderRes } = await api.post('/donations/create-order', {
        caseId,
        amount: finalAmount,
        isAnonymous,
      });

      if (orderRes.order.isMock) {
        // Demo/local environment without live Razorpay keys - simulate the
        // gateway round-trip so the full flow can still be exercised.
        setMockPending({ orderId: orderRes.order.id });
        setProcessing(false);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPayError('Could not load the payment gateway. Please check your connection.');
        setProcessing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderRes.keyId,
        amount: orderRes.order.amount,
        currency: orderRes.order.currency,
        name: 'PAWSYNC',
        description: `Donation for ${rescueCase.displayName}`,
        order_id: orderRes.order.id,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#D9612D' },
        handler: async (response) => {
          await finalizePayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (err) {
      setPayError(getErrorMessage(err));
      setProcessing(false);
    }
  };

  const finalizePayment = async ({ orderId, paymentId, signature }) => {
    setProcessing(true);
    try {
      const { data: verifyRes } = await api.post('/donations/verify', {
        orderId,
        paymentId,
        signature,
        isAnonymous,
        message,
      });
      navigate(`/donate/receipt/${verifyRes.donation.donationId}`);
    } catch (err) {
      setPayError(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const simulateDemoPayment = async () => {
    const paymentId = `pay_DEMO${Math.random().toString(36).slice(2, 10)}`;
    await finalizePayment({
      orderId: mockPending.orderId,
      paymentId,
      signature: `mock_sig_${mockPending.orderId}_${paymentId}`,
    });
  };

  return (
    <section className="pt-32 pb-24">
      <div className="container-px grid lg:grid-cols-[1.1fr,0.9fr] gap-12">
        <div>
          <p className="eyebrow mb-3">Donation Campaign</p>
          <h1 className="text-display-lg font-display font-extrabold text-charcoal-900">{campaign.title}</h1>
          <div className="rounded-3xl overflow-hidden mt-8 aspect-[16/9]">
            <img
              src={rescueCase.photos?.[0] || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80'}
              alt={rescueCase.displayName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-8">
            <ProgressBar value={campaign.raisedAmount} goal={campaign.goalAmount} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xl font-display font-bold text-charcoal-900">
                ₹{campaign.raisedAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-charcoal-400">raised of ₹{campaign.goalAmount.toLocaleString('en-IN')} goal</span>
            </div>
          </div>

          {campaign.treatmentEstimate && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-charcoal-900 mb-2">Treatment Estimate</h3>
              <p className="text-sm text-charcoal-500">{campaign.treatmentEstimate}</p>
            </div>
          )}

          <div className="mt-10 card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Receipt size={16} className="text-sage-600" />
              <h3 className="font-display font-bold text-charcoal-900">Transparent Funding</h3>
            </div>
            {campaign.approvedExpenses?.length > 0 ? (
              <ul className="space-y-3">
                {campaign.approvedExpenses.map((exp) => (
                  <li key={exp._id} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">{exp.label}</span>
                    <span className="font-semibold text-charcoal-900">₹{exp.amount.toLocaleString('en-IN')}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between text-sm pt-3 border-t border-charcoal-100">
                  <span className="text-charcoal-500">Remaining balance</span>
                  <span className="font-semibold text-charcoal-900">
                    ₹{Math.max(campaign.raisedAmount - totalApprovedExpenses, 0).toLocaleString('en-IN')}
                  </span>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-charcoal-500">No approved expenses recorded yet. Funds are held until treatment costs are verified.</p>
            )}
          </div>
        </div>

        <div>
          <div className="card p-6 md:p-7 sticky top-28">
            {!mockPending ? (
              <>
                <h3 className="font-display font-bold text-lg text-charcoal-900 mb-5">Choose an amount</h3>
                <div className="grid grid-cols-2 gap-3">
                  {DONATION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`py-3 rounded-2xl font-semibold border transition-colors ${
                        !customAmount && amount === preset
                          ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                          : 'border-charcoal-200 text-charcoal-700 hover:border-charcoal-400'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    min="10"
                    placeholder="Custom amount (₹)"
                    className="field-input"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>

                <textarea
                  className="field-textarea mt-4"
                  rows={2}
                  placeholder="Leave a message of support (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <label className="flex items-center gap-2.5 mt-4 text-sm text-charcoal-600">
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                  Donate anonymously
                </label>

                {payError && (
                  <div className="flex items-start gap-2 rounded-2xl bg-rescue-50 text-rescue-700 px-4 py-3 text-sm mt-4">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    {payError}
                  </div>
                )}

                <button onClick={startPayment} disabled={processing} className="btn-accent w-full mt-6 disabled:opacity-60">
                  {processing ? <Loader2 size={16} className="animate-spin" /> : null}
                  Donate Now — ₹{finalAmount || 0}
                </button>

                <div className="flex items-center gap-2 mt-4 text-xs text-charcoal-400">
                  <ShieldCheck size={13} />
                  Payments are verified server-side and never trusted from the browser alone.
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <p className="eyebrow mb-3">Demo Payment Gateway</p>
                <p className="text-sm text-charcoal-500 mb-6">
                  No live Razorpay keys are configured in this environment. Click below to simulate a successful payment and verify it server-side, exactly like the real webhook flow.
                </p>
                <button onClick={simulateDemoPayment} disabled={processing} className="btn-accent w-full disabled:opacity-60">
                  {processing ? <Loader2 size={16} className="animate-spin" /> : null}
                  Simulate Successful Payment
                </button>
                <button onClick={() => setMockPending(null)} className="btn-ghost w-full mt-2 justify-center">
                  Cancel
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
