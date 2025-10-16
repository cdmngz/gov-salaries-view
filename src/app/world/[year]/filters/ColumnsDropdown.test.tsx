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

  it("opens dropdown menu when trigger is clicked", async () => {
    render(<ColumnsDropdown table={mockTable} />);

    const trigger = screen.getByTestId("columns-dropdown-trigger");
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);

    const menu = await screen.findByTestId("columns-dropdown-content");
    const header = await screen.findByTestId("columns-dropdown-header");

    expect(menu).toBeInTheDocument();
    expect(header).toHaveTextContent("Toggle columns");
  });

  it("renders a checkbox for each visible column", async () => {
    render(<ColumnsDropdown table={mockTable} />);

    const trigger = screen.getByTestId("columns-dropdown-trigger");
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);

    const checkbox = await screen.findByTestId("column-toggle-countryName");
    expect(checkbox).toBeVisible();
    expect(checkbox).toHaveTextContent("Country");
  });

  it("calls toggleVisibility when a checkbox is clicked", async () => {
    render(<ColumnsDropdown table={mockTable} />);

    const trigger = screen.getByTestId("columns-dropdown-trigger");
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    const checkbox = await screen.findByTestId("column-toggle-countryName");
    fireEvent.click(checkbox);

    const column = mockTable.getAllLeafColumns()[0];
    expect(column.toggleVisibility).toHaveBeenCalledTimes(1);
  });
});
