import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadJson } from "./download";

describe("downloadJson", () => {
  let mockLink: HTMLAnchorElement;
  let mockBlob: Blob;
  let mockURL: string;

  beforeEach(() => {
    // Mock HTMLAnchorElement
    mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    } as unknown as HTMLAnchorElement;

    // Mock document methods
    vi.spyOn(document, "createElement").mockReturnValue(mockLink);
    vi.spyOn(document.body, "appendChild").mockImplementation(() => mockLink);
    vi.spyOn(document.body, "removeChild").mockImplementation(() => mockLink);

    // Mock URL methods
    mockURL = "blob:http://localhost:3000/mock-url";
    // Mock URL.createObjectURL if it doesn't exist
    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn();
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn();
    }
    vi.mocked(URL.createObjectURL).mockReturnValue(mockURL);
    vi.mocked(URL.revokeObjectURL).mockImplementation(() => {});

    // Mock Blob constructor
    global.Blob = vi.fn().mockImplementation((content, options) => {
      mockBlob = { content, options } as unknown as Blob;
      return mockBlob;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should download JSON with default filename", () => {
    const testData = { name: "John", age: 30 };

    downloadJson(testData);

    // Verify JSON.stringify was called correctly
    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(testData, null, 2)],
      { type: "application/json" }
    );

    // Verify URL creation
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);

    // Verify link element creation and setup
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockLink.href).toBe(mockURL);
    expect(mockLink.download).toBe("data.json");

    // Verify DOM manipulation
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);

    // Verify URL cleanup
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockURL);
  });

  it("should download JSON with custom filename", () => {
    const testData = { items: ["apple", "banana", "cherry"] };
    const customFilename = "fruits.json";

    downloadJson(testData, customFilename);

    expect(mockLink.download).toBe(customFilename);
    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(testData, null, 2)],
      { type: "application/json" }
    );
  });

  it("should handle complex nested objects", () => {
    const complexData = {
      user: {
        id: 1,
        profile: {
          name: "Jane Doe",
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
      },
      entries: [
        { id: 1, content: "First entry" },
        { id: 2, content: "Second entry" },
      ],
    };

    downloadJson(complexData, "complex-data.json");

    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(complexData, null, 2)],
      { type: "application/json" }
    );
    expect(mockLink.download).toBe("complex-data.json");
  });

  it("should handle empty objects", () => {
    const emptyData = {};

    downloadJson(emptyData, "empty.json");

    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(emptyData, null, 2)],
      { type: "application/json" }
    );
    expect(mockLink.download).toBe("empty.json");
  });

  it("should handle arrays", () => {
    const arrayData = [
      { id: 1, title: "Task 1" },
      { id: 2, title: "Task 2" },
    ];

    downloadJson(arrayData, "tasks.json");

    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(arrayData, null, 2)],
      { type: "application/json" }
    );
    expect(mockLink.download).toBe("tasks.json");
  });

  it("should handle primitive values", () => {
    const stringData = "Hello World";

    downloadJson(stringData, "message.json");

    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(stringData, null, 2)],
      { type: "application/json" }
    );
  });

  it("should maintain proper sequence of operations", () => {
    const testData = { test: true };
    const calls: string[] = [];

    // Track call order
    vi.mocked(document.createElement).mockImplementation(() => {
      calls.push("createElement");
      return mockLink;
    });
    vi.mocked(document.body.appendChild).mockImplementation(() => {
      calls.push("appendChild");
      return mockLink;
    });
    vi.mocked(mockLink.click).mockImplementation(() => {
      calls.push("click");
    });
    vi.mocked(document.body.removeChild).mockImplementation(() => {
      calls.push("removeChild");
      return mockLink;
    });
    vi.mocked(URL.revokeObjectURL).mockImplementation(() => {
      calls.push("revokeObjectURL");
    });

    downloadJson(testData);

    expect(calls).toEqual([
      "createElement",
      "appendChild",
      "click",
      "removeChild",
      "revokeObjectURL",
    ]);
  });

  it("should handle null and undefined values", () => {
    const dataWithNulls = {
      nullValue: null,
      undefinedValue: undefined,
      validValue: "test",
    };

    downloadJson(dataWithNulls, "null-test.json");

    // JSON.stringify should handle null/undefined appropriately
    expect(global.Blob).toHaveBeenCalledWith(
      [JSON.stringify(dataWithNulls, null, 2)],
      { type: "application/json" }
    );
  });
});
