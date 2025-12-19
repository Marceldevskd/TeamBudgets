import axios, { AxiosError, AxiosResponse } from "axios";
import { describe, it, expect, beforeAll } from "vitest";
import { budgets } from "../__tests__/seeded-data";
import { error } from "console";

const baseUrl = "http://localhost:9001/api/history";

const getItems = (res: AxiosResponse<any>) =>
  Array.isArray(res.data) ? res.data : res.data?.body ?? [];

const expectHistoryShape = (item: any) => {
  expect(item).toHaveProperty("id");
  expect(item).toHaveProperty("team_id");
  expect(item).toHaveProperty("team_name");
  expect(item).toHaveProperty("budget_name");
  expect(item).toHaveProperty("amount");
  expect(item).toHaveProperty("history");
  expect(Array.isArray(item.history)).toBe(true);

  item.history.forEach((h: any) => {
    expect(h).toHaveProperty("id");
    expect(h).toHaveProperty("person_name");
    expect(h).toHaveProperty("amount");
    expect(h).toHaveProperty("date");
    expect(h).toHaveProperty("description");
    expect(h).toHaveProperty("remaining_budget");
  });
};

describe("Testing GET history api without params", () => {
  let error: AxiosError | null = null;

  beforeAll(async () => {
    try {
      await axios.get(baseUrl);
    } catch (err) {
      error = err as AxiosError;
    }
  });

  it("should respond with status code 400", () => {
    expect(error?.response?.status).toBe(400);
  });
});

describe("Testing GET history api with budget_id param", () => {
  const target = 1
  let res: AxiosResponse<any, any>;

  beforeAll(async () => {
    res = await axios.get(`${baseUrl}?budget_id=${encodeURIComponent(target)}`);
  });

  it("should respond with status code 200", () => {
    expect(res.status).toBe(200);
  });

  it("should return an array of history items", () => {
    const items = getItems(res);
    expect(Array.isArray(items)).toBe(true);
  });

  it(`should return history only for budget_id=${target}`, () => {
    const items = getItems(res);
    items.forEach((item: any) => {
      expectHistoryShape(item);
      expect(item.budget_name).toBe(budgets[target - 1].name);
    });
  });
});

describe("Testing GET history api with budget_name param", () => {
  const target = budgets[1];
  let res: AxiosResponse<any, any>;

  beforeAll(async () => {
    res = await axios.get(`${baseUrl}?budget_name=${encodeURIComponent(target.name)}`);
  });

  it("should respond with status code 200", () => {
    expect(res.status).toBe(200);
  });

  it("should return an array of history items", () => {
    const items = getItems(res);
    expect(Array.isArray(items)).toBe(true);
  });

  it(`should return history only for budget_name=${target.name}`, () => {
    const items = getItems(res);
    items.forEach((item: any) => {
      expectHistoryShape(item);
      expect(item.budget_name).toBe(target.name);
    });
  });
});

describe("Testing GET history api with no matching results", () => {
  let res: AxiosResponse<any, any>;
  let error: AxiosError | null = null;
  beforeAll(async () => {
    try {
        res = await axios.get(`${baseUrl}?budget_name=${encodeURIComponent("non-existent-budget")}`);
    } catch (err) {
      error = err as AxiosError;
    }
  });

  it("should respond with status code 400", () => {
    expect(error?.response?.status).toBe(400);
  });
});