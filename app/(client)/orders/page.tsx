"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import Pagination from "@/components/new/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyOrders } from "@/sanity/helpers/client";
import { FileX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/sanity.types";

const PAGE_SIZE = 10;

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }

    const fetchOrders = async () => {
      if (user?.uid) {
        try {
          const fetchedOrders = await getMyOrders(user.uid);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(
    () => orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [orders, page]
  );

  if (loading || isLoading) {
    return (
      <Container className="py-10 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-nuziiRoseGold" />
      </Container>
    );
  }

  return (
    <div>
      <Container className="py-10">
        {orders?.length ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Order List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] md:w-auto">
                        Order Number
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Shipping Method
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={paginatedOrders} />
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-6"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FileX className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              No orders found
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
              It looks like you haven&apos;t placed any orders yet. Start
              shopping to see your orders here!
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Browse Products</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
