"use client";
import React from "react";
import Image from "next/image";
import truncate from "../../../utils/truncate";
import priceFormat from "../../../utils/priceFormat";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  data: any;
}

const ProductCard = ({ data }: ProductCardProps) => {
  const router = useRouter();
  const ratingProduct =
    data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    data.reviews.length;

  // Format the Dropbox URL
  const formattedImageUrl = data.image
    .replace("www.dropbox.com", "dl.dropboxusercontent.com")
    .replace("?dl=1", ""); // Remove the query parameter if it exists

  return (
    <div
      key={data.id}
      onClick={() => router.push(`/product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 mx-1 my-1 transition hover:scale-105 text-center text-sm"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="aspect-square overflow-hidden relative w-full">
          <Image
            src={formattedImageUrl}
            alt={data.name}
            fill
            className="object-contain"
            sizes="100vw"
            quality={75} // Adjust quality if needed
          />
        </div>

        <div className="mt-4 font-bold">{data.category}</div>
        <div className="mt-2">{truncate(data.name)}</div>
        <div className="font-bold">{priceFormat(data.price)}</div>
        <div>
          <Rating value={ratingProduct} readOnly />
        </div>
        <div>{data.reviews.length} reviews</div>
      </div>
    </div>
  );
};

export default ProductCard;
