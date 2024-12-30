import React from "react";

type Props = {
  status: string;
};
export default function StatusBullet(props: Props) {
  const { status } = props;
  if (status === "done") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-green-500" />
        <span>Done</span>
      </div>
    );
  } else if (status === "progress") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-orange-500" />
        <span>In Progress</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-red-500" />
        <span>Starting</span>
      </div>
    );
  }
}
