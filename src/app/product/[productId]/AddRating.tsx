"use client";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import Input from "@/components/inputs/input";
import { SafeUser } from "@/types";
import { Rating } from "@mui/material";
import { Order, Product, Review } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitErrorHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface RattingProps {
  product: Product & {
    reviews: Review[];
  };
  user:
    | (SafeUser & {
        orders: Order[];
      })
    | null;
}

const AddRating = ({ product, user }: RattingProps) => {
  const [isLoading, setIsloading] = useState(false);
  const route = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldTouch: true,
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitErrorHandler<FieldValues> = async (data: any) => {
    setIsloading(true);
    if (data.rating === 0) return toast.error("Please select rating");
    const ratingData = { ...data, userId: user?.id, product: product };

    axios
      .post("/api/rating", ratingData)
      .then(() => {
        toast.success("Rating submitted");
        route.refresh();
        reset();
      })
      .catch((error) => {
        toast.error("Sorry. something happened!"+error);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  if(!user || !product ) return null

  const deliveredOrder =user?.orders.some(order =>order.products.find(
    item =>item.id ==product.id) && order.deliveryStatus === 'delivered')

    const userReview = product?.reviews.find(((review: Review)=>{
        return review.userId ===user.id;
    }))

    if(userReview || !deliveredOrder) return null

  return (
    <div className="flex flex-col gap-2 max-w-[500px] ">
      <Heading title="WELCOME AGAIN RATE THIS PRODUCT" />
      <Rating
        onChange={(event, newValue) => {
          setCustomValue("rating", newValue);
        }}
      />
      <Input
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? "Loading" : "Rate Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default AddRating;
