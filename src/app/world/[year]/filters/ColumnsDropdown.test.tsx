import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColumnsDropdown } from "./ColumnsDropdown";
import type { Table, Column } from "@tanstack/react-table";
import type { Row } from "../table/types";

/**
 * Creates a strictly typed mock Table<Row> instance
 * that only includes what ColumnsDropdown uses.
 */
function createMockTable(): Table<Row> {
  const mockColumn: Partial<Column<Row>> = {
    id: "countryName",
    columnDef: { header: "Country" },
    getCanHide: () => true,
    getIsVisible: () => true,
    toggleVisibility: vi.fn(),
  };

  return {
    getAllLeafColumns: () => [mockColumn as Column<Row>],
  } as unknown as Table<Row>;
}

describe("<ColumnsDropdown />", () => {
  let mockTable: Table<Row>;

  beforeEach(() => {
    mockTable = createMockTable();
  });

  it("renders trigger button, label, and icon", () => {
    render(<ColumnsDropdown table={mockTable} />);

    const trigger = screen.getByTestId("columns-dropdown-trigger");
    const label = screen.getByTestId("columns-dropdown-label");
    const icon = screen.getByTestId("columns-dropdown-icon");

    expect(trigger).toBeInTheDocument();
    expect(label).toHaveTextContent("Columns");
    expect(icon).toBeInTheDocument();
  });

  it("opens dropdown menu when trigger is clicked", () => {
    render(<ColumnsDropdown table={mockTable} />);

    fireEvent.click(screen.getByTestId("columns-dropdown-trigger"));

    const menu = screen.getByTestId("columns-dropdown-content");
    const header = screen.getByTestId("columns-dropdown-header");

    expect(menu).toBeInTheDocument();
    expect(header).toHaveTextContent("Toggle columns");
  });

  it("renders a checkbox for each visible column", () => {
    render(<ColumnsDropdown table={mockTable} />);

    fireEvent.click(screen.getByTestId("columns-dropdown-trigger"));

    const checkbox = screen.getByTestId("column-toggle-countryName");
    expect(checkbox).toBeVisible();
    expect(checkbox).toHaveTextContent("Country");
  });

  it("calls toggleVisibility when a checkbox is clicked", () => {
    render(<ColumnsDropdown table={mockTable} />);

    fireEvent.click(screen.getByTestId("columns-dropdown-trigger"));
    const checkbox = screen.getByTestId("column-toggle-countryName");
    fireEvent.click(checkbox);

    const column = mockTable.getAllLeafColumns()[0];
    expect(column.toggleVisibility).toHaveBeenCalledTimes(1);
  });
});
