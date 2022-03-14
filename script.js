'use strict';

//*************************************************
//////////////// BANKIST APP ////////////////
// Data
const account1 = {
  owner: 'Jane doe',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Elements 2

const containerMovements = document.querySelector('.movements');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const btnLogin = document.querySelector('.login__btn');

/////////////////////////////////////////////////

// DISPLAYING MOVEMENTS.
const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
      <div class="movements__value"> ${mov} </div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// sorting state variable
let sorting = false;
// SORTING
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorting);
  sorting = !sorting;
});

// PART 2

// CREATING USERNAMES
const createUsername = function (accs) {
  // break the name using split and lower case
  // use map to return the first letter and join into a string
  // return an array with intials.
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUsername(accounts);

// CALCULATING BALANCE
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
  labelBalance.textContent = `${acc.balance} ₤`;
};

// CALCULATING SUMMARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((cur, mov) => (cur += mov));
  labelSumIn.textContent = `${incomes}₤ `;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((cur, mov) => (cur += mov));
  labelSumOut.textContent = `${Math.abs(outcomes)}₤`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((cur, mov) => (cur += mov));
  labelSumInterest.textContent = `${interest}₤`;
};

// PART 3

//Refactored update ui function
const updateUi = function (acc) {
  // display movements
  displayMovement(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // diplay summary
  calcDisplaySummary(acc);
};

// LOGIN
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  // checks username and update current account
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // checks pin
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // empty login and pin
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // display ui and welcome message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;

    updateUi(currentAccount);
  }
});

// TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  let receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // empty transfer values
  inputTransferAmount.value = inputTransferTo.value = '';
  // Transfer rules
  if (
    receiverAccount &&
    amount > 0 &&
    currentAccount.balance > amount &&
    currentAccount.username !== receiverAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUi(currentAccount);
  }
});

// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //amount
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

// LOG OUT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // confirm info
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // find index of current account and delete it from accounts
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
