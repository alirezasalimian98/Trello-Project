'use strict';

const card = document.querySelectorAll('.result-card');
const cardModal = document.querySelector('.card-modal');
const overlay = document.querySelector('.overlay');
const todoModal = document.getElementById('todo');
///
const todoShowForm = document.querySelector('.todo-add');
const todoForm = document.querySelector('.todo-upload');
const doingShowForm = document.querySelector('.doing-add');
const doingForm = document.querySelector('.doing-upload');
const doneShowForm = document.querySelector('.done-add');
const doneForm = document.querySelector('.done-upload');
///
const showAddCard = document.querySelectorAll('.add-card-btn');
const results = document.querySelectorAll('.results');
const body = document.querySelector('.container');
const list = document.querySelector('.list');
const sub = document.querySelector('.btn-sub');
///
const loginBtn = document.querySelector('.log-btn');
const usernameInput = document.querySelector('.input-login-username');
const passwordInput = document.querySelector('.input-login-password');
const signupBtn = document.querySelector('.sign-btn');
const signupFormContainer = document.querySelector('.signup-form-container');
const btnCloseSignupForm = document.querySelector('.btn--close-signup-form');
const signupForm = document.querySelector('.signup-form');
const loginFormContainer = document.querySelector('.login-form-container');
const btnCloseLoginForm = document.querySelector('.btn--close-login-form');
const loginForm = document.querySelector('.login-form');
const loginSubmit = document.querySelector('.login-btn-sub');
///
const headerText = document.querySelector('.header-sub');
const listContainer = document.querySelector('.items-container');
const logSignContainer = document.querySelector('.log-sign-btn-container');
const logoutBtn = document.querySelector('.logout-btn');
const logoutContainer = document.querySelector('.logout-container');

//// Sign up Btn

const localStorageInit = function (e) {
  localStorage.setItem('todoColumns', JSON.stringify([]));
  localStorage.setItem('doingColumns', JSON.stringify([]));
  localStorage.setItem('doneColumns', JSON.stringify([]));
};

if (
  JSON.parse(localStorage.getItem('todoColumns')).length === 0 &&
  JSON.parse(localStorage.getItem('doingColumns')) === 0 &&
  JSON.parse(localStorage.getItem('doneColumns')).length === 0
) {
  localStorageInit();
}

let isLoggedIn = false;

const AJAX = async function () {
  try {
    const fetchP = fetch('https://6564ce72ceac41c0761edbad.mockapi.io/Users');
    const res = await Promise.resolve(fetchP);
    const data = await res.json();
    console.log(data);

    return data;
  } catch (err) {
    console.error(err);
  }
};

const checkLoginData = async function (user, pass) {
  // console.log(user);
  const userData = await AJAX();
  userData.forEach(item => {
    if (user === item.Email && pass === item.password) {
      // console.log('jjjjjj');

      isLoggedIn = true;
      headerText.textContent = `Welcome ${item.name}`;
      console.log(item);
      return item;
    }
  });
};

//// logout functionality ////

const logOut = function () {
  listContainer.classList.add('hidden');
  headerText.textContent = 'Log in to continue !';
  isLoggedIn = false;
  logSignContainer.classList.remove('hidden');
  logoutContainer.classList.add('hidden');
};

//// handling log out button

logoutBtn.addEventListener('click', logOut);

signupBtn.addEventListener('click', function () {
  signupFormContainer.classList.toggle('hidden');
  btnCloseSignupForm.addEventListener('click', () =>
    signupFormContainer.classList.add('hidden')
  );
});

//// handling log in button

loginBtn.addEventListener('click', function (e) {
  e.preventDefault();

  loginFormContainer.classList.toggle('hidden');

  btnCloseLoginForm.addEventListener('click', () =>
    loginFormContainer.classList.add('hidden')
  );
});

//// opening sign up form ////
signupForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const dataArr = [...new FormData(this)];
  const data = Object.fromEntries(dataArr);
  const rand = Math.floor(Math.random() * 90 + 10);
  data.id = `User-${rand}`;

  fetch('https://6564ce72ceac41c0761edbad.mockapi.io/Users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    // Send your data in the request body as JSON
    body: JSON.stringify(data),
  })
    .then(res => {
      if (res.ok) {
        // console.log(res.json());
        return res.json();
      }
      // handle error
    })
    .catch(error => {
      console.error(error);
      // handle error
    });
  signupFormContainer.classList.add('hidden');
});

//// opening sign up form ////

