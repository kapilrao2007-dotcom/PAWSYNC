let loadingPromise = null;

/**
 * Loads the Razorpay Checkout script once and caches the promise.
 * Not needed in mock/demo mode (no real gateway keys configured).
 */
export default function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return loadingPromise;
}
