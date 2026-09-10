type KPIStatsProps = {
  totalRevenue: number;
  totalOrders: number;
  productsSold: number;
};

export function KPIStats(props: KPIStatsProps) {
  return (
    <div className="main">
      <div className="name name-revenue">
        <div className="icon-box">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4b0.png" />
        </div>
        <div className="name-text">
          <p className="name-text-header">TỔNG DOANH THU (ĐÃ GIẢM GIÁ)</p>
          <div className="value">${props.totalRevenue.toFixed(2)}</div>
        </div>
      </div>
      <div className="name name-orders">
        <div className="icon-box">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4c4.png" />
        </div>
        <div className="name-text">
          <p className="name-text-header">TỔNG SỐ ĐƠN HÀNG</p>
          <div className="value">{props.totalOrders}</div>
        </div>
      </div>
      <div className="name name-sold">
        <div className="icon-box">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4e6.png" />
        </div>
        <div className="name-text">
          <p className="name-text-header">SẢN PHẨM ĐÃ BÁN</p>
          <div className="value">{props.productsSold}</div>
        </div>
      </div>
    </div>
  );
}
