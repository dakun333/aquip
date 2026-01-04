import { CardType, ICard } from "@/app/types/checkout.type";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatMoney } from "../../utils/format";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { CardBagTestData } from "./card-bag.data";
import CardIcon from "./card-icon";
interface CardBagDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (item: ICard) => void;
}
export default function CardBagDialog({
  open,
  onOpenChange,
  onSelect,
}: CardBagDialogProps) {
  const [list, setList] = useState<ICard[]>(CardBagTestData);
  const t = useTranslations("checkout");
  const selectCadrHandle = (item: ICard) => {
    onSelect(item);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl w-[480px]  flex flex-col items-center gap-2 aspect-48/56">
        <DialogHeader className="w-full">
          <DialogTitle className="text-center text-base font-semibold">
            {t("select_card_title")}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full  flex flex-col gap-2 ">
          {list.map((item) => (
            <Item
              key={item.id}
              variant="outline"
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => selectCadrHandle(item)}
            >
              <ItemContent>
                <ItemTitle>{item.id}</ItemTitle>
                <ItemDescription className="flex  gap-2">
                  <span>{item.name}</span>
                  <span>{item.expireDate}</span>
                  <span>{item.cvv}</span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <CardIcon type={item.type} />
              </ItemActions>
            </Item>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
