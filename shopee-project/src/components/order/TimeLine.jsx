import React from 'react';
import { FaReceipt, FaMoneyBill, FaRegStar } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { LuRadioReceiver } from "react-icons/lu";

const TimelineIcon = ({ icon: Icon, label, time, isLast }) => {
  return (
    <div className='flex flex-col items-center relative'>
      {/* Icon */}
      <div className='flex items-center justify-center relative z-10'>
        <div className='flex items-center justify-center border-[4px] w-16 h-16 rounded-full border-green-500 bg-white'>
          <Icon className='text-green-500 text-[2rem]' />
        </div>
        {/* Line to next icon (only if not last) */}
        {!isLast && (
          <div className='absolute top-1/2 left-full w-[140px] h-1 bg-green-500 -translate-y-1/2 z-0'></div>
        )}
      </div>
      <span className='mt-2 text-center'>{label}</span>
      <span className='text-sm text-gray-400'>{time}</span>
    </div>
  );
};

const TimeLine = () => {
  const steps = [
    { icon: FaReceipt, label: "Đơn hàng đã đặt", time: "19:04 03-03-2025" },
    { icon: FaMoneyBill, label: "Thanh toán thành công", time: "19:05 03-03-2025" },
    { icon: MdLocalShipping, label: "Đã bàn giao vận chuyển", time: "20:00 03-03-2025" },
    { icon: LuRadioReceiver, label: "Đang giao hàng", time: "11:30 04-03-2025" },
    { icon: FaRegStar, label: "Đã giao thành công", time: "15:45 04-03-2025" }
  ];

  return (
    <div className='flex gap-8 relative overflow-x-auto px-4 bg-white w-full 
    justify-center py-4'>
      {steps.map((step, index) => (
        <TimelineIcon
          key={index}
          icon={step.icon}
          label={step.label}
          time={step.time}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
};

export default TimeLine;
