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
import {
  useEffect,
  useLayoutEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import CardValidator from "card-validator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import CardIcon from "./card-icon";
const PayCardSchema = z
  .object({
    id: z.string().trim().length(19, "Card number must be 16 digits"),
    name: z.string().trim().min(1, "Cardholder name required"),
    expireDate: z
      .string()
      .trim()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid date"),
    cvv: z
      .string()
      .trim()
      .regex(/^\d{3,4}$/, "Invalid CVV"),
    type: z.enum(CardType).optional(),
  })

  .refine(
    (data) => {
      // CVV 长度根据卡类型判断，默认 3 位
      const targetLength = data.type === CardType.Amex ? 4 : 3;
      return data.cvv.length === targetLength;
    },
    {
      message: "Invalid CVV length",
      path: ["cvv"],
    }
  );

type PayCardForm = z.infer<typeof PayCardSchema>;

interface Props {
  value?: IPayCardInfo;
  onChange?: (v: IPayCardInfo) => void;
  onValidChange?: (valid: boolean) => void;
}

export interface PaymentFormRef {
  setValue: (value: IPayCardInfo) => void;
  reset: () => void;
  getValue: () => IPayCardInfo | undefined;
}

const PaymentForm = forwardRef<PaymentFormRef, Props>(
  ({ value, onChange, onValidChange }, ref) => {
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
    // 初始化时设置为当前的 isValid 值，确保初始化时能正确判断
    const previousIsValidRef = useRef<boolean>(isValid);

    const watchAllFields = watch();
    const watchId = form.watch("id");
    const cardType =
      (CardValidator.number(watchId).card?.type as CardType) ??
      CardType.Unknown;

    // 暴露方法给父组件
    useImperativeHandle(
      ref,
      () => ({
        setValue: (newValue: IPayCardInfo) => {
          // 格式化卡号（如果有空格需要处理）
          const cardId = newValue.id?.replace(/\s/g, "") || "";
          const formattedCardId =
            cardId.length > 0
              ? cardId.replace(/(.{4})/g, "$1 ").trim()
              : newValue.id || "";

          form.setValue("name", newValue.name || "");
          form.setValue("id", formattedCardId);
          form.setValue("expireDate", newValue.expireDate || "");
          form.setValue("cvv", newValue.cvv || "");
          if (newValue.type) {
            form.setValue("type", newValue.type);
          }
          // 触发验证
          form.trigger();
        },
        reset: () => {
          form.reset();
        },
        getValue: () => {
          return form.getValues();
        },
      }),
      [form]
    );

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

    // 初始化时检查表单有效性
    useLayoutEffect(() => {
      // 在 DOM 更新后立即检查表单有效性
      // 手动触发验证以确保 isValid 是最新的
      form.trigger().then(() => {
        const currentIsValid = form.formState.isValid;
        previousIsValidRef.current = currentIsValid;
        onValidChange?.(currentIsValid);
      });
    }, []); // 空依赖数组，只在组件挂载时执行一次

    // 当校验状态变化时通知父组件
    useEffect(() => {
      // 跳过初始化时的调用（已经在上面的 useEffect 中处理）
      if (isValid !== previousIsValidRef.current) {
        previousIsValidRef.current = isValid;
        onValidChange?.(isValid);
      }
    }, [isValid, onValidChange]);

    return (
      <Form {...form}>
        <form className="space-y-6 w-full">
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

                        // 2. 限制为最多 16 位数字
                        value = value.slice(0, 16);

                        // 3. 每 4 位加空格用于展示
                        value = value.replace(/(.{4})/g, "$1 ").trim();

                        field.onChange(value);
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <CardIcon type={cardType} width={24} height={20} />
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
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="MM/YY"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        // 限制最多 4 位数字
                        value = value.slice(0, 4);
                        // 格式化为 MM/YY
                        if (value.length > 2) {
                          value = `${value.slice(0, 2)}/${value.slice(2)}`;
                        }
                        field.onChange(value);
                      }}
                    />
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
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder={cardType === CardType.Amex ? "****" : "***"}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        const maxLen = cardType === CardType.Amex ? 4 : 3;
                        value = value.slice(0, maxLen);
                        field.onChange(value);
                      }}
                    />
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
);

PaymentForm.displayName = "PaymentForm";

export default PaymentForm;