loginSubmit.addEventListener('click', async function (e) {
  e.preventDefault();
  const email = usernameInput.value;
  const pass = passwordInput.value;
  await checkLoginData(email, pass);
  console.log(isLoggedIn);
  if (isLoggedIn) {
    loggedIn();
  } else alert('Invalid user or password ! Please try Again.');

  usernameInput.value = passwordInput.value = '';
  loginFormContainer.classList.add('hidden');
});

//// logged in functionality ////

const loggedIn = function () {
  listContainer.classList.remove('hidden');
  logSignContainer.classList.add('hidden');
  logoutContainer.classList.remove('hidden');

  /// Columns

  const todoColumn = {
    name: 'todo',
    resultsCard: [],
  };

  const doingColumn = {
    name: 'doing',
    resultsCard: [],
  };

  const doneColumn = {
    name: 'done',
    resultsCard: [],
  };

  let columns = [todoColumn, doingColumn, doneColumn];

  //// Todo Column ////
  const todoAddCard = function (e) {
    todoShowForm.classList.toggle('hidden');
    const todoCloseFormBtn = document.getElementById('todo-btn-close-form');
    todoCloseFormBtn.addEventListener('click', function (e) {
      todoShowForm.classList.add('hidden');
    });
  };

  /// Open todo form
  todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const dataArr = [...new FormData(this)];
    const data = Object.fromEntries(dataArr);
    const rand = Math.floor(Math.random() * 90 + 10);
    data.id = `todo-${rand}`;

    todoColumn.resultsCard.push(data);
    const col = columns[0];

    displayCard(col);
    todoShowForm.classList.toggle('hidden');

    /// saving card data in local storage
    localStorage.setItem('todoColumns', JSON.stringify(todoColumn.resultsCard));

    /// setting drag function to the card
    drag();
  });

  ////////////////////

  //// Doing Column ////
  const doingAddCard = function (e) {
    doingShowForm.classList.toggle('hidden');
    const doingCloseFormBtn = document.getElementById('doing-btn-close-form');
    doingCloseFormBtn.addEventListener('click', function (e) {
      doingShowForm.classList.add('hidden');
    });
  };

  /// open doing form
  doingForm.addEventListener('submit', function (e, x) {
    e.preventDefault();
    const dataArr = [...new FormData(this)];
    const data = Object.fromEntries(dataArr);
    const rand = Math.floor(Math.random() * 90 + 10);
    data.id = `doing-${rand}`;

    doingColumn.resultsCard.push(data);

    const col = columns[1];

    displayCard(col);
    doingShowForm.classList.toggle('hidden');

    /// saving card data in local storage
    localStorage.setItem(
      'doingColumns',
      JSON.stringify(doingColumn.resultsCard)
    );

    /// setting drag function to the card
    drag();
  });

  ////////////////////

  //// Doing Column

  const doneAddCard = function (e) {
    doneShowForm.classList.toggle('hidden');
    const doneCloseFormBtn = document.getElementById('done-btn-close-form');

    doneCloseFormBtn.addEventListener('click', function (e) {
      doneShowForm.classList.add('hidden');
    });
  };

  /// open doing form
  doneForm.addEventListener('submit', function (e, x) {
    e.preventDefault();
    const dataArr = [...new FormData(this)];
    const data = Object.fromEntries(dataArr);
    const rand = Math.floor(Math.random() * 90 + 10);
    data.id = `done-${rand}`;

    doneColumn.resultsCard.push(data);

    const col = columns[2];

    displayCard(col);
    doneShowForm.classList.toggle('hidden');

    /// saving card data in local storage
    localStorage.setItem('doneColumns', JSON.stringify(doneColumn.resultsCard));

    /// setting drag function to the card
    drag();
  });
  ////////////////////

  //// Global Functions ////

  /// display the cards in the page
  const displayCard = function (col) {
    results[columns.indexOf(col)].innerHTML = '';
    col.resultsCard.forEach(card => {
      const html = `<div id="${
        card.id
      }" draggable="true" class="result-card" data-id="${col.resultsCard.indexOf(
        card
      )}">
      <h3 class="card-header">${card.title}</h3>
    </div>`;

      if (col.name === 'todo') {
        results[0].insertAdjacentHTML('afterbegin', html);
      }
      if (col.name === 'doing') {
        results[1].insertAdjacentHTML('afterbegin', html);
      }
      if (col.name === 'done') {
        results[2].insertAdjacentHTML('afterbegin', html);
      }
    });
  };

  ///// Add card function /////

  showAddCard.forEach(function (btn) {
    window.addEventListener('click', function (e) {
      if (!e.target.closest('.add-card-btn')) return;
      if (e.target.closest('.add-card-btn').id === btn.id) {
        if (btn.id === 'todo') {
          // currentClick();
          btn.addEventListener('click', todoAddCard);
        }
        if (btn.id === 'doing') {
          btn.addEventListener('click', doingAddCard);
        }
        if (btn.id === 'done') {
          btn.addEventListener('click', doneAddCard);
        }
      } else return;
    });
  });

  //// Modal functionality ////

  const openModal = function (e) {
    const target1 = e.target.closest('.result-card').dataset.id;
    const target2 = columns.find(
      col => col.name === e.target.closest('.result-card').parentElement.id
    );
    const card = target2.resultsCard[target1];

    const html = `<div class="card-modal modal " id="${card.id}">
    <button class="close-modal">&times;</button>
    <button class="btn delete-btn ">DELETE</button>
  
    <h4 class="card-modal-header">${card.title}</h4>
    <p class="card-modal-info">${card.description} </p>
    <p class="card-modal-publisher">${card.publisher} </p>
  </div>`;
    body.insertAdjacentHTML('afterbegin', html);

    /// closing the modal by deleting it from the Dom
    const btnCloseModal = document.querySelector('.close-modal');
    btnCloseModal.addEventListener('click', function (e) {
      e.preventDefault();
      btnCloseModal.parentElement.remove();
    });

    /// Deleting card from dome, interface and local storage

    const deleteBtn = document.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function (e) {
      const target = columns.find(col =>
        col.resultsCard.find(res => res.id === e.target.parentElement.id)
      );
      const target2 = target.resultsCard.find(
        res => res.id === e.target.parentElement.id
      );
      const index = target.resultsCard.indexOf(target2);

      const new1 = target.resultsCard.splice(index, 1);
      deleteBtn.parentElement.remove();

      //// Todo local storage change

      if (target2.id.includes('todo')) {
        let todoData = JSON.parse(localStorage.getItem('todoColumns'));
      }

      //// Doing local storage change

      if (target2.id.includes('doing')) {
        let doingData = JSON.parse(localStorage.getItem('doingColumns'));
        const ind = doingData.findIndex(data => data.id === target2.id);
        doingData.splice(ind, 1);
        localStorage.setItem('doingColumns', JSON.stringify(doingData));
      }

      //// Done local storage change

      if (target2.id.includes('done')) {
        let doneData = JSON.parse(localStorage.getItem('doneColumns'));
        const ind = doneData.findIndex(data => data.id === target2.id);
        doneData.splice(ind, 1);
        localStorage.setItem('doneColumns', JSON.stringify(doneData));
      }

      /// Updating the columns (just columns)

      loopRender(columns);
    });
  };

  /// open Modal handler Event

  results.forEach(elem => elem.addEventListener('click', openModal));

  //// Drag & Drop Functionality ////

  let dragged;
  const source = document.querySelectorAll('.result-card');

  const drag = function () {
    const source = document.querySelectorAll('.result-card');

    /* events fired on the draggable target */
    source.forEach(s => s.addEventListener('drag', event => {}));

    source.forEach(s =>
      s.addEventListener('dragstart', event => {
        // store a ref. on the dragged elem
        dragged = event.target;
      })
    );

    source.forEach(s => s.addEventListener('dragend', event => {}));
  };

  const drop = function () {
    const target = document.querySelectorAll('.dropzone');
    target.forEach(t =>
      t.addEventListener(
        'dragover',
        event => {
          // prevent default to allow drop
          event.preventDefault();
        },
        false
      )
    );
    target.forEach(t =>
      t.addEventListener('dragenter', event => {
        // highlight potential drop target when the draggable element enters it
      })
    );

    target.forEach(t =>
      t.addEventListener('dragleave', event => {
        // reset background of potential drop target when the draggable element leaves it
      })
    );

    target.forEach(t =>
      t.addEventListener('drop', event => {
        // prevent default action (open as link for some elements)
        event.preventDefault();

        // move dragged element to the selected drop target
        if (event.target.classList.contains('dropzone')) {
          event.target.appendChild(dragged);
        }

        const columnTarget = columns.find(col => col.name === event.target.id);

        //// when dragging todo cards

        if (dragged.id.includes('todo')) {
          const card = columns[0].resultsCard.findIndex(
            res => res.id === dragged.id
          );

          const newDragID = dragged.id.substring(0, dragged.id.indexOf('-'));

          const [resultChange] = todoColumn.resultsCard.splice(card, 1);

          /// Local storage change for dragged card

          let todoData = JSON.parse(localStorage.getItem('todoColumns'));
          const ind = todoData.findIndex(data => data.id === resultChange.id);
          const [dataSplice] = todoData.splice(ind, 1);

          /// updating local storage for the dragged card
          localStorage.setItem('todoColumns', JSON.stringify(todoData));

          ////////////////////////

          const newID = resultChange.id.replace(
            `${newDragID}`,
            `${columnTarget.name}`
          );

          resultChange.id = newID;
          columnTarget.resultsCard.push(resultChange);
          dragged.id = newID;
          const newDrageID = dragged.id.substring(0, dragged.id.indexOf('-'));
          let lsData = JSON.parse(localStorage.getItem(`${newDrageID}Columns`));

          lsData.push(resultChange);

          /// updating local storage for the drop card

          localStorage.setItem(`${newDrageID}Columns`, JSON.stringify(lsData));
        }
        //// when dragging doing cards

        if (dragged.id.includes('doing')) {
          const card = columns[1].resultsCard.findIndex(
            res => res.id === dragged.id
          );
          const newDragID = dragged.id.substring(0, dragged.id.indexOf('-'));

          const [resultChange] = doingColumn.resultsCard.splice(card, 1);

          /// Local storage change for dragged card

          let doingData = JSON.parse(localStorage.getItem('doingColumns'));
          const ind = doingData.findIndex(data => data.id === resultChange.id);
          const [dataSplice] = doingData.splice(ind, 1);

          /// updating local storage for the dragged card

          localStorage.setItem('doingColumns', JSON.stringify(doingData));
          ////////////////////////
          const newID = resultChange.id.replace(
            `${newDragID}`,
            `${columnTarget.name}`
          );

          resultChange.id = newID;
          columnTarget.resultsCard.push(resultChange);
          dragged.id = newID;

          const newDrageID = dragged.id.substring(0, dragged.id.indexOf('-'));
          let lsData = JSON.parse(localStorage.getItem(`${newDrageID}Columns`));

          lsData.push(resultChange);

          /// updating local storage for the drop card

          localStorage.setItem(`${newDrageID}Columns`, JSON.stringify(lsData));
        }

        //// when dragging done cards

        if (dragged.id.includes('done')) {
          const card = columns[2].resultsCard.findIndex(
            res => res.id === dragged.id
          );
          const newDragID = dragged.id.substring(0, dragged.id.indexOf('-'));

          const [resultChange] = doneColumn.resultsCard.splice(card, 1);

          /// Local storage change for dragged card

          let doneData = JSON.parse(localStorage.getItem('doneColumns'));
          const ind = doneData.findIndex(data => data.id === resultChange.id);
          const [dataSplice] = doneData.splice(ind, 1);

          /// updating local storage for the drop card

          localStorage.setItem('doneColumns', JSON.stringify(doneData));

          ////////////////////////

          const newID = resultChange.id.replace(
            `${newDragID}`,
            `${columnTarget.name}`
          );
          resultChange.id = newID;
          columnTarget.resultsCard.push(resultChange);
          dragged.id = newID;
          const newDrageID = dragged.id.substring(0, dragged.id.indexOf('-'));
          let lsData = JSON.parse(localStorage.getItem(`${newDrageID}Columns`));

          lsData.push(resultChange);

          /// updating local storage for the drop card

          localStorage.setItem(`${newDrageID}Columns`, JSON.stringify(lsData));
        }
      })
    );
  };

  /// calling the drop function for all the drop zones (columns body)
  drop();

  //// resetting the local storage ////
  // localStorage.removeItem('todoColumns');
  // localStorage.removeItem('doingColumns');
  // localStorage.removeItem('doneColumns');

  //// function to reload the columns cards ////
  const loopRender = function (cols) {
    cols.forEach(col => {
      displayCard(col);
    });

    /// calling the drag function for the reloaded cards that may add later

    drag();
  };

  //// function to update the interface after reloading the page (mostly to get the data from local storage and put it to the columns array)

  const updateUI = function () {
    const todoData = JSON.parse(localStorage.getItem('todoColumns'));
    if (!todoData) return;
    todoData.forEach(data => todoColumn.resultsCard.push(data));
    const doingData = JSON.parse(localStorage.getItem('doingColumns'));
    if (!doingData) return;

    doingData.forEach(data => doingColumn.resultsCard.push(data));
    const doneData = JSON.parse(localStorage.getItem('doneColumns'));
    if (!doneData) return;

    doneData.forEach(data => doneColumn.resultsCard.push(data));
  };

  //// calling in the global scope to execute right after reloading page

  updateUI();
  loopRender(columns);
};

//////////////////
