import type { Cart } from "./type";

type CartDetailModalProps = {
  cart: Cart;
  onClose: () => void;
};

export function CartDetailModal(props: CartDetailModalProps) {
  return (
    <div className="modal-overlay" onClick={() => props.onClose()}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>
          Chi tiết giỏ hàng #{props.cart.id} (Khách hàng {props.cart.userId})
        </h2>

        {props.cart.products.map((product) => (
          <div className="modal-product-row" key={product.id}>
            <img src={product.thumbnail} className="modal-product-thumb" />
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

        <button className="modal-close-btn" onClick={() => props.onClose()}>
          Đóng
        </button>
      </div>
    </div>
  );
}
