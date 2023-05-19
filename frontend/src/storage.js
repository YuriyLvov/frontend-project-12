class Storage {
  constructor(storage) {
    this.storage = storage;
  }

  get(key) {
    const item = this.storage.getItem(key);

    if (!item) {
      return null;
    }

    return item;
  }

  set(key, value) {
    if (value === null) {
      this.storage.removeItem(key);
      return true;
    }

    try {
      this.storage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  remove(key) {
    this.storage.removeItem(key);
    return true;
  }
}

export const storage = new Storage(window.localStorage);

export default Storage;
