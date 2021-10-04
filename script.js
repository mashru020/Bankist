'use strict'; 

// Data
const account1 = {
    owner:"Md. Mashrur Rahman",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    pin:1111,
    movementsDates: [
        '2020-11-18T21:31:17.178Z',
        '2020-12-23T07:42:02.383Z',
        '2021-01-28T09:15:04.904Z',
        '2021-07-01T10:17:24.185Z',
        '2021-08-08T14:11:59.604Z',
        '2021-08-27T17:01:17.194Z',
        '2021-09-24T23:36:17.929Z',
        '2021-09-29T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner:"Tahmid Khan",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin:2222,
    movementsDates: [
        '2020-11-01T13:15:33.035Z',
        '2020-11-30T09:48:16.867Z',
        '2020-12-25T06:04:23.907Z',
        '2021-01-25T14:18:46.235Z',
        '2021-02-05T16:33:06.386Z',
        '2021-04-10T14:43:26.374Z',
        '2021-06-25T18:49:59.371Z',
        '2021-09-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account3 = {
    owner:"Adib Mahmud",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin:3333,
    movementsDates: [
        '2020-11-01T13:15:33.035Z',
        '2020-11-30T09:48:16.867Z',
        '2020-12-25T06:04:23.907Z',
        '2021-01-25T14:18:46.235Z',
        '2021-04-05T16:33:06.386Z',
        '2021-06-10T14:43:26.374Z',
        '2021-09-27T18:49:59.371Z',
        '2021-09-29T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'de-DE',
};

const account4 = {
    owner:"Mahir Faisal",
    movements: [430.34, 1000.90, -700.50, 50, 90],
    interestRate: 1,
    pin:4444,
    movementsDates: [
        '2020-11-18T21:31:17.178Z',
        '2020-12-23T07:42:02.383Z',
        '2021-01-28T09:15:04.904Z',
        '2021-07-01T10:17:24.185Z',
        '2021-08-08T14:11:59.604Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT',
};

const accounts = [account1,account2, account3, account4];

//Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
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


// Date Format internationalization 
const formatMovementDate = function(date, locale){
	const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

	const daysPassed = calcDaysPassed(date,new Date());
    if(daysPassed === 0)return 'Today';
	if(daysPassed === 1) return 'Yesterday';
	if(daysPassed <= 7) return `${daysPassed} days ago`;
    return new Intl.DateTimeFormat(locale).format(date);
}

// Currency Internationalization
const formatCur = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
}

//Creating Dom Element

const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;
    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const date = new Date(acc.movementsDates[i]);
		const displayDate = formatMovementDate(date, acc.locale);
        const html =`
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${formatCur(mov, acc.locale, acc.currency)}€</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}
// ----------------------    update UI  ---------------------------
const updateUI = function(acc){
    // dispaly movements 
    displayMovements(acc);
    // display balance
    calcPrintBalance(acc);
    // dispaly summery
    calcDisplaySummery(acc);
}
// ------------------- calculate and print balance -----------------------

const calcPrintBalance = function(acc) {
   
    acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

// ------------------------ Display summery ----------------------------------

const calcDisplaySummery = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((accu, mov) => accu + mov, 0);
    labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((accu, mov) => accu + mov , 0);
    labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * acc.interestRate / 100)
        .filter(int => int > 1)
        .reduce((accu, int) => accu + int);
    labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

// ---------------------------  Create Username --------------------------
const createUserName = function(accs){
    accs.forEach(function(acc){
        acc.username =  acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
}
createUserName(accounts);

// -------------------------------  Timer  --------------------------------
const starLogOutTimer = function() {
    const tick = function() {
        const min = String(Math.trunc(time / 60)).padStart(2,0);
        const sec = String(time % 60).padStart(2,0);

        // In each call , Print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        // When 0 seconds,  stop timer and Log out user
        if(time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = `Log in to get strated`;

            containerApp.style.opacity = 0;
        }

        // Decrese 1s
        time--;
    }
    // Set time to 2 minutes
    let time = 120;
    
    // call timer every second
    tick();
    const timer = setInterval(tick , 1000);
    return timer;
    
}
// ------------------------- Event Handler  ------------------------------
let currentAccount, timer;

btnLogin.addEventListener('click', function(e){
    //Prevent form from submitting
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    if(currentAccount?.pin === Number(inputLoginPin.value)){
        // Display UI and massage
        labelWelcome.textContent = `welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // clear input field
        inputLoginUsername.value =  inputLoginPin.value = '';
        inputLoginPin.blur();

        // creating current date
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        }

        // Internationalization Date
        labelDate.textContent = `${new Intl.DateTimeFormat(currentAccount.locale, options).format(now)}`;

        if(timer) clearInterval(timer);
        timer = starLogOutTimer();

        updateUI(currentAccount);

    }
})


btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    
    const amount = Number(inputTransferAmount.value);
    const reciverAccount = accounts.find(acc => acc.username === inputTransferTo.value);inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
    if (
        amount > 0 && 
        reciverAccount?.username !== currentAccount.username &&
        currentAccount.balance > amount     
    ) {
        // Doing the transfer
        currentAccount.movements.push(-amount);
        reciverAccount.movements.push(amount);        

        // Adding transfer Date
        currentAccount.movementsDates.push(new Date().toISOString());
        reciverAccount.movementsDates.push(new Date().toISOString());

    }

    if(timer) clearInterval(timer);
    timer = starLogOutTimer();
    updateUI(currentAccount);

});

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Math.trunc(inputLoanAmount.value);
    if (
        amount > 0 && 
        currentAccount.movements.some( mov => mov >= amount * .1 )){
            // SetTimeout function
            setTimeout(function() {

           

                // add movement
                currentAccount.movements.push(amount);

                // add movement date
                currentAccount.movementsDates.push(new Date().toISOString());

                if(timer) clearInterval(timer);
                timer = starLogOutTimer();
                // update UI
                updateUI(currentAccount);
            },2500);
        }
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
});

btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    

    if(
        inputCloseUsername.value === currentAccount.username && 
        currentAccount.pin === Number(inputClosePin.value)  
    )  {

        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        console.log(index);


        // Delete account
        accounts.splice(index, 1);

        // hide UI
        containerApp.style.opacity = 0;
    }
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
});

// ------------------------  Sorting --------------------------
let sorted = false;
btnSort.addEventListener('click', function(e){
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
}); 
