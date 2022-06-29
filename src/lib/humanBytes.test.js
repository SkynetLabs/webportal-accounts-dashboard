import humanBytes from "./humanBytes";

describe("humanBytes", () => {
  test.each([
    [100, "100 B"],
    [1400, "1.4 kB"],
    [34567, "33.8 kB"],
    [1234567, "1.2 MB"],
    [1234567890, "1.1 GB"],
    [23456789098, "21.8 GB"],
    [1234567890987, "1.1 TB"],
  ])(`translates %i bytes into %s`, (bytes, humanized) => {
    expect(humanBytes(bytes)).toEqual(humanized);
  });
});
