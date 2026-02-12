import { Copy } from "lucide-react";
import { AQButton } from "../button";
import { toast } from "sonner";

export function CopyButton({ value }: { value: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <AQButton variant="ghost" size="icon" onClick={handleCopy}>
      <Copy size={16} className="hover:text-primary active:scale-95" />
    </AQButton>
  );
}
