import { TTabItem } from "./Tabs.types";
// import { FileInput } from "../file-input";
// import { Row } from "../rows";
// import { Text } from "@docspace/ui-kit/components/text";
// import { InputSize } from "@docspace/ui-kit/components/text-input";

export const data: TTabItem[] = [
  {
    id: "Overview",
    name: "Overview",
    content: (
      // <FileInput
      // 	accept={[".doc", ".docx"]}
      // 	id="file-input-id"
      // 	name="demoFileInputName"
      // 	onInput={() => {}}
      // 	placeholder="Input file"
      // 	size={InputSize.base}
      // />
      <p>Overview content</p>
    ),
  },
  {
    id: "Documents",
    name: "Documents",
    content: <p>Documents</p>,
  },
  {
    id: "Milestones",
    name: "Milestones",
    content: (
      // <Row
      // 	key="1"
      // 	checked
      // 	contextOptions={[
      // 		{
      // 			key: "key1",
      // 			label: "Edit",
      // 			onClick: () => {},
      // 		},
      // 		{
      // 			key: "key2",
      // 			label: "Delete",
      // 			onClick: () => {},
      // 		},
      // 	]}
      // 	onRowClick={() => {}}
      // 	onSelect={() => {}}
      // 	isIndexEditingMode
      // 	onChangeIndex={() => {}}
      // >
      // 	<div
      // 		style={{
      // 			alignItems: "center",
      // 			justifyContent: "space-between",
      // 			display: "flex",
      // 		}}
      // 	>
      // 		<Text truncate>Sample text</Text>
      // 	</div>
      // </Row>
      <p>Milestones content</p>
    ),
  },
  {
    id: "Time",
    name: "Time",
    content: <p>Time tracking</p>,
  },
  {
    id: "Contacts",
    name: "Contacts",
    isDisabled: true,
    content: <p>Contacts</p>,
  },
  {
    id: "Team",
    name: "Team",
    content: <p>Team</p>,
  },
];
