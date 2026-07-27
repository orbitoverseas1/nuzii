"use client";

import { useEffect } from "react";
import useCartStore from "@/store";

/**
 * Empties the cart once an order is confirmed.
 *
 * This lives on the success page rather than at submit time because the iPay
 * path can come back: a cancelled or declined payment returns the customer to
 * the site, and they need their cart intact to try again.
 */
const ClearCartOnSuccess = () => {
  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  return null;
};

export default ClearCartOnSuccess;
