import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || '';

function loadScriptOnce(src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * "Sign in / up with Google" and "...with Facebook".
 *
 * Both providers are entirely optional - if VITE_GOOGLE_CLIENT_ID /
 * VITE_FACEBOOK_APP_ID aren't set (see frontend/.env.example), the
 * respective button renders in a clearly-disabled state instead of being
 * broken, and the whole block hides itself if NEITHER is configured.
 *
 * Google renders its own official button (via Identity Services) so the
 * logo/label/click-to-consent flow always matches what Google requires.
 * Facebook uses a custom button (Meta's own guidelines allow this) that
 * calls the Facebook JS SDK's FB.login().
 */
export default function SocialSignIn({ mode = 'signin' }) {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  const [error, setError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [fbReady, setFbReady] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);

  const afterAuth = (res) => {
    if (!res.success) return setError(res.message);
    navigate(location.state?.from || '/dashboard');
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return undefined;
    let cancelled = false;

    loadScriptOnce('https://accounts.google.com/gsi/client', 'google-identity-script')
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !googleBtnRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async ({ credential }) => {
            setError('');
            const res = await loginWithGoogle(credential);
            afterAuth(res);
          },
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 336,
          logo_alignment: 'left',
          text: mode === 'signup' ? 'signup_with' : 'signin_with',
        });
        if (!cancelled) setGoogleReady(true);
      })
      .catch(() => setGoogleReady(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!FACEBOOK_APP_ID) return undefined;
    let cancelled = false;

    window.fbAsyncInit = () => {
      window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v19.0' });
      if (!cancelled) setFbReady(true);
    };
    loadScriptOnce('https://connect.facebook.net/en_US/sdk.js', 'facebook-jssdk').catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) return;
    setError('');
    setFbLoading(true);
    window.FB.login(
      async (response) => {
        if (response?.authResponse?.accessToken) {
          const res = await loginWithFacebook(response.authResponse.accessToken);
          setFbLoading(false);
          afterAuth(res);
        } else {
          setFbLoading(false);
          setError('Facebook sign-in was cancelled or not authorized.');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  // Note: unlike an earlier version of this component, we deliberately do
  // NOT hide this whole block when no credentials are configured - the
  // buttons should always be visible (with their logos), just disabled
  // with an explanatory tooltip, so the sign-in page never looks broken or
  // incomplete.
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-charcoal-100" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-charcoal-400">Or continue with</span>
        <div className="h-px flex-1 bg-charcoal-100" />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-rescue-600"
        >
          <AlertTriangle size={13} className="shrink-0" />
          {error}
        </motion.p>
      )}

      <div className="space-y-2.5">
        {GOOGLE_CLIENT_ID ? (
          <>
            {/* Google's own rendered button lands here once its script loads */}
            <div ref={googleBtnRef} className={`flex justify-center [&>div]:!w-full ${googleReady ? '' : 'hidden'}`} />
            {!googleReady && (
              <button type="button" disabled className="btn-social opacity-50 cursor-not-allowed">
                <GoogleLogo />
                Continue with Google
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            disabled
            title="Add VITE_GOOGLE_CLIENT_ID in frontend/.env to enable Google sign-in"
            className="btn-social opacity-50 cursor-not-allowed"
          >
            <GoogleLogo />
            Continue with Google
          </button>
        )}

        <button
          type="button"
          onClick={handleFacebookLogin}
          disabled={!FACEBOOK_APP_ID || !fbReady || fbLoading}
          title={!FACEBOOK_APP_ID ? 'Add VITE_FACEBOOK_APP_ID in frontend/.env to enable Facebook sign-in' : undefined}
          className="btn-social disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FacebookLogo />
          {fbLoading ? 'Connecting…' : 'Continue with Facebook'}
        </button>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2 1.4-4.6 2.3-7.6 2.3-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.5 5.5C41.4 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}
