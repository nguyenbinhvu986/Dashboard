import { useEffect, useRef, useState, useMemo } from "react";
import "./index.css";
import { KPIStats } from "./Dashboard/AdvancedKPI.tsx";
import { FilterBar } from "./Dashboard/FilterPanel.tsx";
import { CartTables } from "./Dashboard/CustomerCartTable.tsx";
import { CartDetailModal } from "./Dashboard/CartDetailModal.tsx";
import type { CartProduct, Cart } from "./types/cart";
import { useECommerceData } from "./Hooks/useECommerceData";
import { useDebounce } from "./Hooks/useDebounce";
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
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("default");
  const ecommerceData = useECommerceData();
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [searchMode, setSearchMode] = useState("userId");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterChangeCountRef = useRef(0);
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

    ecommerceData.enrichedCarts
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
  }, [ecommerceData.enrichedCarts, searchMode]);

  //lọc giỏ hàng dựa trên chế độ tìm kiếm và các điều kiện khác
  const filteredCarts = useMemo(() => {
    return ecommerceData.enrichedCarts.filter((cart) => {
      const query = debouncedSearchQuery.trim();

      if (searchMode === "customerInfo") {
        if (query === "") {
          return true;
        }
        const lowerQuery = query.toLowerCase();
        const fullName =
          cart.user === undefined
            ? ""
            : (cart.user.firstName + " " + cart.user.lastName).toLowerCase();
        const email =
          cart.user === undefined ? "" : cart.user.email.toLowerCase();
        return fullName.includes(lowerQuery) || email.includes(lowerQuery);
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
        const maxSpending = Math.max(
          ...ecommerceData.enrichedCarts.map((c) => c.discountedTotal),
        );
        return cart.discountedTotal === maxSpending;
      }

      if (searchMode === "bestSeller") {
        return cart.products.some((p) => p.id === bestSellerProduct?.id);
      }

      return true;
    });
  }, [
    ecommerceData.enrichedCarts,
    searchMode,
    debouncedSearchQuery,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);
  const handleSort = (field: string, direction: string) => {
    setSortField(direction === "default" ? "" : field);
    setSortDirection(direction);
  };
  // Phân trang
  const itemsPerPage = 30;
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredCarts.length / itemsPerPage));
  }, [ecommerceData.enrichedCarts, filteredCarts]);
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
      totalRevenue: ecommerceData.enrichedCarts.reduce(
        (sum, cart) => sum + cart.discountedTotal,
        0,
      ),
      totalOrders: ecommerceData.enrichedCarts.length,
      productsSold: ecommerceData.enrichedCarts.reduce(
        (sum, cart) => sum + cart.totalQuantity,
        0,
      ),
    };
  }, [ecommerceData.enrichedCarts]);

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
        {ecommerceData.loading && <div>Đang tải dữ liệu...</div>}
        {ecommerceData.error && <div>{ecommerceData.error}</div>}
        {!ecommerceData.loading && !ecommerceData.error && (
          <>
            <CartTables carts={paginatedCarts} onSelectCart={setSelectedCart} />
            <PaginationBar
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              currentPage={currentPage}
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
