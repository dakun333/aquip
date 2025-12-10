import BackBtn from "./back";
interface IProps {
  title: string;
}
export default function BackHeader({ title }: IProps) {
  return (
    <>
      <div className="flex-0 flex items-center justify-between h-20 p-2 border-b">
        <BackBtn />
        <div className="text-xl font-bold">{title}</div>
        <div className="h-10 w-10"></div>
      </div>
    </>
  );
}
