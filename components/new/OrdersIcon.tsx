"use client";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/sanity/helpers/client";
import { ListOrdered } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const OrdersIcon = () => {
  const { user } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) {
      setOrderCount(0);
      return;
    }
    getMyOrders(user.uid).then((orders) => setOrderCount(orders?.length ?? 0));
  }, [user?.uid]);

  return (
    <Link
      href={"/orders"}
      className="hidden md:block group relative text-nuziiText hover:text-nuziiRoseGoldDark transition-colors"
    >
      <ListOrdered className="w-5 h-5" />
      {orderCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-nuziiRoseGold text-white h-4 w-4 rounded-full text-[10px] font-medium flex items-center justify-center">
          {orderCount}
        </span>
      )}
    </Link>
  );
};

export default OrdersIcon;
