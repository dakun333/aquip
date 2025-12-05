// app/ui/checkout/form.tsx
"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IPayCardInfo } from "@/app/types/checkout.type";
import { useEffect, useRef } from "react";

const PayCardSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Cardholder name required"),
  expireDate: z.string().min(3, "Invalid date"),
  cvv: z.string().min(3, "Invalid CVV"),
});

type PayCardForm = z.infer<typeof PayCardSchema>;

interface Props {
  value?: IPayCardInfo;
  onChange?: (v: IPayCardInfo) => void;
  onValidChange?: (valid: boolean) => void;
}

export default function PaymentForm({ value, onChange, onValidChange }: Props) {
  const form = useForm<PayCardForm>({
    mode: "onChange",
    resolver: zodResolver(PayCardSchema),
    defaultValues: value,
  });

  const {
    watch,
    formState: { errors, isValid },
  } = form;

  // 使用ref记录上一次的值，避免不必要的更新
  const previousValueRef = useRef<IPayCardInfo>(value);
  const previousIsValidRef = useRef<boolean>(false);

  const watchAllFields = watch();

  // 当表单数据变化时通知父组件
  useEffect(() => {
    // 只有当值真正改变时才调用onChange
    if (
      JSON.stringify(watchAllFields) !==
      JSON.stringify(previousValueRef.current)
    ) {
      previousValueRef.current = watchAllFields;
      onChange?.(watchAllFields);
    }
  }, [watchAllFields, onChange]);

  // 当校验状态变化时通知父组件
  useEffect(() => {
    if (isValid !== previousIsValidRef.current) {
      previousIsValidRef.current = isValid;
      onValidChange?.(isValid);
    }
  }, [isValid, onValidChange]);

  return (
    <Form {...form}>
      <form className="space-y-6 mx-4">
        {/* Cardholder Name */}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Card Number */}
        <FormField
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    className="pr-12"
                    placeholder="5544 2345 8765 3456"
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Expiry Date / CVV */}
        <div className="flex space-x-4">
          <FormField
            name="expireDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="MM/YY" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="cvv"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CVV / CVC</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
