export const ReadingHeader = ({
  topNode,
  bottomNode,
}: {
  topNode: React.ReactNode;
  bottomNode?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">{topNode}</div>
      <hr className="border-green" />
      {bottomNode && <div className="flex justify-between">{bottomNode}</div>}
    </div>
  );
};
