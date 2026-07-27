"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  actionUrl: string;
  fields: Record<string, string>;
}

/**
 * iPay's checkout is an HTML form POST to their domain, so the *browser* has to
 * make the request — a server-side fetch would land the payment page in our
 * response instead of in the customer's address bar.
 *
 * The form auto-submits on mount. The visible button is the fallback for
 * browsers that block scripted submission, and the overlay stops the customer
 * interacting with a checkout that is already on its way out.
 */
const IpayRedirectForm = ({ actionUrl, fields }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Native submit rather than requestSubmit: no validation, no React
    // synthetic event, just go.
    formRef.current?.submit();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 px-6">
      <div className="text-center space-y-4 max-w-sm">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-darkColor" />
        <h2 className="text-lg font-semibold">Redirecting you to iPay…</h2>
        <p className="text-sm text-gray-500">
          Please don&apos;t close this window. You&apos;ll complete your payment
          securely on iPay.
        </p>

        <form ref={formRef} method="POST" action={actionUrl}>
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <button
            type="submit"
            className="text-sm font-semibold underline text-darkColor"
          >
            Continue to payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default IpayRedirectForm;
