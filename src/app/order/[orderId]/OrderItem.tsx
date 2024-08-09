import { CartProductType } from "@prisma/client";
import React from "react";
import Image from "next/image";
import truncate from "../../../../utils/truncate";
import priceFormat from "../../../../utils/priceFormat";

interface Props {
  item: CartProductType;
}
const OrderItem = ({ item }: Props) => {
    const formattedImageUrl = item.image
    .replace("www.dropbox.com", "dl.dropboxusercontent.com")
    .replace("?dl=1", ""); // Remove the query parameter if it exists

    return (
        <div
          className="grid grid-cols-5 text-xs md:text-sm gap-4 border-[15px]
          border-rose-200 py-4 items-center"
        >
          <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
            <div className="relative w-[70px] aspect-square">
              <Image src={formattedImageUrl} alt="image" fill className="object-contain" />
            </div>
            <div>{truncate(item.name)}</div>
          </div>
          <div className="justify-self-center">{priceFormat(item.price)}</div>
          <div className="justify-self-center">{item.quantity}</div>
          <div className="justify-self-center font-bold">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      );
      
};

export default OrderItem;
