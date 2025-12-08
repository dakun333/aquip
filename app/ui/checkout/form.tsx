// app/ui/checkout/form.tsx
"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardType, IPayCardInfo } from "@/app/types/checkout.type";
import { useEffect, useRef } from "react";
import CardValidator from "card-validator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import CardIcon from "./card-icon";
const PayCardSchema = z.object({
  id: z.string().trim().length(19, "Card number must be 16 digits"),
  name: z.string().trim().min(1, "Cardholder name required"),
  expireDate: z.string().trim().min(3, "Invalid date"),
  cvv: z.string().trim().min(3, "Invalid CVV"),
  type: z.enum(CardType).optional(),
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
  const watchId = form.watch("id");
  const cardType = CardValidator.number(watchId).card?.type as CardType;

  // 当表单数据变化时通知父组件
  useEffect(() => {
    // 只有当值真正改变时才调用onChange

    if (
      JSON.stringify(watchAllFields) !==
      JSON.stringify(previousValueRef.current)
    ) {
      // const cardType = CardValidator.number(watchId).card?.type as CardType;
      form.setValue("type", cardType);
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
                <Input {...field} placeholder="Name on card" />
              </FormControl>
              <FormMessage />
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
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    value={field.value || ""}
                    className="pr-12"
                    placeholder="**** **** **** ****"
                    onChange={(e) => {
                      let value = e.target.value;

                      // 1. 去掉非数字
                      value = value.replace(/\D/g, "");

                      // 2. 每 4 位加空格
                      value = value.replace(/(.{4})/g, "$1 ").trim();

                      field.onChange(value);
                    }}
                  />
                  <InputGroupAddon align="inline-end">
                    <CardIcon type={cardType} width={32} height={28} />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expiry Date / CVV */}
        <div className="flex space-x-4 items-start">
          <FormField
            name="expireDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="MM/YY" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="cvv"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CVV / CVC</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="***" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
