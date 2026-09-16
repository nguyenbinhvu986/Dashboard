import { useState, useEffect, useMemo, useCallback } from "react";
import type { Cart, EnrichedCart } from "../types/cart";
import type { User } from "../types/user";

export function useECommerceData() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch("https://dummyjson.com/carts?limit=0"),
      fetch("https://dummyjson.com/users?limit=0"),
    ])
      .then((res) => {
        if (!res[0].ok) {
          throw new Error(`Lỗi máy chủ (carts): ${res[0].status}`);
        }
        if (!res[1].ok) {
          throw new Error(`Lỗi máy chủ (users): ${res[1].status}`);
        }
        return Promise.all([res[0].json(), res[1].json()]);
      })
      .then((data) => {
        setCarts(data[0].carts);
        setUsers(data[1].users);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu giỏ hàng.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enrichedCarts: EnrichedCart[] = useMemo(() => {
    const userMap = new Map<number, User>();

    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    return carts.map((cart) => {
      const matchedUser = userMap.get(cart.userId);

      return {
        ...cart,
        user: matchedUser,
      };
    });
  }, [carts, users]);

  return {
    enrichedCarts: enrichedCarts,
    loading: loading,
    error: error,
    refetch: fetchData,
  };
}
