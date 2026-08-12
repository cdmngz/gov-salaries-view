import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Portrait from "./Portrait";

const parties = {
  TEST: {
    name: "Test Party",
    range: 3 as const,
    color: "#7c3aed",
  },
};

describe("<Portrait />", () => {
  it("uses the party color for a female avatar's clothes", () => {
    render(
      <Portrait
        official={{ name: "Ada Example", gender: "F", party: "TEST" }}
        parties={parties}
      />
    );

    expect(screen.getByRole("img")).toContainHTML('fill="#7c3aed"');
  });

  it("gives kings a crown and royal clothing", () => {
    render(<Portrait official={{ name: "Example King", gender: "M", role: "King" }} />);

    const avatar = screen.getByRole("img");
    expect(avatar).toContainHTML('fill="#f4c430"');
    expect(avatar).toContainHTML('fill="#6f1d45"');
  });

  it("gives queens and princesses a jeweled tiara", () => {
    const { rerender } = render(
      <Portrait official={{ name: "Example Queen", gender: "F", role: "Queen" }} />
    );

    expect(screen.getByRole("img")).toContainHTML('fill="#d9f2ff"');

    rerender(
      <Portrait official={{ name: "Example Princess", gender: "F", role: "Princess" }} />
    );
    expect(screen.getByRole("img")).toContainHTML('fill="#d9f2ff"');
  });

  it("renders at the compact avatar size", () => {
    render(<Portrait official={{ name: "Compact Example" }} />);

    expect(screen.getByRole("img")).toHaveAttribute("width", "24");
    expect(screen.getByRole("img")).toHaveAttribute("height", "24");
  });
});
