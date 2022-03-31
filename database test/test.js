/* eslint-disable @typescript-eslint/no-var-requires */
// const assert = require("assert");
const firebase = require("@firebase/testing");

const MY_PROJECT_ID = "full-stack-f79cd";
const editor = {
  uid: "E7pUagbQrbds2tthfq6luXS2bZ42",
  email: "admin@admin.com",
};

const getFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth })
    .firestore();
};

describe("Food Collection", () => {
  const db = getFirestore(null);
  const authenticatedDb = getFirestore(editor);

  const testFood = db.collection("foods").doc("testFood");
  const authenticatedTestFood = authenticatedDb
    .collection("foods")
    .doc("authenticatedTestFood");

  it("Users can view Foods", async () => {
    await firebase.assertSucceeds(testFood.get());
  });

  it("Unauthenticated Users can't Write to foods collection", async () => {
    await firebase.assertFails(testFood.set({ foo: "bar" }));
  });

  it("Unauthenticated Users can't Update to foods collection", async () => {
    await firebase.assertFails(testFood.update({ foo: "bar" }));
  });

  it("Unauthenticated Users can't Delete to foods collection", async () => {
    await firebase.assertFails(testFood.delete());
  });

  it("Editor can Write to foods collection", async () => {
    authenticatedTestFood.set({ foo: "bar" });
    await firebase.assertSucceeds(authenticatedTestFood.set({ foo: "bar" }));
  });

  it("Editor can Update to foods collection", async () => {
    await firebase.assertSucceeds(authenticatedTestFood.update({ foo: "bar" }));
  });

  it("Editor can Delete to foods collection", async () => {
    await firebase.assertSucceeds(authenticatedTestFood.delete());
  });
});

describe("Movie Collection", () => {
  const db = getFirestore(null);
  const authenticatedDb = getFirestore(editor);

  const testMovie = db.collection("movies").doc("testMovie");
  const authenticatedTestMovie = authenticatedDb
    .collection("movies")
    .doc("authenticatedTestMovie");

  it("Users can view Movies", async () => {
    await firebase.assertSucceeds(testMovie.get());
  });

  it("Unauthenticated Users can't Write to movies collection", async () => {
    await firebase.assertFails(testMovie.set({ foo: "bar" }));
  });

  it("Unauthenticated Users can't Update to movies collection", async () => {
    await firebase.assertFails(testMovie.update({ foo: "bar" }));
  });

  it("Unauthenticated Users can't Delete to movies collection", async () => {
    await firebase.assertFails(testMovie.delete());
  });

  it("Editor can Write to movies collection", async () => {
    await firebase.assertSucceeds(authenticatedTestMovie.set({ foo: "bar" }));
  });

  it("Editor can Update to movies collection", async () => {
    await firebase.assertSucceeds(
      authenticatedTestMovie.update({ foo: "bar" })
    );
  });

  it("Editor can Delete to movies collection", async () => {
    await firebase.assertSucceeds(authenticatedTestMovie.delete());
  });
});
