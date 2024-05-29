function makeBook(obj) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = "Book " + obj.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author: " + obj.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Year: " + obj.year;

  const buttonAction = document.createElement("div");
  buttonAction.classList.add("action");

  const buttonDone = document.createElement("button");
  buttonDone.classList.add("green");
  buttonDone.innerText = "Done";

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("red");
  buttonDelete.innerText = "Delete";

  buttonAction.append(buttonDone, buttonDelete);

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

  for (const item of bookList) {
    const objBook = makeBook(item);

    if (item.isComplete) {
      completeBookshelfList.append(objBook);
    } else {
      incompleteBookshelfList.append(objBook);
    }
  }
});
