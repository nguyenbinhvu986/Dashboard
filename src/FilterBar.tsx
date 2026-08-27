interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal: number;
  thumbnail: string;
}

type FilterBarProps = {
  searchMode: string;
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  bestSellerProduct: CartProduct | undefined;
  searchInputRef: { current: HTMLInputElement | null };
  onModeChange: (mode: string) => void;
  onSearchChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
};

export function FilterBar(props: FilterBarProps) {
  return (
    <div className="search-container">
      <select
        className="search-mode-select"
        value={props.searchMode}
        onChange={function (e) {
          props.onModeChange(e.target.value);
        }}
      >
        <option value="userId">Theo User ID</option>
        <option value="productId">Theo ID sản phẩm</option>
        <option value="priceRange">Theo khoảng giá</option>
        <option value="topSpender">Đơn hàng chi tiêu nhiều nhất</option>
        <option value="bestSeller">Sản phẩm bán chạy nhất</option>
      </select>

      {props.searchMode === "priceRange" && (
        <>
          <input
            type="number"
            className="search-input"
            placeholder="Giá từ..."
            value={props.minPrice}
            onChange={function (e) {
              props.onMinPriceChange(e.target.value);
            }}
          />
          <input
            type="number"
            className="search-input"
            placeholder="Đến..."
            value={props.maxPrice}
            onChange={function (e) {
              props.onMaxPriceChange(e.target.value);
            }}
          />
        </>
      )}

      {(props.searchMode === "userId" || props.searchMode === "productId") && (
        <>
          <span className="search-icon">🔍</span>
          <input
            ref={props.searchInputRef}
            type="text"
            className="search-input"
            placeholder={
              props.searchMode === "userId"
                ? "Nhập User ID..."
                : "Nhập ID sản phẩm..."
            }
            value={props.searchQuery}
            onChange={function (e) {
              props.onSearchChange(e.target.value);
            }}
          />
        </>
      )}

      {props.searchMode === "bestSeller" && props.bestSellerProduct && (
        <span className="best-seller-info">
          {props.bestSellerProduct.title} (ID: {props.bestSellerProduct.id})
        </span>
      )}
    </div>
  );
}
