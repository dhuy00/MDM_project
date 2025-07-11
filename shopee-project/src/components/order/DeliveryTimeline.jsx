import React from 'react';
import { FaCheckCircle, FaTruck } from 'react-icons/fa';
import { BsDot } from 'react-icons/bs';

const DeliveryTimeline = () => {
  const steps = [
    {
      time: '11:49 09-03-2025',
      status: 'Đã giao',
      desc: 'Giao hàng thành công',
      extra: 'Xem hình ảnh giao hàng',
      isDone: true,
    },
    {
      time: '08:34 09-03-2025',
      status: 'Đang vận chuyển',
      desc: 'Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại',
      isTruck: true,
    },
    {
      time: '08:34 09-03-2025',
      desc: 'Đã sắp xếp tài xế giao hàng',
    },
    {
      time: '20:54 08-03-2025',
      desc: 'Đơn hàng đã đến trạm giao hàng tại khu vực của bạn và sẽ được giao trong vòng 24 giờ tiếp theo',
    },
    {
      time: '15:48 08-03-2025',
      desc: 'Đơn hàng đã rời kho phân loại tới 50-HCM Bình Thạnh/VTB Hub',
    },
    {
      time: '10:34 08-03-2025',
      desc: 'Đơn hàng đã đến kho phân loại',
    },
  ];

  return (
    <div className="w-full mx-auto p-4 border rounded-sm flex bg-white shadow gap-2">
      <div className='max-w-[300px]'>
        <h2 className="text-xl font-semibold mb-4">Địa Chỉ Nhận Hàng</h2>
        <div className="mb-4">
          <p className="font-medium">Võ Đức Huy</p>
          <p className="text-sm text-gray-700">(+84) 816532989</p>
          <p className="text-sm text-gray-700">
            118/45a Hẻm 118 Đường Bạch Đằng, Phường 24, Quận Bình Thạnh, TP. Hồ Chí Minh
          </p>
        </div>
      </div>

      <div className="relative border-l-2 border-gray-300 ml-3 pl-8">
        {steps.map((step, index) => (
          <div key={index} className="mb-6 relative">
            <div className="absolute -left-[28px] top-1">
              {step.isDone ? (
                <FaCheckCircle className="text-green-500 text-xl" />
              ) : step.isTruck ? (
                <FaTruck className="text-gray-500 text-xl" />
              ) : (
                <BsDot className="text-gray-400 text-3xl" />
              )}
            </div>
            <p className="text-sm text-gray-500">{step.time}</p>
            {step.status && (
              <p className="font-semibold text-sm text-gray-800">
                {step.status}
              </p>
            )}
            <p className="text-sm text-gray-700">{step.desc}</p>
            {step.extra && (
              <p className="text-sm text-blue-600 underline cursor-pointer">
                {step.extra}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTimeline;
