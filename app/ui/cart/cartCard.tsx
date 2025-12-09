import { Shop } from "@/app/types/cart.type";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import type { CheckedState } from "@radix-ui/react-checkbox";
import NumberInput from "../input-number";
import { formatMoney } from "@/app/utils/format";
interface IProps {
  shop: Shop;
}
const CheckedEnum = {
  0: false,
  1: "indeterminate",
  2: true,
} satisfies Record<number, CheckedState>;
export default function CartCard({ shop }: IProps) {
  if (!shop) {
    return;
  }

  return (
    <div className="flex flex-col mb-2 rounded-md px-4 pt-4 pb-8 bg-white ">
      <div className="flex items-center gap-2 h-6 mb-2">
        <Checkbox
          className="my-auto"
          defaultChecked={CheckedEnum[shop.checked]}
        />

        <span className="text-xl">{shop.name}</span>
      </div>
      <div className="">
        {shop.items.map((item) => (
          <div key={item.id} className="flex items-stretch gap-2 mt-2 h-20">
            <div className="flex">
              <Checkbox
                className="my-auto"
                defaultChecked={CheckedEnum[shop.checked]}
              />
            </div>
            <div className="relative aspect-square">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <div className="py-1 flex items-stretch flex-1">
              <div className="flex flex-col w-full">
                <span>{item.name}</span>
                <div className="flex justify-between">
                  <div className="flex flex-col text-[red] grow text-xs">
                    <span className="flex-1">
                      <span className="text-base">
                        {formatMoney(item.count * item.price)}
                      </span>
                      <span className="text-xs"> 到手价</span>
                    </span>
                    <span className="text-xs">
                      {formatMoney(item.count * item.discount)}
                    </span>
                  </div>
                  <NumberInput
                    min={0}
                    max={10}
                    value={0}
                    onChange={(v) => {}}
                    // className="w-25"
                  ></NumberInput>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
