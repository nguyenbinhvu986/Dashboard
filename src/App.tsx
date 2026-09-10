import { useEffect, useRef, useState, useMemo } from "react";
import "./index.css";
import { KPIStats } from "./KPIStats.tsx";
import { FilterBar } from "./FilterBar";
import { CartTables } from "./CartTable";
import { CartDetailModal } from "./CartDetailModal";
import type { CartProduct, Cart } from "./type";
import { PaginationBar } from "./paginatedCarts";
type Theme = "light" | "dark";

function CartTable() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchMode, setSearchMode] = useState("userId");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterChangeCountRef = useRef(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://dummyjson.com/carts?limit=0")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Lỗi máy chủ: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCarts(data.carts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không thể tải dữ liệu giỏ hàng.");
        setLoading(false);
      });
  }, []);
  // Tự động focus vào ô tìm kiếm khi component được render
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  //sản phẩm bán chạy nhất
  const bestSellerProduct: CartProduct | null = useMemo(() => {
    if (searchMode !== "bestSeller") {
      return null;
    }
    const quantityMap = new Map<number, number>();
    const productMap = new Map<number, CartProduct>();

    carts
      .flatMap((cart) => cart.products)
      .forEach((product) => {
        quantityMap.set(
          product.id,
          (quantityMap.get(product.id) ?? 0) + product.quantity,
        );
        if (!productMap.has(product.id)) {
          productMap.set(product.id, product);
        }
      });

    let bestProductId: number | null = null;
    let bestQuantity = 0;

    quantityMap.forEach((quantity, productId) => {
      if (quantity > bestQuantity) {
        bestQuantity = quantity;
        bestProductId = productId;
      }
    });

    if (bestProductId === null) {
      return null;
    }
    return productMap.get(bestProductId) ?? null;
  }, [carts, searchMode]);

  //lọc giỏ hàng dựa trên chế độ tìm kiếm và các điều kiện khác
  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      const query = searchQuery.trim();

      if (searchMode === "userId") {
        return query === "" || cart.userId === Number(query);
      }

      if (searchMode === "productId") {
        return (
          query === "" || cart.products.some((p) => String(p.id) === query)
        );
      }

      if (searchMode === "priceRange") {
        const min = minPrice === "" ? 0 : Number(minPrice);
        const max = maxPrice === "" ? Infinity : Number(maxPrice);
        return cart.discountedTotal >= min && cart.discountedTotal <= max;
      }

      if (searchMode === "topSpender") {
        const maxSpending = Math.max(...carts.map((c) => c.discountedTotal));
        return cart.discountedTotal === maxSpending;
      }

      if (searchMode === "bestSeller") {
        return cart.products.some((p) => p.id === bestSellerProduct?.id);
      }

      return true;
    });
  }, [carts, searchMode, searchQuery, minPrice, maxPrice]);
  // Phân trang
  const itemsPerPage = 30;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredCarts.length / itemsPerPage));
  }, [carts, filteredCarts]);
  let pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const paginatedCarts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCarts.slice(start, start + itemsPerPage);
  }, [filteredCarts, currentPage, itemsPerPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchMode, searchQuery, minPrice, maxPrice]);

  const handleModeChange = (mode: string) => {
    setSearchMode(mode);
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    filterChangeCountRef.current += 1;
    console.log("Số lần đổi bộ lọc:", filterChangeCountRef.current);
  };

  const stats = useMemo(() => {
    return {
      totalRevenue: carts.reduce((sum, cart) => sum + cart.discountedTotal, 0),
      totalOrders: carts.length,
      productsSold: carts.reduce((sum, cart) => sum + cart.totalQuantity, 0),
    };
  }, [carts]);

  return (
    <>
      <div className="header">
        <h1>Dashboard Quản Lý Giỏ Hàng</h1>
        <button className="btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
      <KPIStats
        totalRevenue={stats.totalRevenue}
        totalOrders={stats.totalOrders}
        productsSold={stats.productsSold}
      />
      <div className="table-card">
        <FilterBar
          searchMode={searchMode}
          searchQuery={searchQuery}
          minPrice={minPrice}
          maxPrice={maxPrice}
          bestSellerProduct={bestSellerProduct}
          searchInputRef={searchInputRef}
          onModeChange={handleModeChange}
          onSearchChange={setSearchQuery}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />
        {loading && <div>Đang tải dữ liệu...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && (
          <>
            <CartTables carts={paginatedCarts} onSelectCart={setSelectedCart} />
            <PaginationBar
              pageNumbers={pageNumbers}
              onPageChange={setCurrentPage}
            />
          </>
        )}
        {selectedCart && (
          <CartDetailModal
            cart={selectedCart}
            onClose={() => setSelectedCart(null)}
          />
        )}
      </div>
    </>
  );
}

function App() {
  return <CartTable />;
}

export default App;
