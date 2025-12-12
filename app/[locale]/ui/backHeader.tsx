import BackBtn from "./back";
interface IProps {
  title: string;
  showBack?: boolean;
}
export default function BackHeader({ title, showBack = true }: IProps) {
  return (
    <>
      <div className="flex-0 flex items-center justify-between h-20 p-2 border-b">
        {showBack && <BackBtn />}
        <div className="text-xl font-bold text-center flex-1">{title}</div>
        {showBack && <div className="h-10 w-10"></div>}
      </div>
    </>
  );
}
