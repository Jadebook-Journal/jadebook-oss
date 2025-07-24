import { describe, it, expect } from "vitest";
import { ensureHttpsProtocol } from "./url";

describe("ensureHttpsProtocol", () => {
  it("should return link as is when it already has https protocol", () => {
    const link = "https://example.com";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://example.com");
  });

  it("should return link as is when it already has http protocol", () => {
    const link = "http://example.com";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("http://example.com");
  });

  it("should return hash URLs as is", () => {
    const link = "#section1";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("#section1");
  });

  it("should return hash URLs with paths as is", () => {
    const link = "#/dashboard/settings";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("#/dashboard/settings");
  });

  it("should add https protocol to domain without protocol", () => {
    const link = "example.com";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://example.com");
  });

  it("should add https protocol to domain with path but no protocol", () => {
    const link = "example.com/path/to/page";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://example.com/path/to/page");
  });

  it("should add https protocol to domain with query parameters", () => {
    const link = "example.com?param=value&other=test";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://example.com?param=value&other=test");
  });

  it("should add https protocol to subdomain without protocol", () => {
    const link = "subdomain.example.com";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://subdomain.example.com");
  });

  it("should handle www prefix without protocol", () => {
    const link = "www.example.com";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://www.example.com");
  });

  it("should handle complex URLs with paths, query params and fragments", () => {
    const link = "example.com/path?param=value#fragment";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://example.com/path?param=value#fragment");
  });

  it("should handle URLs with port numbers", () => {
    const link = "localhost:3000";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://localhost:3000");
  });

  it("should handle URLs with port numbers and paths", () => {
    const link = "localhost:3000/api/users";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://localhost:3000/api/users");
  });

  it("should handle empty string", () => {
    const link = "";
    const result = ensureHttpsProtocol(link);
    expect(result).toBe("https://");
  });

  it("should handle protocol with different cases", () => {
    const httpsLink = "HTTPS://example.com";
    const httpLink = "HTTP://example.com";

    expect(ensureHttpsProtocol(httpsLink)).toBe("HTTPS://example.com");
    expect(ensureHttpsProtocol(httpLink)).toBe("HTTP://example.com");
  });
});
