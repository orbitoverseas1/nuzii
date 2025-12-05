import { client } from "../lib/client";

// Client-safe version using regular client instead of sanityFetch
export const getMyOrders = async (userId: string) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const MY_ORDERS_QUERY = `*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
    ...,products[]{
      ...,product->
    }
  }`;

    try {
        const orders = await client.fetch(MY_ORDERS_QUERY, { userId });
        return orders || [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};
