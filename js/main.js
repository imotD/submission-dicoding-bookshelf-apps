function makeBook(obj, index) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = obj.title;

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

let bookList = [];
const RENDER_EVENT = "render-bookself";
const localBooklist = "LOCAL_BOOKLIST";

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
    year: Number(inputYear),
    isComplete: isCheckComplite,
  };

  bookList.push(objAdd);

  const goToStringBooklist = JSON.stringify(bookList);

  localStorage.setItem(localBooklist, goToStringBooklist);

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

  if (bookList && bookList.length > 0) {
    for (const [index, item] of bookList.entries()) {
      const objBook = makeBook(item, index);

      if (item.isComplete) {
        completeBookshelfList.append(objBook);
      } else {
        incompleteBookshelfList.append(objBook);
      }
    }
  }
});

function addBookToCompleted(id) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;

  const getBooklistLocal = getBookListString();
  const index = findIndexLocalStorage(id);

  getBooklistLocal[index] = bookTarget;

  localStorage.setItem(localBooklist, JSON.stringify(getBooklistLocal));

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBookToOngoing(id) {
  const bookTarget = findBook(id);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;

  const getBooklistLocal = getBookListString();
  const index = findIndexLocalStorage(id);

  getBooklistLocal[index] = bookTarget;

  localStorage.setItem(localBooklist, JSON.stringify(getBooklistLocal));

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

function findIndexLocalStorage(id) {
  for (const [index, item] of bookList.entries()) {
    if (item.id === id) {
      return index;
    }
  }
}

function getBookListString() {
  const bookListString = localStorage.getItem(localBooklist);
  const bookList = JSON.parse(bookListString);
  return bookList;
}

const modalEdit = document.getElementById("isModalEdit");
const span = document.getElementsByClassName("close");
const closeBtn = document.getElementById("close");
const modalDelete = document.getElementById("isModalDelete");

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

      localStorage.setItem(localBooklist, JSON.stringify(bookList));
      document.dispatchEvent(new Event(RENDER_EVENT));
      event.preventDefault();
      modalEdit.style.display = "none";
    },
    { once: true }
  );
}

function showDelete(obj, index) {
  modalDelete.style.display = "block";

  const submitActionDelete = document.getElementById("bookSubmitDelete");

  submitActionDelete.addEventListener(
    "click",
    function (event) {
      bookList.splice(index, 1);

      document.dispatchEvent(new Event(RENDER_EVENT));

      localStorage.setItem(localBooklist, JSON.stringify(bookList));

      event.preventDefault();
      modalDelete.style.display = "none";
    },
    { once: true }
  );
}

span[0].onclick = function () {
  modalEdit.style.display = "none";
};

span[1].onclick = function () {
  modalDelete.style.display = "none";
};

closeBtn.onclick = function () {
  modalDelete.style.display = "none";
};

const submitActionSearch = document.getElementById("searchBook");

submitActionSearch.addEventListener("submit", function (event) {
  const inputTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  const getBooklistLocal = getBookListString();

  const filteredTitles = getBooklistLocal.filter((item) => {
    if (item.title.toLowerCase().includes(inputTitle)) {
      return item;
    }
  });

  if (filteredTitles.length > 0) {
    for (let i = 0; i < filteredTitles.length; i++) {
      const objBook = makeBook(filteredTitles[i], i);

      if (filteredTitles[i].isComplete) {
        completeBookshelfList.append(objBook);
      } else {
        incompleteBookshelfList.append(objBook);
      }
    }
  } else {
    incompleteBookshelfList.innerHTML = "<p>No articles found.</p>";
  }

  submitActionSearch.reset();

  event.preventDefault();
});

window.addEventListener("load", function () {
  if (typeof Storage !== "undefined") {
    // inisialisasi semua item web storage yang kita akan gunakan jika belum ada

    if (localStorage.getItem(localBooklist) !== null) {
      bookList = getBookListString();
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
