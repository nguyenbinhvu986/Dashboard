import type { EnrichedCart } from "../types/cart";

type CartTableProps = {
  carts: EnrichedCart[];
  onSelectCart: (cart: EnrichedCart) => void;
};

export function CartTables(props: CartTableProps) {
  return (
    <>
      <div className="data fix">
        <div>ID</div>
        <div>Khách hàng</div>
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
              <div className="customer-details">
                {cart.user ? (
                  <>
                    <img src={cart.user.image} className="customer-avatar" />
                    <div className="customer-info">
                      <div>
                        {cart.user.firstName} {cart.user.lastName}
                      </div>
                      <div>{cart.user.email}</div>
                      <div>{cart.user.address.city}</div>
                    </div>
                  </>
                ) : (
                  <span>Không rõ (User {cart.userId})</span>
                )}
              </div>
              <div>{cart.totalProducts}</div>
              <div>{cart.totalQuantity}</div>
              <div>${cart.total.toLocaleString()}</div>
              <div className="discounted">
                ${cart.discountedTotal.toLocaleString()}
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
