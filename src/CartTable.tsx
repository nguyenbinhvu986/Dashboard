import type { Cart } from "./type";

type CartTableProps = {
  carts: Cart[];
  onSelectCart: (cart: Cart) => void;
};

export function CartTables(props: CartTableProps) {
  return (
    <>
      <div className="data fix">
        <div>Cart ID</div>
        <div>User ID</div>
        <div>Số loại SP</div>
        <div>Tổng Số Lượng</div>
        <div>Tổng Tiền Gốc</div>
        <div>Thực Thu (Sau Giảm)</div>
        <div>Hành Động</div>
      </div>
      <div className="cart-table-wrapper">
        {props.carts.length === 0 ? (
          <div className="no-result">Không tìm thấy kết quả phù hợp.</div>
        ) : (
          props.carts.map((cart) => (
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
                  onClick={() => props.onSelectCart(cart)}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
