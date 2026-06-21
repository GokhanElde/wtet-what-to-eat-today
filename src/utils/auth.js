const USERS_STORAGE_KEY = "wtet-users";
const SESSION_STORAGE_KEY = "wtet-current-user";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);
    return fallback;
  }
}

function createPublicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}

function saveSession(user) {
  const publicUser = createPublicUser(user);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export function getCurrentUser() {
  return readJson(SESSION_STORAGE_KEY, null);
}

export function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return Promise.reject(new Error("Name must be at least 3 characters."));
  }

  if (password.length < 6) {
    return Promise.reject(new Error("Password must be at least 6 characters."));
  }

  const users = readJson(USERS_STORAGE_KEY, []);
  const userExists = users.some((user) => user.email === normalizedEmail);

  if (userExists) {
    return Promise.reject(new Error("An account with this email already exists."));
  }

  const newUser = {
    _id: crypto.randomUUID(),
    name: trimmedName,
    email: normalizedEmail,
    password,
  };

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...users, newUser]));
  return Promise.resolve(saveSession(newUser));
}

export function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readJson(USERS_STORAGE_KEY, []);
  const user = users.find(
    (savedUser) =>
      savedUser.email === normalizedEmail && savedUser.password === password,
  );

  if (!user) {
    return Promise.reject(new Error("Incorrect email or password."));
  }

  return Promise.resolve(saveSession(user));
}

export function logout() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
