const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

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
        await page.getByRole("button", { name: "login" }).click();

        await expect(page.getByPlaceholder("enter username")).toBeVisible();
        await expect(page.getByPlaceholder("enter password")).toBeVisible();
    });

    describe("Login", () => {
        test("succeeds with correct credentials", async ({ page }) => {
            await loginWith(page, "mluukkai", "sekret");

            await expect(
                page.getByRole("button", { name: "logout" }),
            ).toBeVisible();
        });

        test("fails with wrong credentials", async ({ page }) => {
            await loginWith(page, "Johnny", "wrongpassword");

            await expect(
                page.getByText("wrong username or password"),
            ).toBeVisible();
        });
    });

    describe("when logged in", () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, "mluukkai", "sekret");
        });

        test("a new blog can be created", async ({ page }) => {
            await createBlog(page, "blog title", "blog author", "blog url");
            await expect(
                page.getByText("blog title blog author"),
            ).toBeVisible();
        });

        describe("and a blog exists", () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, "awesome", "me", "some.place");
            });

            test("can be liked", async ({ page }) => {
                await page.getByRole("button", { name: "view" }).click();

                await expect(page.getByText("likes 0")).toBeVisible();

                await page.getByRole("button", { name: "like" }).click();

                await expect(page.getByText("likes 1")).toBeVisible();
            });

            test('button "remove" is visible for the author', async ({
                page,
            }) => {
                await page.getByRole("button", { name: "view" }).click();
                await expect(
                    page.getByRole("button", { name: "remove" }),
                ).toBeVisible();
            });

            test("author can delete a blog", async ({ page }) => {
                await page.getByRole("button", { name: "view" }).click();

                page.once("dialog", async (dialog) => await dialog.accept());
                await page.getByRole("button", { name: "remove" }).click();

                await expect(page.getByText("awesome me")).not.toBeVisible();
            });

            test('button "remove" is hidden from others', async ({ page }) => {
                await page.getByRole("button", { name: "logout" }).click();
                await page.getByRole("button", { name: "view" }).click();
                await expect(
                    page.getByRole("button", { name: "remove" }),
                ).toBeHidden();
            });

            test("blogs ordered in the descending order according to their likes", async ({
                page,
            }) => {
                const blogCount = 4;
                const likes = [];
                for (let i = 1; i <= blogCount; ++i) {
                    likes.push(2 + Math.ceil(Math.random() * 7));
                    await createBlog(
                        page,
                        `title ${i}`,
                        `author ${i}`,
                        `url ${i}`,
                    );
                }

                for (let i = 1; i <= blogCount; ++i) {
                    await page
                        .getByRole("button", { name: "view" })
                        .nth(i)
                        .click();
                    for (let j = 1; j <= likes[i - 1]; ++j) {
                        await page
                            .getByRole("button", { name: "like" })
                            .click();
                        await expect(
                            page.getByText(`likes ${j}`),
                        ).toBeVisible();
                    }
                    await page.getByRole("button", { name: "hide" }).click();
                }

                likes.sort((a, b) => b - a);
                for (let i = 0; i < blogCount; ++i) {
                    await page
                        .getByRole("button", { name: "view" })
                        .nth(i)
                        .click();
                    await expect(
                        page.getByText(`likes ${likes[i]}`),
                    ).toBeVisible();
                    await page.getByRole("button", { name: "hide" }).click();
                }
            });
        });
    });
});
