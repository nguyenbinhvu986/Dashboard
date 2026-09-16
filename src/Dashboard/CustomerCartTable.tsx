import { useState } from "react";
import type { EnrichedCart } from "../types/cart";

type CartTableProps = {
  carts: EnrichedCart[];
  onSelectCart: (cart: EnrichedCart) => void;
  onSort: (field: string, direction: string) => void;
};

export function CartTables(props: CartTableProps) {
  const [showQuantitySort, setShowQuantitySort] = useState(false);
  const [showDiscountedSort, setShowDiscountedSort] = useState(false);
  const [showCustomerSort, setShowCustomerSort] = useState(false);

  return (
    <>
      <div className="data fix">
        <div>ID</div>
        <div tabIndex={-1} onBlur={() => setShowCustomerSort(false)}>
          <button
            className="sorting customer-btn"
            onClick={() => setShowCustomerSort(!showCustomerSort)}
          >
            Khách hàng
          </button>
          {showCustomerSort && (
            <div className="sorting-dropdown customer">
              <button
                className="sorting-customer-default"
                onClick={() => props.onSort("customerName", "default")}
              >
                Mặc định
              </button>
              <button
                className="sorting-customer-A-Z"
                onClick={() => props.onSort("customerName", "asc")}
              >
                A-Z
              </button>
              <button
                className="sorting-customer-Z-A"
                onClick={() => props.onSort("customerName", "desc")}
              >
                Z-A
              </button>
            </div>
          )}
        </div>
        <div>Số loại SP</div>
        <div tabIndex={-1} onBlur={() => setShowQuantitySort(false)}>
          <button
            className="sorting quantity-btn"
            onClick={() => setShowQuantitySort(!showQuantitySort)}
          >
            Tổng lượng SP
          </button>
          {showQuantitySort && (
            <div className="sorting-dropdown quantity">
              <button
                className="sorting-quantity-default"
                onClick={() => props.onSort("totalQuantity", "default")}
              >
                Mặc định
              </button>
              <button
                className="sorting-quantity-ascending"
                onClick={() => props.onSort("totalQuantity", "asc")}
              >
                Tăng dần
              </button>
              <button
                className="sorting-quantity-descending"
                onClick={() => props.onSort("totalQuantity", "desc")}
              >
                Giảm dần
              </button>
            </div>
          )}
        </div>
        <div>Tổng Tiền Gốc</div>
        <div tabIndex={-1} onBlur={() => setShowDiscountedSort(false)}>
          <button
            className="sorting discounted-btn"
            onClick={() => setShowDiscountedSort(!showDiscountedSort)}
          >
            Thực Thu(sau giảm)
          </button>
          {showDiscountedSort && (
            <div className="sorting-dropdown discounted">
              <button
                className="sorting-discounted-default"
                onClick={() => props.onSort("discountedTotal", "default")}
              >
                Mặc định
              </button>
              <button
                className="sorting-discounted-ascending"
                onClick={() => props.onSort("discountedTotal", "asc")}
              >
                Tăng dần
              </button>
              <button
                className="sorting-discounted-descending"
                onClick={() => props.onSort("discountedTotal", "desc")}
              >
                Giảm dần
              </button>
            </div>
          )}
        </div>
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
