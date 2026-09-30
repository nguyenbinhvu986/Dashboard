import { useState } from "react";
import type { EnrichedCart } from "../../types/cart";

type CartTableProps = {
  carts: EnrichedCart[];
  sortField: string;
  sortDirection: string;
  onSelectCart: (cart: EnrichedCart) => void;
  onSort: (field: string, direction: string) => void;
};

export function CartTables(props: CartTableProps) {
  const [showQuantitySort, setShowQuantitySort] = useState(false);
  const [showDiscountedSort, setShowDiscountedSort] = useState(false);
  const [showCustomerSort, setShowCustomerSort] = useState(false);

  const customerDirection =
    props.sortField === "customerName" ? props.sortDirection : "default";
  const quantityDirection =
    props.sortField === "totalQuantity" ? props.sortDirection : "default";
  const discountedDirection =
    props.sortField === "discountedTotal" ? props.sortDirection : "default";

  return (
    <>
      <div className="data fix">
        <div>ID</div>

        <div>
          <button
            className="sorting customer-btn"
            onClick={() => setShowCustomerSort(!showCustomerSort)}
          >
            Khách hàng ⬍
          </button>
          {showCustomerSort && (
            <div className="sorting-dropdown customer">
              <button
                className={
                  customerDirection === "default"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("customerName", "default");
                  setShowCustomerSort(false);
                }}
              >
                Mặc định
              </button>
              <button
                className={
                  customerDirection === "asc"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("customerName", "asc");
                  setShowCustomerSort(false);
                }}
              >
                A-Z
              </button>
              <button
                className={
                  customerDirection === "desc"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("customerName", "desc");
                  setShowCustomerSort(false);
                }}
              >
                Z-A
              </button>
            </div>
          )}
        </div>

        <div>Số loại SP</div>

        <div>
          <button
            className="sorting quantity-btn"
            onClick={() => setShowQuantitySort(!showQuantitySort)}
          >
            Tổng lượng SP ⬍
          </button>
          {showQuantitySort && (
            <div className="sorting-dropdown quantity">
              <button
                className={
                  quantityDirection === "default"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("totalQuantity", "default");
                  setShowQuantitySort(false);
                }}
              >
                Mặc định
              </button>
              <button
                className={
                  quantityDirection === "asc"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("totalQuantity", "asc");
                  setShowQuantitySort(false);
                }}
              >
                Tăng dần
              </button>
              <button
                className={
                  quantityDirection === "desc"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("totalQuantity", "desc");
                  setShowQuantitySort(false);
                }}
              >
                Giảm dần
              </button>
            </div>
          )}
        </div>

        <div>Tổng Tiền Gốc</div>

        <div>
          <button
            className="sorting discounted-btn"
            onClick={() => setShowDiscountedSort(!showDiscountedSort)}
          >
            Thực Thu(sau giảm) ⬍
          </button>
          {showDiscountedSort && (
            <div className="sorting-dropdown discounted">
              <button
                className={
                  discountedDirection === "default"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("discountedTotal", "default");
                  setShowDiscountedSort(false);
                }}
              >
                Mặc định
              </button>
              <button
                className={
                  discountedDirection === "asc"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("discountedTotal", "asc");
                  setShowDiscountedSort(false);
                }}
              >
                Tăng dần
              </button>
              <button
                className={
                  discountedDirection === "desc"
                    ? "sort-option selected"
                    : "sort-option"
                }
                onClick={() => {
                  props.onSort("discountedTotal", "desc");
                  setShowDiscountedSort(false);
                }}
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
