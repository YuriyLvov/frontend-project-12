import { test, expect } from '@playwright/test';
import i18next from 'i18next';
import { initLocalization } from '../src/locales/index.js';

test.beforeAll(() => {
  initLocalization();
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Hexlet Chat');
});

test('should redirect to log in page', async ({ page }) => {
  await expect(page).toHaveURL(/\/login/);
});

test('should open sing up page', async ({ page }) => {
  const registerLink = page.getByRole('link', { name: i18next.t('registration') });

  await expect(registerLink).toBeVisible();
  await registerLink.click();
  await expect(page).toHaveURL(/\/signup/);
});

test('input fields on login page', async ({ page }) => {
  const yourNickNameLabel = page.getByLabel(i18next.t('yourNickname'));
  const passwordLabel = page.getByLabel(i18next.t('password'));
  const enterNicknamePlaceholder = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordPlaceholder = page.getByPlaceholder(i18next.t('enterPassword'));
  const enterTitle = page.getByRole('heading', { name: i18next.t('enter') });
  const loginButton = page.getByRole('button', { name: i18next.t('enter') });
  const registerLink = page.getByRole('link', { name: i18next.t('registration') });

  await expect(yourNickNameLabel).toBeVisible();
  await expect(passwordLabel).toBeVisible();
  await expect(enterNicknamePlaceholder).toBeVisible();
  await expect(enterPasswordPlaceholder).toBeVisible();
  await expect(enterTitle).toBeVisible();
  await expect(loginButton).toBeVisible();
  await expect(registerLink).toBeVisible();
});

test('successfully log in as admin', async ({ page }) => {
  const enterNicknameInput = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordPlaceholder = page.getByPlaceholder(i18next.t('enterPassword'));
  const loginButton = page.getByRole('button', { name: i18next.t('enter') });

  await enterNicknameInput.fill('admin');
  await enterPasswordPlaceholder.fill('admin');

  await loginButton.click();

  const exitButton = page.getByRole('button', { name: i18next.t('logOut') });

  await expect(exitButton).toBeVisible();
});

test('check login page validation', async ({ page }) => {
  const enterNicknameInput = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordInput = page.getByPlaceholder(i18next.t('enterPassword'));
  const loginButton = page.getByRole('button', { name: i18next.t('enter') });

  await enterNicknameInput.fill('abra-kadabra');
  await enterPasswordInput.fill('abra-kadabra');

  await loginButton.click();

  const errorMessage = page.getByText(i18next.t('wrongNameOrPassword'));

  await expect(errorMessage).toBeVisible();
});

test('input fields on sign up page', async ({ page }) => {
  const registerLink = page.getByRole('link', { name: i18next.t('registration') });

  await expect(registerLink).toBeVisible();
  await registerLink.click();

  const yourNickNameLabel = page.getByLabel(i18next.t('userName'));
  const passwordLabel = page.getByLabel(i18next.t('password'));
  const passwordConfirmationLabel = page.getByLabel(i18next.t('passwordConfirmation'));
  const enterNicknamePlaceholder = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordPlaceholder = page.getByPlaceholder(i18next.t('enterPassword'));
  const confirmPasswordPlaceholder = page.getByPlaceholder(i18next.t('confirmPassword'));
  const registrationTitle = page.getByRole('heading', { name: i18next.t('registration') });
  const registerButton = page.getByRole('button', { name: i18next.t('register') });

  await expect(yourNickNameLabel).toBeVisible();
  await expect(passwordLabel).toBeVisible();
  await expect(passwordConfirmationLabel).toBeVisible();
  await expect(enterNicknamePlaceholder).toBeVisible();
  await expect(enterPasswordPlaceholder).toBeVisible();
  await expect(confirmPasswordPlaceholder).toBeVisible();
  await expect(registrationTitle).toBeVisible();
  await expect(registerButton).toBeVisible();
});

test('registration form validation', async ({ page }) => {
  const registerLink = page.getByRole('link', { name: i18next.t('registration') });

  await expect(registerLink).toBeVisible();
  await registerLink.click();

  const enterNicknameInput = page.getByPlaceholder(i18next.t('enterNickname'));
  await enterNicknameInput.fill('12'); // less than 3
  const usernameLengthValidationToShortError = page.getByText(i18next.t('usernameLengthValidationError'));
  await expect(usernameLengthValidationToShortError).toBeVisible();

  await enterNicknameInput.fill('12345678910111213141516'); // more than 20
  const usernameLengthValidationToLongError = page.getByText(i18next.t('usernameLengthValidationError'));
  await expect(usernameLengthValidationToLongError).toBeVisible();

  const enterPasswordInput = page.getByPlaceholder(i18next.t('enterPassword'));
  await enterPasswordInput.fill('123'); // less than 6
  const passwordLengthValidationToShortError = page.getByText(i18next.t('passwordLengthValidationError'));
  await expect(passwordLengthValidationToShortError).toBeVisible();

  const confirmPasswordInput = page.getByPlaceholder(i18next.t('confirmPassword'));
  await enterPasswordInput.fill('123456'); // password
  await confirmPasswordInput.fill('1234567'); // different confirmation
  const passwordShouldMatchError = page.getByText(i18next.t('passwordShouldMatch'));
  await expect(passwordShouldMatchError).toBeVisible();

  await enterPasswordInput.fill('1234567'); // password the same as the confirmation
  await expect(passwordShouldMatchError).not.toBeVisible();
});

