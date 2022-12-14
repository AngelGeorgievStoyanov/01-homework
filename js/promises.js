let query = document.getElementById('search');
let api = 'https://www.googleapis.com/books/v1/volumes?q=';
let max = '&maxResults=40';
let urlBook = 'https://www.googleapis.com/books/v1/volumes/';
let btnSearch = document.getElementById('searchFunc');
let btnMyFav = document.getElementById('myFav')
btnMyFav.style.display = 'none';
let div = document.getElementById('result');
let arr = [];
let bookDetails;
let bookFavId = [];

div.addEventListener('click', (e) => details(e));
btnSearch.addEventListener('click', (e) => { if (query.value.trim() != '') { init(query.value.trim(), e) } });
btnMyFav.addEventListener('click', (e) => myFavorist(e));




function init(query, e) {
    e.preventDefault();
    let a = div.childNodes;
    if (a.length > 0) {
        let arrNode = Array.from(a);
        for (const el of arrNode) {
            el.remove();
        }

    }
    fetch(`${api}${query}${max}`)
        .then(booksResp => booksResp.json())
        .then(books => {
            books = books
            arr = Array.from(books.items)

            home(arr);

        });


};

function detailsPage(bookObj) {
    let idBook = bookObj.id;

    let article = elem('article', false, false, false, false, false, idBook);

    let h1 = elem('h1');
    h1.textContent = 'Title  of the Book  --- ' + bookObj.volumeInfo.title;

    let h2 = elem('h2');
    h2.textContent = bookObj.volumeInfo.authors != undefined ? 'Authors of the Book  ---  ' + bookObj.volumeInfo.authors.join('  and  ') : 'Тhere is no author for this book in DB';

    let h3 = elem('h3');
    let date = bookObj.volumeInfo.publishedDate
    if (date != undefined) {

        date = 'Published date  ---  ' + date.split('-').reverse().join('/');

    } else {

        date = 'No info for published date';
    }

    h3.textContent = date;

    let p = elem('p');
    p.innerHTML = bookObj.volumeInfo.description != undefined ? 'Description  ' + bookObj.volumeInfo.description : 'Тhere is no description for this book in DB';

    let src = bookObj.volumeInfo.imageLinks.thumbnail;
    let img = elem('img', false, false, false, false, src);

    let btnBack = elem('button', 'btnBack', 'BACK');


    article.appendChild(h1);
    article.appendChild(h2);
    article.appendChild(h3);
    article.appendChild(img);
    article.appendChild(p);
    article.appendChild(btnBack);

    div.appendChild(article);
}


function details(e) {
    e.preventDefault();
    const id = e.target.parentNode.id;
    if (e.target.className == 'btnDtls') {
        let a = div.childNodes;
        if (a.length > 0) {
            let arrNode = Array.from(a);
            for (const el of arrNode) {
                el.remove();
            }
        }
        fetch(urlBook + id)
            .then((x) => x.json())
            .then(book => {
                book = book
                bookDetails = book

                detailsPage(bookDetails);

            });
    } else {
        if (e.target.className == 'btnBack') {
            let a = div.childNodes;
            if (a.length > 0) {
                let arrNode = Array.from(a);
                for (const el of arrNode) {
                    el.remove();
                }
            }
            home(arr);
        } else if (e.target.className == 'btnFav') {
            btnMyFav.style.display = 'block';

            fetch(urlBook + id)
                .then((x) => x.json())
                .then(book => {
                    book = book
                    bookFavId.push(id)
                    localStorage.setItem(`${id}`, JSON.stringify(book));

                })
            e.target.textContent = 'Remove';
            e.target.className = 'btnRmv';

        } else if (e.target.className == 'btnRmv') {
            let index = bookFavId.indexOf(id)
            bookFavId.splice(index, 1)
            bookFavId.length == 0 ? btnMyFav.style.display = 'none' : btnMyFav.style.display = 'block';
            localStorage.removeItem(id);
            e.target.textContent = 'Favorits';
            e.target.className = 'btnFav'
        }
    }
}

function home(arrBook) {
    query.value = '';
    arrBook.forEach(e => {
        let idBook = e.id;

        const hasFavorit = bookFavId.some((x) => x == idBook)


        let section = elem('section', false, false, false, false, false, idBook);

        let h3 = elem('h3');

        let text = e.volumeInfo.title;
        if (text.length > 45) {

            h3.textContent = text.substring(0, 45) + '...'

        } else {

            h3.textContent = text;

        }
        let src = e.volumeInfo.imageLinks.smallThumbnail;
        let img = elem('img', false, false, 128, 158, src);

        let buttonDtls = elem('button', 'btnDtls', 'Details', false, false, false);
        let buttonFavorits
        if (hasFavorit) {
            buttonFavorits = elem('button', 'btnRmv', 'Remove', false, false, false);
        } else {
            buttonFavorits = elem('button', 'btnFav', 'Favorits', false, false, false);
        }



        section.appendChild(h3);
        section.appendChild(img);
        section.appendChild(buttonDtls);
        section.appendChild(buttonFavorits);

        div.appendChild(section);

    });

}

function myFavorist(e) {
    e.preventDefault()
   let bookFavArr = [];
    bookFavId.forEach((e) => {
        let item = JSON.parse(localStorage.getItem(e))


        bookFavArr.push(item)


    })
    let a = div.childNodes;
    if (a.length > 0) {
        let arrNode = Array.from(a);
        for (const el of arrNode) {
            el.remove();
        }
    }

    home(bookFavArr)
}

function elem(a, b, c, d, e, f, z) {
    let element = document.createElement(a);
    if (b) {
        element.className = b;
    }
    if (c) {
        element.textContent = c;
    }
    if (d) {
        element.width = d;
    }
    if (e) {
        element.height = e;
    }
    if (f) {
        element.src = f;
    }
    if (z) {
        element.id = z;
    }

    return element;
}

