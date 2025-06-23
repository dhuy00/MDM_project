import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const FileInputBox = ({ label, accept, multiple, max, note }) => {
  const [fileCount, setFileCount] = useState(0);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <label className="flex flex-col items-center justify-center w-44 h-28 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-orange-500 transition">
        <FaPlus className="text-orange-500 text-lg mb-1" />
        <span className="text-sm text-orange-500 font-medium">
          Thêm {label.toLowerCase()}
        </span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            const count = e.target.files.length;
            setFileCount(count);
          }}
        />
        <span className="text-xs text-gray-500 mt-1">
          ({fileCount}/{max})
        </span>
      </label>
      {note && <p className="text-sm text-gray-500 mt-1">{note}</p>}
    </div>
  );
};


const PostProductForm = () => {
  const [variantGroups, setVariantGroups] = useState([]);

  const addVariantGroup = () => {
    const newGroup = {
      id: Date.now(),
      name: '',
      values: ['', '']
    };
    setVariantGroups([...variantGroups, newGroup]);
  };

  const addValue = (id) => {
    setVariantGroups(
      variantGroups.map(group =>
        group.id === id
          ? { ...group, values: [...group.values, ''] }
          : group
      )
    );
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-orange-500">Đăng bán sản phẩm</h1>

        {/* Thông tin cơ bản */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>

          {/* Tỷ lệ ảnh */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">* Hình ảnh sản phẩm</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center">
                <input type="radio" name="imageRatio" defaultChecked className="form-radio text-orange-500" />
                <span className="ml-2">Hình ảnh tỷ lệ 1:1</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" name="imageRatio" className="form-radio text-orange-500" />
                <span className="ml-2">Hình ảnh tỷ lệ 3:4</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Hình ảnh sản phẩm */}
            <div className="flex gap-4 items-start">
              <FileInputBox
                label="Hình ảnh"
                accept="image/*"
                multiple
                max={9}
              />
              <p className="text-sm text-gray-600 mt-16">Tải lên hình ảnh tỷ lệ 1:1 hoặc 3:4. Hỗ trợ tối đa 9 ảnh.</p>
            </div>

            {/* Ảnh bìa */}
            <div className="flex gap-4 items-start">
              <FileInputBox
                label="Ảnh bìa"
                accept="image/*"
                multiple={false}
                max={1}
              />
              <p className="text-sm text-gray-600 mt-16">
                Tải lên ảnh bìa. <br />
                Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý hôm nay,...
                Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập.
              </p>
            </div>

            {/* Video sản phẩm */}
            <div className="flex gap-4 items-start">
              <FileInputBox
                label="Video sản phẩm"
                accept="video/mp4"
                multiple={false}
                max={1}
              />
              <p className="text-sm text-gray-600 mt-11">
                Kích thước tối đa 30MB, độ phân giải không vượt quá 1280x1280px<br />
                Độ dài: 10s–60s &nbsp;&nbsp;<br />Định dạng: MP4 <br />
                <span className="italic">Lưu ý: sản phẩm có thể hiển thị trong khi video đang được xử lý. Video sẽ tự động hiển thị sau khi đã xử lý thành công.</span>
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
              <input type="text" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngành hàng *</label>
              <select className="w-full border rounded px-3 py-2">
                <option>Thời trang</option>
                <option>Điện tử</option>
                <option>Sách</option>
                <option>Thể thao</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm *</label>
              <textarea className="w-full border rounded px-3 py-2" rows="4"></textarea>
            </div>
          </div>
        </section>

        {/* Thông tin chi tiết */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Thông tin chi tiết</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thương hiệu *</label>
              <select className="w-full border rounded px-3 py-2">
                <option>No brand</option>
                <option>Apple</option>
                <option>Samsung</option>
                <option>Nike</option>
                <option>Adidas</option>
                <option>Coolmate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Chiều dài tay áo</label>
              <select className="w-full border rounded px-3 py-2" placeholder="Vui lòng chọn">
                <option>Dài tay</option>
                <option>Ngắn tay</option>
                <option>Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nhà sản xuất / Nhà xuất bản</label>
              <input type="text" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ tổ chức chịu trách nhiệm sản xuất</label>
              <input type="text" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Thông tin bán hàng */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Thông tin bán hàng</h2>
          <div className="space-y-4">
            <div>
              <label className="inline-flex items-center">
                <input type="radio" checked readOnly className="form-radio text-orange-500" />
                <span className="ml-2">Phân loại hàng</span>
              </label>
              <button onClick={addVariantGroup} className="ml-4 px-3 py-1 border border-orange-500 text-orange-500 rounded">
                + Thêm nhóm phân loại
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {variantGroups.map((group, index) => (
                <div key={group.id} className="p-4 border rounded bg-gray-50">
                  <label className="block font-medium mb-2">Tên nhóm phân loại</label>
                  <input
                    type="text"
                    value={group.name}
                    onChange={e => {
                      const updated = [...variantGroups];
                      updated[index].name = e.target.value;
                      setVariantGroups(updated);
                    }}
                    placeholder="Ví dụ: Size, Màu..."
                    className="border px-2 py-1 mb-2 w-full"
                  />
                  <div className="space-y-2">
                    {group.values.map((value, i) => (
                      <input
                        key={i}
                        type="text"
                        value={value}
                        onChange={e => {
                          const updated = [...variantGroups];
                          updated[index].values[i] = e.target.value;
                          setVariantGroups(updated);
                        }}
                        placeholder={`Giá trị ${i + 1}`}
                        className="border px-2 py-1 w-full"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addValue(group.id)}
                    className="mt-2 px-3 py-1 bg-orange-500 text-white rounded"
                  >
                    Thêm giá trị
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá *</label>
                  <input type="number" step="1000" className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kho hàng *</label>
                  <input type="number" className="w-full border rounded px-3 py-2" defaultValue={0} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vận chuyển */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Vận chuyển</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cân nặng (sau khi đóng gói) *</label>
              <input type="number" className="w-full border rounded px-3 py-2" placeholder="gram" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kích thước đóng gói (R x D x C cm)</label>
              <div className="flex gap-2">
                <input type="number" className="w-1/3 border rounded px-3 py-2" placeholder="R" />
                <input type="number" className="w-1/3 border rounded px-3 py-2" placeholder="D" />
                <input type="number" className="w-1/3 border rounded px-3 py-2" placeholder="C" />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { name: "Nhanh", price: 12800 },
              { name: "Hỏa Tốc", price: 22000 },
              { name: "Hàng Cồng Kềnh", price: 16500 }
            ].map((service, idx) => (
              <div key={idx} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <div className="font-medium">{service.name}</div>
                  <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded mt-1 inline-block">
                    SHOPEE VẬN CHUYỂN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₫</span>
                  <input
                    type="number"
                    defaultValue={service.price}
                    step="1000"
                    className="w-24 border rounded px-2 py-1 text-right"
                  />
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-green-500" defaultChecked />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-orange-500 text-white rounded">Lưu</button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PostProductForm;
