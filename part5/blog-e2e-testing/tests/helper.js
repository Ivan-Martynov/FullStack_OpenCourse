const loginWith = async (page, username, password) => {
  await page.getByRole("link", { name: "login" }).click();
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("link", { name: "new blog" }).click();
  await page.getByPlaceholder("add title here").fill(title);
  await page.getByPlaceholder("add author here").fill(author);
  await page.getByPlaceholder("add url here").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

const removeBlog = async (page, title) => {
  await page.getByRole("link", { name: "blogs" }).click();
  for (const _ of await page.getByRole("link", { name: `${title}` }).all()) {
    await page
      .getByRole("link", { name: `${title}` })
      .first()
      .click();
    page.once("dialog", async (dialog) => await dialog.accept());
    await page.getByRole("button", { name: "remove" }).click();
    await page.getByRole("link", { name: "blogs" }).click();
  }
  // await page.getByRole("link", { name: `${title}` }).click();
  // page.once("dialog", async (dialog) => await dialog.accept());
  // await page.getByRole("button", { name: "remove" }).click();
};

export { loginWith, createBlog, removeBlog };
