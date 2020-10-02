//Book object
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class
class UI {
  static displayBooks() {

    const books = Store.getBooks();

    books.forEach(element => {
      UI.addBookToList(element);
    });
  }

  static showAlert(message, type) {
    
    const divE = document.createElement('div');
    divE.className = `alert ${type}`;
    divE.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container-form");
    const form = document.querySelector("#book-info");

    container.insertBefore(divE,form);
    
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static addBookToList(book) {
    let bookList = document.querySelector("#book-list");

    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a class="del-btn" href='#book-list'>&times;</a></td>
    `;
    bookList.appendChild(row);

    UI.showAlert("book added sucefully!", "positive-alert");
  }

  static clearFields() {
    document.querySelector("#book-name").value = '';
    document.querySelector("#book-author").value = '';
    document.querySelector("#book-isbn").value = '';
  }

  static deleteBookFromList(el) {
    if (el.classList.contains("del-btn")) {
      el.parentElement.parentElement.remove();
    }
    UI.showAlert("book deleted sucefully!", "negative-alert");
  }
}

//STORE CLASS
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    
    books.forEach((book,index) => {
      if(book.isbn === isbn) {
        books.splice(index,1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


//EVENTS
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//add a book 

document.querySelector("#book-info").addEventListener('submit', (e) => {

  e.preventDefault();
  const title = document.querySelector("#book-name").value;
  const author = document.querySelector("#book-author").value;
  const isbn = document.querySelector("#book-isbn").value;

  if (title.length === 0) { 
    UI.showAlert("Please add a valid title", "notify"); 
    return;
  }
  if (author.length === 0) {
    UI.showAlert("enter a valid author name", "notify");
    return;
  }
  if (isbn.length === 0) { 
    UI.showAlert("enter valid isbn", "notify")
    return;
  }

  UI.clearFields();

  if(!confirm("are you sure you want to add this book")) {
    return;
  }
  const book = new Book(title, author, isbn)
  UI.addBookToList(book);
  Store.addBook(book);

});

//remove a book

document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.deleteBookFromList(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  console.log(typeof e.target.parentElement.previousElementSibling.textContent);
});