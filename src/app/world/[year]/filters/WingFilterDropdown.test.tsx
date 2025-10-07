// src/app/world/[year]/filters/WingFilterDropdown.test.tsx

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Column } from "@tanstack/react-table";
import type { Row, WingFilterSelection } from "../table/types";
import { WingFilterDropdown } from "./WingFilterDropdown";

function makeColumnMock(selection: WingFilterSelection = []) {
  const mock = {
    getFilterValue: () => selection,
    setFilterValue: vi.fn(),
  } as unknown as Column<Row, unknown>;
  return mock;
}

describe("<WingFilterDropdown />", () => {
  it("opens menu and toggles a value when none selected", () => {
    const column = makeColumnMock([]);
    render(<WingFilterDropdown column={column} columnLabel="Wing (Exec)" />);

    fireEvent.click(screen.getByRole("button", { name: /Wing \(Exec\)/i }));
    const leftOption = screen.getByTestId("wing-filter-option-left");
    fireEvent.click(leftOption);

    expect(column.setFilterValue).toHaveBeenCalledWith(["left"]);
  });

  it("shows Clear filter when there is a selection", () => {
    const column = makeColumnMock(["left"]);
    render(<WingFilterDropdown column={column} columnLabel="Wing (Exec)" />);

    fireEvent.click(screen.getByRole("button", { name: /Wing \(Exec\)/i }));
    expect(screen.getByText(/Clear filter/i)).toBeInTheDocument();
  });

  it("deselects the same value and clears filter", () => {
    const column = makeColumnMock(["left"]);
    render(<WingFilterDropdown column={column} columnLabel="Wing (Exec)" />);

    fireEvent.click(screen.getByRole("button", { name: /Wing \(Exec\)/i }));
    const leftOption = screen.getByTestId("wing-filter-option-left");
    fireEvent.click(leftOption);

    expect(column.setFilterValue).toHaveBeenCalledWith(undefined);
  });

  it("adds multiple selections", () => {
    const column = makeColumnMock(["left"]);
    render(<WingFilterDropdown column={column} columnLabel="Wing (Rest)" />);

    fireEvent.click(screen.getByRole("button", { name: /Wing \(Rest\)/i }));
    const centerOption = screen.getByTestId("wing-filter-option-center");
    fireEvent.click(centerOption);

    expect(column.setFilterValue).toHaveBeenCalledWith(["left", "center"]);
  });
});