test('channels', async ({ page }) => {
  const enterNicknameInput = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordInput = page.getByPlaceholder(i18next.t('enterPassword'));
  const loginButton = page.getByRole('button', { name: i18next.t('enter') });

  await enterNicknameInput.fill('admin');
  await enterPasswordInput.fill('admin');

  await expect(loginButton).toBeVisible();
  await loginButton.click();

  // add start
  const addChannelButton = page.getByRole('button', { name: '+' });

  await expect(addChannelButton).toBeVisible();
  await addChannelButton.click();

  const inputChannelName = await page.locator('#channelName');
  await expect(inputChannelName).toBeVisible();
  await inputChannelName.fill('new channel name');

  const sendChannelBtn = page.getByRole('button', { name: i18next.t('send') });
  await expect(sendChannelBtn).toBeVisible();
  await sendChannelBtn.click();

  const newChannelNameBtn = page.getByRole('button', { name: 'new channel name' });
  await expect(newChannelNameBtn).toBeVisible();

  const channelCreatedToast = page.getByText(i18next.t('channelCreated'));
  await expect(channelCreatedToast).toBeVisible();
  // add end

  // rename start
  const channelMenu = page.getByRole('button', { expanded: false });
  await expect(channelMenu).toBeVisible();

  await channelMenu.click();

  const renameButton = page.getByRole('button', { name: i18next.t('rename') });
  await expect(renameButton).toBeVisible();

  await renameButton.click();

  const inputChannelNameForRename = await page.locator('#channelName');
  await expect(inputChannelNameForRename).toBeVisible();
  await expect(inputChannelNameForRename).toHaveValue('new channel name');
  await inputChannelNameForRename.fill('channel renamed');

  const renameChannelBtn = page.getByRole('button', { name: i18next.t('send') });
  await expect(renameChannelBtn).toBeVisible();
  await renameChannelBtn.click();

  const renamedChannelNameButton = page.getByRole('button', { name: 'channel renamed' });
  await expect(renamedChannelNameButton).toBeVisible();

  const channelRenamedToast = page.getByText(i18next.t('channelRenamed'));
  await expect(channelRenamedToast).toBeVisible();
  // rename end

  // delete start
  await channelMenu.click();

  const deleteButton = page.getByRole('button', { name: i18next.t('delete') });
  await expect(deleteButton).toBeVisible();

  await deleteButton.click();

  const deleteModalButton = page.getByRole('button', { name: i18next.t('delete') });
  await expect(deleteModalButton).toBeVisible();

  await deleteModalButton.click();

  const channelDeletedToast = page.getByText(i18next.t('channelDeleted'));
  await expect(channelDeletedToast).toBeVisible();

  await expect(renamedChannelNameButton).not.toBeVisible();
  // delete end
});

test('messages', async ({ page }) => {
  const enterNicknameInput = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordInput = page.getByPlaceholder(i18next.t('enterPassword'));

  await enterNicknameInput.fill('admin');
  await enterPasswordInput.fill('admin');

  const loginButton = page.getByRole('button', { name: i18next.t('enter') });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  const messageInput = page.getByPlaceholder(i18next.t('enterMessage'));
  await expect(messageInput).toBeVisible();

  await messageInput.fill('Hello, World!');
  await page.keyboard.press('Enter');
  const message1 = page.getByText('Hello, World!');
  await expect(message1).toBeVisible();

  await messageInput.fill('And Tebe Hello!');
  const message2 = page.getByText('And Tebe Hello!');
  const sendMessageButton = page.getByRole('button', { name: i18next.t('sendMessage') });
  await sendMessageButton.click();
  await expect(message2).toBeVisible();
});

test('network error', async ({ page }) => {
  await page.route('/api/v1/login', (route) => {
    route.abort();
  });
  const enterNicknameInput = page.getByPlaceholder(i18next.t('enterNickname'));
  const enterPasswordInput = page.getByPlaceholder(i18next.t('enterPassword'));

  await enterNicknameInput.fill('admin');
  await enterPasswordInput.fill('admin');

  const loginButton = page.getByRole('button', { name: i18next.t('enter') });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  const networkErrorToast = page.getByText(i18next.t('networkError'));
  await expect(networkErrorToast).toBeVisible();
});
