const loginWith = async (page, username, password) => {
    await page.getByRole("button", { name: "login" }).click();
    await page.getByLabel("username").fill(username);
    await page.getByLabel("password").fill(password);
    await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
    await page.getByRole("button", { name: "new blog" }).click();
    await page.getByPlaceholder("add title here").fill(title);
    await page.getByPlaceholder("add author here").fill(author);
    await page.getByPlaceholder("add url here").fill(url);
    await page.getByRole("button", { name: "create" }).click();
    await page.getByText(`${title} ${author}`).waitFor();
};

export { loginWith, createBlog };
