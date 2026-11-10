const industries = [
  {
    name: "Logistics, TMĐT",
    desc: "Chuyển phát, giao đồ ăn, sàn TMĐT, kho 3PL",
    positions: "shipper, tài xế, phân loại, đóng gói",
  },
  {
    name: "Sản xuất, kho vận",
    desc: "Nhà máy FDI, nhà máy chế biến, kho vận",
    positions: "đóng gói, lắp ráp, QC, kho",
  },
  {
    name: "F&B",
    desc: "Chuỗi nhà hàng, cafe, bếp trung tâm",
    positions: "phục vụ, thu ngân, phụ bếp",
  },
  {
    name: "Bán lẻ",
    desc: "Siêu thị, cửa hàng tiện lợi, chuỗi thời trang",
    positions: "bán hàng, thu ngân, PG/PB",
  },
  {
    name: "BPO, số hóa",
    desc: "Đơn vị số hóa, ngân hàng, bệnh viện",
    positions: "nhập liệu, scan, gắn nhãn",
  },
  {
    name: "Gia đình, chăm sóc",
    desc: "Vệ sinh, khách sạn, bệnh viện, dưỡng lão",
    positions: "tạp vụ, buồng phòng, hộ lý",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-16">
      <div className="container-main">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Sáu nhóm ngành, đúng vị trí phổ thông</h2>
          <p className="mt-3 text-gray-600">
            Mạng lưới phủ toàn quốc. Tập trung vào vị trí số lượng lớn, tiêu chí rõ, nhu cầu lặp lại
            theo mùa vụ.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 transition hover:ring-brand/30"
            >
              <div className="font-semibold text-gray-900">{item.name}</div>
              <div className="mt-1 text-sm text-gray-500">{item.desc}</div>
              <div className="mt-3 text-sm text-brand">Vị trí: {item.positions}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
