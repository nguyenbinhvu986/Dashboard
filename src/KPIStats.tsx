type KPIStatsProps = {
  totalRevenue: number;
  totalOrders: number;
  productsSold: number;
};

export function KPIStats(props: KPIStatsProps) {
  return (
    <div className="main">
      <div className="name">
        <strong>TỔNG DOANH THU (ĐÃ GIẢM GIÁ)</strong>
        <div className="value green">${props.totalRevenue.toFixed(2)}</div>
      </div>
      <div className="name">
        <strong>TỔNG SỐ ĐƠN HÀNG</strong>
        <div className="value black">{props.totalOrders}</div>
      </div>
      <div className="name">
        <strong>SẢN PHẨM ĐÃ BÁN</strong>
        <div className="value orange">{props.productsSold}</div>
      </div>
    </div>
  );
}
