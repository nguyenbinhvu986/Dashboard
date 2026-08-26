import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./index.css";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext) as ThemeContextType;
}

interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  products: CartProduct[];
}

function CartTable() {
  const { theme, toggleTheme } = useTheme();

  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchMode, setSearchMode] = useState("userId");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải dữ liệu giỏ hàng.",
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const getBestSellerProductId = (): number | null => {
    const quantityMap = new Map<number, number>();

    carts
      .flatMap((cart) => cart.products)
      .forEach((product) => {
        quantityMap.set(
          product.id,
          (quantityMap.get(product.id) ?? 0) + product.quantity,
        );
      });

    let bestProductId: number | null = null;
    let bestQuantity = 0;

    quantityMap.forEach((quantity, productId) => {
      if (quantity > bestQuantity) {
        bestQuantity = quantity;
        bestProductId = productId;
      }
    });

    return bestProductId;
  };

  const filteredCarts = carts.filter((cart) => {
    const query = searchQuery.trim();

    if (searchMode === "userId") {
      return query === "" || cart.userId === Number(query);
    }

    if (searchMode === "productId") {
      return query === "" || cart.products.some((p) => String(p.id) === query);
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
      const bestId = getBestSellerProductId();
      return cart.products.some((p) => p.id === bestId);
    }

    return true;
  });

  const totalRevenue = carts.reduce(
    (sum, cart) => sum + cart.discountedTotal,
    0,
  );
  const totalOrders = carts.length;
  const productsSold = carts.reduce((sum, cart) => sum + cart.totalQuantity, 0);

  const handleModeChange = (mode: string) => {
    setSearchMode(mode);
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    filterChangeCountRef.current += 1;
    console.log("Số lần đổi bộ lọc:", filterChangeCountRef.current);
  };

  const bestSellerId =
    searchMode === "bestSeller" ? getBestSellerProductId() : null;
  const bestSellerProduct = carts
    .flatMap((c) => c.products)
    .find((p) => p.id === bestSellerId);

  return (
    <>
      <div className="header">
        <h1>🛒 Dashboard Quản Lý Giỏ Hàn</h1>
        <button className="btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <div className="main">
        <div className="name">
          <strong>TỔNG DOANH THU (ĐÃ GIẢM GIÁ)</strong>
          <div className="value green">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="name">
          <strong>TỔNG SỐ ĐƠN HÀNG</strong>
          <div className="value black">{totalOrders}</div>
        </div>
        <div className="name">
          <strong>SẢN PHẨM ĐÃ BÁN</strong>
          <div className="value orange">{productsSold}</div>
        </div>
      </div>

      <div className="search-container">
        <select
          className="search-mode-select"
          value={searchMode}
          onChange={(e) => handleModeChange(e.target.value)}
        >
          <option value="userId">Theo User ID</option>
          <option value="productId">Theo ID sản phẩm</option>
          <option value="priceRange">Theo khoảng giá</option>
          <option value="topSpender">Đơn hàng chi tiêu nhiều nhất</option>
          <option value="bestSeller">Sản phẩm bán chạy nhất</option>
        </select>

        {searchMode === "priceRange" && (
          <>
            <input
              type="number"
              className="search-input"
              placeholder="Giá từ..."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              className="search-input"
              placeholder="Đến..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </>
        )}

        {(searchMode === "userId" || searchMode === "productId") && (
          <>
            <span className="search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder={
                searchMode === "userId"
                  ? "Nhập User ID..."
                  : "Nhập ID sản phẩm..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </>
        )}

        {searchMode === "bestSeller" && bestSellerProduct && (
          <span className="best-seller-info">
            {bestSellerProduct.title} (ID: {bestSellerProduct.id})
          </span>
        )}
      </div>

      <div className="data fix">
        <div>Cart ID</div>
        <div>User ID</div>
        <div>Số loại SP</div>
        <div>Tổng số lượng</div>
        <div>Tổng tiền gốc</div>
        <div>Thực thu (Sau giảm)</div>
        <div>Hành động</div>
      </div>

      {loading && <div>Đang tải dữ liệu...</div>}

      {error && <div>{error}</div>}

      {!loading && !error && (
        <div className="cart-table-wrapper">
          {filteredCarts.length === 0 ? (
            <div className="no-result">Không tìm thấy kết quả phù hợp.</div>
          ) : (
            filteredCarts.map((cart) => (
              <div className="data" key={cart.id}>
                <div>#{cart.id}</div>
                <div>User {cart.userId}</div>
                <div>{cart.totalProducts}</div>
                <div>{cart.totalQuantity}</div>
                <div>${cart.total.toFixed(2)}</div>
                <div className="discounted">
                  ${cart.discountedTotal.toFixed(2)}
                </div>
                <div>
                  <button
                    className="detail-btn"
                    onClick={() => setSelectedCart(cart)}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedCart && (
        <div className="modal-overlay" onClick={() => setSelectedCart(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>
              Chi tiết giỏ hàng #{selectedCart.id} (Khách hàng{" "}
              {selectedCart.userId})
            </h2>

            {selectedCart.products.map((product) => (
              <div className="modal-product-row" key={product.id}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="modal-product-thumb"
                />
                <div className="modal-product-info">
                  <strong>{product.title}</strong>
                  <span>
                    SL: {product.quantity} x ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="modal-product-total">
                  ${product.total.toFixed(2)}
                </div>
              </div>
            ))}

            <button
              className="modal-close-btn"
              onClick={() => setSelectedCart(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartTable />
    </ThemeProvider>
  );
}

export default App;
