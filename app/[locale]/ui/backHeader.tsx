import BackBtn from "./back";
interface IProps {
  title?: string;
  showBack?: boolean;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}
export default function BackHeader({
  title,
  showBack = true,
  rightContent,
  children,
}: IProps) {
  return (
    <>
      <div className="flex-0 flex items-center justify-between h-20 p-2 border-b">
        {showBack ? <BackBtn /> : <div className="h-10 w-10"></div>}
        <div className="text-xl font-bold text-center flex-1 flex justify-center items-center">
          {children ? children : title}
        </div>
        <div className="h-10 w-10">{rightContent}</div>
      </div>
    </>
  );
}
