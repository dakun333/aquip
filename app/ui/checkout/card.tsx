import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { IPayCardInfo } from "@/app/types/checkout.type";
import CardIcon from "./card-icon";
interface IProps {
  cardInfo: IPayCardInfo;
}
export default function VirtualCard({ cardInfo }: IProps) {
  return (
    <Card className="w-full bg-black text-white aspect-[85.6/53.98] shadow-2xl relative">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          {/* Replace with your logo/icon */}
          <div className="h-8 w-12 bg-yellow-500 rounded-sm"></div>
          <CardIcon type={cardInfo?.type} />
          {/* <Image src="/visa.svg" alt="VISA" width={40} height={25} /> */}
        </div>

        {/* Card Number */}
        <p className="text-xl tracking-wider font-mono">{cardInfo?.id}</p>

        {/* Details */}
        <div className="flex justify-between text-sm uppercase">
          <div>
            <Label className="text-xs text-gray-400">Card Holder</Label>
            <p className="font-semibold">{cardInfo?.name}</p>
          </div>
          <div className="text-right">
            <Label className="text-xs text-gray-400">Expires</Label>
            <p className="font-semibold">{cardInfo?.expireDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
