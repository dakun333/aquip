import { RechargeRecord } from "@/app/types/api.type";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatMoney } from "../../utils/format";
import clsx from "clsx";
const statusMap = {
  success: {
    label: "成功",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  failed: {
    label: "失败",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  pending: {
    label: "待处理",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
};

interface IProps {
  record: RechargeRecord;
}

export default function RechargeCard({ record }: IProps) {
  return (
    <Item variant="outline" className="cursor-pointer hover:bg-accent/50">
      <ItemContent>
        <ItemTitle>{record.id}</ItemTitle>
        <ItemDescription className="flex  gap-2">
          <div className="text-sm text-gray-500">
            {formatMoney(record.amount, { unit: record.currency })}
          </div>
          <div className="text-sm text-gray-500">
            {record.createdAt.toLocaleDateString()}
          </div>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <div
          className={clsx(
            "w-16 text-center rounded-md px-2 py-1",
            statusMap[record.status as keyof typeof statusMap]?.color,
            statusMap[record.status as keyof typeof statusMap]?.bgColor
          )}
        >
          {statusMap[record.status as keyof typeof statusMap]?.label}
        </div>
      </ItemActions>
    </Item>
  );
}
