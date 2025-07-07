import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const FileInputBox = ({ label, accept, multiple, max, note, onChange, previewUrls = [], type = "image" }) => {
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
            onChange(e);
          }}
        />
        <span className="text-xs text-gray-500 mt-1">
          ({fileCount}/{max})
        </span>
      </label>

      {/* Hiển thị preview */}
      {type === "image" && previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Ảnh ${idx + 1}`}
              className="w-24 h-24 object-cover border rounded"
            />
          ))}
        </div>
      )}
      {type === "video" && previewUrls.length > 0 && (
        <video
          controls
          src={previewUrls[0]}
          className="w-48 mt-2 rounded border"
        />
      )}

      {note && <p className="text-sm text-gray-500 mt-1">{note}</p>}
    </div>
  );
};

const PostProductForm = () => {
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/api/uploads", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    return data.url;
  };
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Thời trang");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("No brand");
  const [sleeveLength, setSleeveLength] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturerAddress, setManufacturerAddress] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [variantGroups, setVariantGroups] = useState([]);
  const [weight, setWeight] = useState(0);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [shippingPrices, setShippingPrices] = useState({
    Nhanh: 12800,
    "Hỏa Tốc": 22000,
    "Hàng Cồng Kềnh": 16500
  });
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

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

  const handleSubmit = async () => {
    const productData = {
      name,
      category,
      description,
      brand,
      attributes: {
        sleeveLength,
        manufacturer,
        manufacturerAddress,
      },
      variantGroups: variantGroups.map(({ id, ...rest }) => rest),
      price,
      stock,
      images,
      thumbnail,
      videoUrl,
      tags: [],
      isFeatured: false,
      views: 0,
      rating: 0,
      sales: 0,
      status: "active",
      shipping: {
        weight,
        dimensions: { length, width, height },
        methods: Object.entries(shippingPrices).map(([name, price]) => ({
          name,
          price,
          enabled: true,
        }))
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert("✅ Sản phẩm đã được đăng thành công!");
        window.location.reload();
      } else {
        alert("❌ Lỗi khi đăng sản phẩm.");
      }
    } catch (err) {
      console.error("POST error:", err);
      alert("⚠️ Lỗi kết nối đến server.");
    }
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
            <div className="flex gap-4 items-start">
              <FileInputBox
                label="Hình ảnh"
                accept="image/*"
                multiple
                max={9}
                type="image"
                previewUrls={images}
                onChange={async (e) => {
                  const files = Array.from(e.target.files);
                  const urls = await Promise.all(files.map(uploadFile));
                  setImages(urls);
                }}
              />
              <p className="text-sm text-gray-600 mt-16">Tải lên hình ảnh tỷ lệ 1:1 hoặc 3:4. Hỗ trợ tối đa 9 ảnh.</p>
            </div>
            <div className="flex gap-4 items-start">
              <FileInputBox
                label="Ảnh bìa"
                accept="image/*"
                multiple={false}
                max={1}
                type="image"
                previewUrls={thumbnail ? [thumbnail] : []}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  const url = await uploadFile(file);
                  setThumbnail(url);
                }}
              />
              <p className="text-sm text-gray-600 mt-16">
                Tải lên ảnh bìa. <br />
                Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý hôm nay,...
                Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <FileInputBox
                label="Video sản phẩm"
                accept="video/mp4"
                multiple={false}
                max={1}
                type="video"
                previewUrls={videoUrl ? [videoUrl] : []}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  const url = await uploadFile(file);
                  setVideoUrl(url);
                }}
              />

              <p className="text-sm text-gray-600 mt-11">
                Kích thước tối đa 30MB, độ phân giải không vượt quá 1280x1280px<br />
                Độ dài: 10s–60s &nbsp;&nbsp;<br />Định dạng: MP4 <br />
                <span className="italic">Lưu ý: sản phẩm có thể hiển thị trong khi video đang được xử lý. Video sẽ tự động hiển thị sau khi đã xử lý thành công.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Thông tin */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngành hàng *</label>
              <select className="w-full border rounded px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Thời trang</option>
                <option>Điện tử</option>
                <option>Sách</option>
                <option>Thể thao</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm *</label>
              <textarea className="w-full border rounded px-3 py-2" rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Thương hiệu *</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Chiều dài tay áo</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={sleeveLength} onChange={(e) => setSleeveLength(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nhà sản xuất / Nhà xuất bản</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ tổ chức chịu trách nhiệm sản xuất</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={manufacturerAddress} onChange={(e) => setManufacturerAddress(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <label className="inline-flex items-center">
            <input type="radio" checked readOnly className="form-radio text-orange-500" />
            <span className="ml-2">Phân loại hàng</span>
          </label>
          <button onClick={addVariantGroup} className="ml-4 px-3 py-1 border border-orange-500 text-orange-500 rounded">
            + Thêm nhóm phân loại
          </button>
          <div className="mt-4 space-y-4">
            {variantGroups.map((group, index) => (
              <div key={group.id} className="p-4 border rounded bg-gray-50">
                <label className="block font-medium mb-2">Tên nhóm phân loại</label>
                <input type="text" value={group.name} onChange={e => {
                  const updated = [...variantGroups];
                  updated[index].name = e.target.value;
                  setVariantGroups(updated);
                }} placeholder="Ví dụ: Size, Màu..." className="border px-2 py-1 mb-2 w-full" />
                <div className="space-y-2">
                  {group.values.map((value, i) => (
                    <input key={i} type="text" value={value} onChange={e => {
                      const updated = [...variantGroups];
                      updated[index].values[i] = e.target.value;
                      setVariantGroups(updated);
                    }} placeholder={`Giá trị ${i + 1}`} className="border px-2 py-1 w-full" />
                  ))}
                </div>
                <button type="button" onClick={() => addValue(group.id)} className="mt-2 px-3 py-1 bg-orange-500 text-white rounded">
                  Thêm giá trị
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá *</label>
              <input type="number" step="1000" className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kho hàng *</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Vận chuyển</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cân nặng (gram) *</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kích thước đóng gói (R x D x C cm)</label>
              <div className="flex gap-2">
                <input type="number" className="w-1/3 border rounded px-3 py-2" placeholder="R" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                <input type="number" className="w-1/3 border rounded px-3 py-2" placeholder="D" value={length} onChange={(e) => setLength(Number(e.target.value))} />
                <input type="number" className="w-1/3 border rounded px-3 py-2" placeholder="C" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {Object.entries(shippingPrices).map(([name, price], idx) => (
              <div key={idx} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <div className="font-medium">{name}</div>
                  <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded mt-1 inline-block">
                    SHOPEE VẬN CHUYỂN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">₫</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setShippingPrices(prev => ({ ...prev, [name]: Number(e.target.value) }))}
                    step="1000"
                    className="w-24 border rounded px-2 py-1 text-right"
                  />
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-green-500" defaultChecked />
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="flex justify-end pt-4">
          <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 text-white rounded">Lưu</button>
        </div>
      </div>
    </div>
  );
};

export default PostProductForm;
