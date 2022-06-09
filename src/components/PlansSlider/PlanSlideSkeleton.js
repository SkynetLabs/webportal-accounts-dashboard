import Skeleton from "react-loading-skeleton";

import { Panel } from "../Panel";

export const PlanPanelSkeleton = () => (
  <Panel
    className="min-h-[620px] px-6 py-10 flex flex-col relative h-full shadow-md justify-between"
    wrapperClassName="h-full"
  >
    <div>
      <h3>
        <Skeleton count={1} />
      </h3>
      <Skeleton count={4} />
      <Skeleton count={1} />
    </div>

    <div>
      <h2>
        <Skeleton count={1} />
      </h2>
    </div>

    <div className="flex flex-col gap-2">
      <Skeleton count={2} />
      <Skeleton count={2} />
      <Skeleton count={2} />
      <Skeleton count={2} />
    </div>
  </Panel>
);
