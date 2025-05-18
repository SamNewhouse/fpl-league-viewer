import { FC, memo, PropsWithChildren, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
}

const BaseLayout: FC<Props> = ({ children, className }) => {
  return (
    <>
      <div
        className={`bg-stone-900 text-white ${
          className ? " " + className : ""
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default memo<PropsWithChildren<Props>>(BaseLayout);
