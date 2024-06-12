function makeBook(obj, index) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = "Book " + obj.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author: " + obj.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Year: " + obj.year;

  const buttonAction = document.createElement("div");
  buttonAction.classList.add("action");

  const buttonOptions = document.createElement("button");
  buttonOptions.classList.add("green");

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("red");
  buttonDelete.innerText = "Delete";

  buttonDelete.addEventListener("click", function () {
    showDelete(obj, index);
  });

  const buttonEdit = document.createElement("button");
  buttonEdit.classList.add("orange");
  buttonEdit.innerText = "Edit";

  buttonEdit.addEventListener("click", function () {
    showEditBook(obj, index);
  });

  if (!obj.isComplete) {
    buttonOptions.innerText = "Done";
    buttonAction.append(buttonOptions);

    buttonOptions.addEventListener("click", function () {
      addBookToCompleted(obj.id);
    });
  } else {
    buttonOptions.innerText = "Ongoing";
    buttonAction.append(buttonOptions);

    buttonOptions.addEventListener("click", function () {
      addBookToOngoing(obj.id);
    });
  }

  buttonAction.append(buttonDelete, buttonEdit);

  const wrapArticle = document.createElement("article");
  wrapArticle.classList.add("book_item");
  wrapArticle.append(textTitle, textAuthor, textYear, buttonAction);

  return wrapArticle;
}

const bookList = [];
const RENDER_EVENT = "render-bookself";

const submitAction = document.getElementById("inputBook");

submitAction.addEventListener("submit", function (event) {
  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;
  const isCheckComplite = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const objAdd = {
    id: +new Date(),
    title: inputTitle,
    author: inputAuthor,
    year: inputYear,
    isComplete: isCheckComplite,
  };

  bookList.push(objAdd);

  submitAction.reset();

  document.dispatchEvent(new Event(RENDER_EVENT));
  event.preventDefault();
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const [index, item] of bookList.entries()) {
    const objBook = makeBook(item, index);

    if (item.isComplete) {
      completeBookshelfList.append(objBook);
    } else {
      incompleteBookshelfList.append(objBook);
    }
  }
});

function addBookToCompleted(id) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBookToOngoing(id) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(id) {
  for (const item of bookList) {
    if (item.id === id) {
      return item;
    }
  }

  return null;
}

const modalEdit = document.getElementById("isModalEdit");
const span = document.getElementById("close");

function showEditBook(obj, index) {
  modalEdit.style.display = "block";

  const form = document.getElementById("inputUpdateBook");

  form.title.value = obj.title;
  form.author.value = obj.author;
  form.year.value = obj.year;
  form.isCheckbox.checked = obj.isComplete;

  const submitActionUpdate = document.getElementById("bookSubmitUpdate");

  submitActionUpdate.addEventListener(
    "click",
    function (event) {
      bookList[index] = {
        id: obj.id,
        title: form.title.value,
        author: form.author.value,
        year: form.year.value,
        isComplete: form.isCheckbox.checked,
      };

      document.dispatchEvent(new Event(RENDER_EVENT));
      event.preventDefault();
      modalEdit.style.display = "none";
    },
    { once: true }
  );
}

const modalDelete = document.getElementById("isModalDelete");

function showDelete(obj, index) {
  modalDelete.style.display = "block";

  const submitActionDelete = document.getElementById("bookSubmitDelete");

  submitActionDelete.addEventListener(
    "click",
    function (event) {
      bookList.splice(index, 1);

      document.dispatchEvent(new Event(RENDER_EVENT));
      event.preventDefault();

      modalDelete.style.display = "none";
    },
    { once: true }
  );
}

span.onclick = function () {
  modalEdit.style.display = "none";
  modalDelete.style.display = "none";
};
