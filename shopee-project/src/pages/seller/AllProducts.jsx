import React from "react";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded shadow">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <label className="block mb-1 text-gray-600">Tên sản phẩm</label>
          <input
            type="text"
            placeholder="Please input at least 2 characters of word"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Ngành hàng</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Thời trang</option>
            <option>Điện tử</option>
            <option>Sách</option>
            <option>Thể thao</option>
            <option>Khác</option>
          </select>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-600">Kho hàng</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Tối thiểu" className="w-full border rounded px-3 py-2" />
              <input type="number" placeholder="Tối đa" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Doanh số</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Tối thiểu" className="w-full border rounded px-3 py-2" />
              <input type="number" placeholder="Tối đa" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Search buttons */}
      <div className="flex gap-2 mb-6">
        <button className="bg-orange-500 text-white px-6 py-2 rounded">Tìm</button>
        <button className="border px-6 py-2 rounded">Nhập Lại</button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b mb-4 text-sm">
        <button className="border-b-2 border-orange-500 px-4 py-2 font-semibold">Tất cả</button>
        <button className="px-4 py-2">Đang hoạt động</button>
        <button className="px-4 py-2">Hết hàng 0</button>
        <button className="px-4 py-2">Chờ duyệt 0</button>
        <button className="px-4 py-2">Vi phạm 0</button>
        <button className="px-4 py-2">Đã ẩn 0</button>
      </div>

      {/* Header + Add button */}
      <div className="flex justify-between items-center mb-2 text-sm">
        <div>
          <p className="font-bold">0 Sản Phẩm</p>
          <p className="text-gray-500">Có thể đăng tải thêm 1000 sản phẩm</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/seller/post-product")}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            + Thêm 1 sản phẩm mới
          </button>
          <select className="border rounded px-2 py-1">
            <option>Công cụ xử lý hàng loạt</option>
          </select>
          <div className="flex gap-1">
            <button className="border rounded px-2 py-1">📄</button>
            <button className="border rounded px-2 py-1">🔲</button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <table className="w-full border text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tên sản phẩm</th>
            <th className="p-2 border">SKU phân loại</th>
            <th className="p-2 border">Phân loại hàng</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Kho hàng</th>
            <th className="p-2 border">Doanh số</th>
            <th className="p-2 border">Quảng cáo</th>
            <th className="p-2 border">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center text-gray-500">
            <td colSpan="8" className="py-4">Chưa có sản phẩm nào</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AllProducts;
