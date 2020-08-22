import React, { SyntheticEvent } from "react";

import { mdiClose, mdiMagnify } from "@lumx/icons";
import {
  Chip,
  Icon,
  List,
  ListDivider,
  ListItem,
  ListSubheader,
  SelectMultiple as LumxSelectMultiple,
  Size,
  TextField,
  Theme,
} from "@lumx/react";
import useBooleanState from "../../hooks/useBooleanState";

interface SelectChoice {
  /**
   * The label of the choice that will be displayed
   */
  label: string;
  /**
   * The value used internally for comparisons
   */
  value: string;
  /**
   * The whole data
   */
  data: any;
  /**
   * An mdi icon to put before the choice
   */
  icon?: string;
}

export interface SimpleSelectMultipleProps {
  choices: Array<SelectChoice> | undefined;
  label: string;
  pickedValues: Array<SelectChoice>;
  onPicked: (values: Array<SelectChoice>) => void;
  onInfiniteScroll?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  noDataFiller?: string | React.ReactNode;
  theme?: Theme;
}
export const SimpleSelectMultiple: React.FC<SimpleSelectMultipleProps> = ({
  choices,
  label,
  pickedValues,
  onPicked,
  onInfiniteScroll = () => undefined,
  isDisabled = false,
  isLoading = false,
  noDataFiller = undefined,
  theme = Theme.light,
}) => {
  const getChoiceByValue = (value: SelectChoice) =>
    choices?.find((ch) => ch.value === value.value);

  const choiceIsInList = (choice: SelectChoice, list: Array<SelectChoice>) =>
    list?.find((ch) => ch.value === choice.value) ? true : false;

  const [isOpen, closeSelect, , toggleSelect] = useBooleanState(false);

  const _onInfiniteScroll = () => {
    onInfiniteScroll();
  };

  const clearSelected = (event: SyntheticEvent, value: SelectChoice) => {
    event?.stopPropagation();
    onPicked(
      value ? pickedValues.filter((val) => val.value !== value.value) : []
    );
  };

  const selectItem = (item: SelectChoice) => () => {
    if (choiceIsInList(item, pickedValues)) {
      onPicked(pickedValues.filter((val) => item !== val));
      return;
    }
    onPicked([...pickedValues, item]);
  };

  const [filterValue, setFilterValue] = React.useState("");
  const filteredChoices = choices?.filter((choice) =>
    choice?.label
      .replace(" ", "")
      .toLowerCase()
      .includes(filterValue.replace(" ", "").toLowerCase())
  );

  const selectedChipRender = (
    choice: SelectChoice,
    index: number,
    onClear: any,
    isDisabled: boolean
  ) => {
    const onClick = (event: SyntheticEvent) =>
      onClear && onClear(event, choice);
    return (
      <Chip
        theme={theme}
        key={index}
        after={onClear && <Icon icon={mdiClose} size={Size.xxs} />}
        before={choice.icon && <Icon size={Size.xs} icon={choice.icon} />}
        isDisabled={isDisabled}
        size={Size.s}
        onAfterClick={onClick}
        onClick={onClick}
      >
        {choice.label}
      </Chip>
    );
  };
  const selectedValueRender = (choice: SelectChoice) => {
    const matchedChoice = getChoiceByValue(choice);
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Icon
          theme={theme}
          size={Size.xs}
          icon={(matchedChoice && false) || ""}
          style={{ marginRight: 5 }}
        />
        {matchedChoice && matchedChoice.label}
      </div>
    );
  };

  return (
    <LumxSelectMultiple
      style={{ width: "100%" }}
      isOpen={isOpen}
      value={pickedValues}
      label={label}
      onClear={clearSelected}
      onDropdownClose={closeSelect}
      onInputClick={toggleSelect}
      onInfiniteScroll={_onInfiniteScroll}
      selectedChipRender={selectedChipRender}
      selectedValueRender={selectedValueRender}
      isDisabled={isDisabled}
      isLoading={isLoading}
      theme={theme}
    >
      <List isClickable={isOpen}>
        <ListSubheader>
          <TextField
            theme={theme}
            style={{ width: "100%", padding: 0 }}
            value={filterValue}
            onChange={setFilterValue}
            icon={mdiMagnify}
            size={Size.tiny}
          />
        </ListSubheader>
        <ListDivider />
        {filteredChoices && filteredChoices.length > 0
          ? filteredChoices.map((choice: SelectChoice, index: number) => (
              <ListItem
                key={index}
                onItemSelected={selectItem(choice)}
                before={
                  choice.icon && (
                    <Icon theme={theme} size={Size.xs} icon={choice.icon} />
                  )
                }
                size={Size.tiny}
              >
                <div>{choice.label}</div>
              </ListItem>
            ))
          : [
              <ListItem key={0} size={Size.tiny}>
                {noDataFiller ? noDataFiller : "No data"}
              </ListItem>,
            ]}
      </List>
    </LumxSelectMultiple>
  );
};
