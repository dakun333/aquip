interface TagProps {
  count: number;

  height?: number;
}

const Tag = ({ count, height = 24 }: TagProps) => {
  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <div
      style={{
        height: `${height}px`,
      }}
      className="flex items-center justify-center rounded-md bg-red-500 text-white text-xs font-bold px-2"
    >
      {displayCount}
    </div>
  );
};

export default Tag;
