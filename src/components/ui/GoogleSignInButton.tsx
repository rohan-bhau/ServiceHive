'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLoginMutation } from '@/store/api/authApi';
import { showToast } from '@/lib/utils';

interface Props {
  label?: string;
}

export default function GoogleSignInButton({ label = 'Continue with Google' }: Props) {
  const router = useRouter();
  const [googleLogin] = useGoogleLoginMutation();
  const btnRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const loginRef = useRef(googleLogin);
  loginRef.current = googleLogin;
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const callback = (response: { credential: string }) => {
      loginRef.current({ id_token: response.credential })
        .unwrap()
        .then(() => {
          showToast.success('Welcome!');
          routerRef.current.push('/dashboard');
        })
        .catch((err: any) => {
          showToast.error(err?.data?.message || 'Google sign-in failed');
        });
    };

    const init = () => {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback,
        locale: 'en',
      });
      if (btnRef.current) {
        (window as any).google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 384,
        });
      }
    };

    if ((window as any).google?.accounts?.id) {
      init();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, []);

  return <div ref={btnRef} className="flex w-full justify-center" />;
}
