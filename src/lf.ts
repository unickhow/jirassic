import localforage from "localforage";

const store = localforage.createInstance({
  name: "jirassic"
});

export default store;
