import React, { useState } from "react";

import { SimpleSelectMultiple } from "./SimpleSelectMultiple";

import { mdiMagnify, mdiAccessPoint, mdiClose } from "@lumx/icons";

export default {
  title: "components/SimpleSelectMultiple",
  component: SimpleSelectMultiple,
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
  {
    value: "3",
    label: "choice3",
    icon: mdiClose,
    data: {},
  },
];

export const Basic = (props: any) => {
  const [pickedValues, setPickedValues] = useState([]);
  return (
    <SimpleSelectMultiple
      {...props}
      onPicked={setPickedValues}
      pickedValues={pickedValues}
    />
  );
};
Basic.args = { choices };
