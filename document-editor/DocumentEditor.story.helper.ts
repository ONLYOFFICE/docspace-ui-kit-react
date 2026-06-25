import type {
  TSelectedFileInfo,
  FileEntryDtoIntegerAllOfSecurity,
} from "../selectors/Files/FilesSelector.types";

type DataSet = {
  key: string;
  label: string;
  headers: string[];
  data: (string | number)[][];
};

export const dataSets: DataSet[] = [
  {
    key: "products",
    label: "Product Inventory",
    headers: ["ID", "Product", "Price", "Available", "Stock"],
    data: [
      ["P001", "P002", "P003", "P004", "P005"],
      ["Laptop", "Mouse", "Keyboard", "Monitor", "Headphones"],
      [999.99, 29.99, 79.99, 299.99, 149.99],
      ["Yes", "Yes", "No", "Yes", "Yes"],
      [15, 150, 0, 25, 45],
    ],
  },
  {
    key: "employees",
    label: "Employee List",
    headers: ["ID", "Name", "Department", "Position", "Salary"],
    data: [
      ["E001", "E002", "E003", "E004", "E005"],
      [
        "John Smith",
        "Jane Doe",
        "Bob Johnson",
        "Alice Brown",
        "Charlie Wilson",
      ],
      ["IT", "HR", "Sales", "IT", "Marketing"],
      ["Developer", "Manager", "Representative", "Designer", "Specialist"],
      [75000, 85000, 55000, 70000, 60000],
    ],
  },
  {
    key: "sales",
    label: "Sales Report",
    headers: ["Month", "Revenue", "Expenses", "Profit", "Growth %"],
    data: [
      ["January", "February", "March", "April", "May"],
      [125000, 138000, 152000, 145000, 168000],
      [85000, 92000, 98000, 95000, 105000],
      [40000, 46000, 54000, 50000, 63000],
      [0, 15, 17.4, -7.4, 26],
    ],
  },
];

export const getIsDisabled = (
  isFirstLoad: boolean,
  isSelectedParentFolder: boolean,
  selectedItemId: string | number | undefined,
  selectedItemType: "rooms" | "files" | "agents" | undefined,
  isRoot: boolean,
  _selectedItemSecurity: FileEntryDtoIntegerAllOfSecurity | undefined,
  _selectedFileInfo: TSelectedFileInfo,
  isDisabledFolder?: boolean,
) => {
  if (isFirstLoad) return true;
  if (isSelectedParentFolder) return true;
  if (isDisabledFolder) return true;
  if (isRoot) return true;
  if (!selectedItemId) return true;
  if (selectedItemType === "rooms") return true;
  if (!_selectedFileInfo) return true;
  return false;
};
