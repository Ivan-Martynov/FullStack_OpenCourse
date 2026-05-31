import {
  test,
  describe,
  expect,
  beforeEach,
  afterEach,
} from "@playwright/test";
import { loginWith, createBlog, removeBlog } from "./helper";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "sekret",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();

    await expect(page.getByPlaceholder("enter username")).toBeVisible();
    await expect(page.getByPlaceholder("enter password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "sekret");

      await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "Johnny", "wrongpassword");

      await expect(
        page.getByRole("button", { name: "logout" }),
      ).not.toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "sekret");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "blog title 1", "blog author", "blog url");
      await expect(page).toHaveURL("/blogs");
      await expect(
        page.getByRole("link", { name: "blog title 1" }).first(),
      ).toBeVisible();
      await removeBlog(page, "blog title 1");
    });

    describe("and a blog exists", () => {
      const blogTitle = "test-blog";

      beforeEach(async ({ page }) => {
        await removeBlog(page, blogTitle);
        await createBlog(page, blogTitle, "me", "some.place");
        await expect(page).toHaveURL("/blogs");
        await page
          .getByRole("link", { name: `${blogTitle}` })
          .first()
          .click();
        await removeBlog(page, blogTitle);
      });

      test("can be liked", async ({ page }) => {
        const t = "to be liked";
        await createBlog(page, t, "me", "some.place");
        await page.getByRole("link", { name: t }).first().click();

        await expect(page.getByText("likes 0")).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
        await removeBlog(page, t);
      });

      test("author can delete their blog", async ({ page }) => {
        const t = "to be deleted";
        await createBlog(page, t, "me", "gonna-be-out-of-existence");
        await page.getByRole("link", { name: t }).first().click();

        await expect(
          page.getByRole("button", { name: "remove" }),
        ).toBeVisible();
        await removeBlog(page, t);
      });

      test.skip("blogs ordered in the descending order according to their likes", async ({
        page,
      }) => {
        const blogCount = 4;
        const likes = [];
        for (let i = 1; i <= blogCount; ++i) {
          likes.push(2 + Math.ceil(Math.random() * 7));
          await createBlog(page, `title ${i}`, `author ${i}`, `url ${i}`);
        }

        for (let i = 1; i <= blogCount; ++i) {
          await page.getByRole("button", { name: "view" }).nth(i).click();
          for (let j = 1; j <= likes[i - 1]; ++j) {
            await page.getByRole("button", { name: "like" }).click();
            await expect(page.getByText(`likes ${j}`)).toBeVisible();
          }
          await page.getByRole("button", { name: "hide" }).click();
        }

        likes.sort((a, b) => b - a);
        for (let i = 0; i < blogCount; ++i) {
          await page.getByRole("button", { name: "view" }).nth(i).click();
          await expect(page.getByText(`likes ${likes[i]}`)).toBeVisible();
          await page.getByRole("button", { name: "hide" }).click();
        }
      });
    });
  });
});
