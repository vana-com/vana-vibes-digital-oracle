import BlockLoader from "./BlockLoader";

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

export const ReadingHeaderLoading = ({
  bottomNode,
}: {
  bottomNode?: React.ReactNode;
}) => {
  return (
    <ReadingHeader
      topNode={
        <div className="text-label text-green flex items-center gap-4">
          <BlockLoader mode={6} />
          Running divination
        </div>
      }
      bottomNode={
        <div className="text-label text-green flex items-center gap-4">
          {bottomNode}
        </div>
      }
    />
  );
};
