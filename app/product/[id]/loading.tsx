import BackHeader from "@/app/ui/backHeader";

export default function ProductDeatilLoading() {
  return (
    <div className="flex flex-col  h-full">
      <BackHeader title="" />
      <div className="flex-1 justify-center items-center">
        <div className="h-6 w-2/3 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );
}
