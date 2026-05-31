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
  await page.waitForURL("**/blogs");

  let links = await page.getByRole("link", { name: title }).all();
  while (links.length > 0) {
    await page.getByRole("link", { name: title }).first().click();
    await page.waitForURL("**/blogs/*");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "remove" }).click();
    await page.waitForURL("**/blogs");

    links = await page.getByRole("link", { name: title }).all();
  }
};

export { loginWith, createBlog, removeBlog };
