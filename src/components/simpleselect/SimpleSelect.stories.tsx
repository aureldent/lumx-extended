import React, { useState } from "react";

import { SimpleSelect } from "./SimpleSelect";

import { mdiMagnify, mdiAccessPoint } from "@lumx/icons";

export default {
  title: "components/SimpleSelect",
  component: SimpleSelect,
};

const choices = [
  {
    value: "1",
    label: "choice1",
    icon: mdiMagnify,
    data: {},
  },
  {
    value: "2",
    label: "choice2",
    icon: mdiAccessPoint,
    data: {},
  },
];

export const Basic = (props: any) => {
  const [pickedVal, setPickedVal] = useState(undefined);
  return <SimpleSelect {...props} onPicked={setPickedVal} value={pickedVal} />;
};
Basic.args = { choices };

export const WithSearch = Basic.bind();
WithSearch.args = { choices, withSearch: true, onSearch: undefined };

export const IsLoading = Basic.bind();
IsLoading.args = { choices: [], isLoading: true };

export const NoData = Basic.bind();
NoData.args = { choices: [], noDataFiller: "No Data in the select" };
