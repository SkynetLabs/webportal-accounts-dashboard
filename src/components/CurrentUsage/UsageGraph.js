import styled from "styled-components";

import usageGraphBg from "../../../static/images/usage-graph-bg.svg";

export const UsageGraph = styled.div.attrs({
  className: "w-full my-3 grid grid-flow-row grid-rows-2",
})`
  height: 146px;
  background: url(${usageGraphBg}) no-repeat;
  background-size: cover;
`;
