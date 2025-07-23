const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Curtis Vize',
        username: 'curtisvize',
        password: '12345'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: '54321'
      }
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'curtisvize', '12345')
      await expect(page.getByText('Curtis Vize is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'curtisvize', 'hello')
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'curtisvize', '12345')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'An end-to-end test blog', 'Curtis Vize', 'https://curtisvize.dev')
      await expect(page.getByText('An end-to-end test blog Curtis Vize')).toBeVisible()
    })

    test('the created blog can be liked', async ({ page }) => {
      await createBlog(page, 'An end-to-end test blog', 'Curtis Vize', 'https://curtisvize.dev')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the created blog can be removed', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())

      await createBlog(page, 'An end-to-end test blog', 'Curtis Vize', 'https://curtisvize.dev')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()
      await page.waitForSelector('.blogContainer', { state: 'detached' })
      await expect(page.getByTestId('blog-container')).toHaveCount(0)
    })

    test('only the user who added the blog sees the remove button', async ({ page }) => {
      await createBlog(page, 'An end-to-end test blog', 'Curtis Vize', 'https://curtisvize.dev')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'otheruser', '54321')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByTestId('remove-button')).toHaveCount(0)
    })

    test('blogs are arranged in order according to likes', async ({ page }) => {
      await createBlog(page, 'An end-to-end test blog', 'Curtis Vize', 'https://curtisvize.dev')
      await createBlog(page, 'A Second test blog with two likes', 'Curtis Vize', 'https://curtisvize.dev')
      await createBlog(page, 'The most liked blog to ever be written', 'Curtis Vize', 'https://curtisvize.dev')

      // expand detils
      await page.getByRole('button', { name: 'view' }).nth(2).click()
      await page.getByRole('button', { name: 'view' }).nth(1).click()
      await page.getByRole('button', { name: 'view' }).nth(0).click()

      // like clicks
      await page.getByRole('button', { name: 'like' }).nth(2).click()
      await page.getByText('likes 1').waitFor()
      await page.getByRole('button', { name: 'like' }).nth(2).click()
      await page.getByText('likes 2').waitFor()
      await page.getByRole('button', { name: 'like' }).nth(2).click()
      await page.getByText('likes 3').waitFor()

      await page.getByRole('button', { name: 'like' }).nth(1).click()
      await page.getByText('likes 1').waitFor()
      await page.getByRole('button', { name: 'like' }).nth(1).click()
      await page.getByText('likes 2').waitFor()

      await page.getByRole('button', { name: 'like' }).nth(0).click()
      await page.getByText('likes 1').waitFor()

      // reload and view details again
      page.reload()
      await page.getByRole('button', { name: 'view' }).nth(2).click()
      await page.getByRole('button', { name: 'view' }).nth(1).click()
      await page.getByRole('button', { name: 'view' }).nth(0).click()

      // ensure blogs are in the correct order
      const likeCounts = page.locator('.likeCount')
      const expectedOrder = ['3', '2', '1']

      await expect(likeCounts).toHaveText(expectedOrder)
    })
  })
})