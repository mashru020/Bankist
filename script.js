'use strict'; 

// Data
const account1 = {
    owner:"Md. Mashrur Rahman",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin:1111.
};

const account2 = {
    owner:"Tahmid Khan",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin:2222,
};

const account3 = {
    owner:"Adib Mahmud",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin:3333,
};

const account4 = {
    owner:"Mahir Faisal",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin:4444,
};

const accounts = [account1,account2, account3, account4];

//Elements
const labelWelcome = document.querySelector('.welcome');
const labelData = document.querySelector('.data');
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


//Creating Dom Element

const displayMovements = function(movements , sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;
    movs.forEach(function(mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal'
        const html =`
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__value">${mov}€</div>
            </div>
        `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}
// ----------------------    update UI  ---------------------------
const updateUI = function(acc){
    // dispaly movements 
    displayMovements(acc.movements);
    // display balance
    calcPrintBalance(acc);
    // dispaly summery
    calcDisplaySummery(acc);
}
// ------------------- calculate and print balance -----------------------

const calcPrintBalance = function(acc) {
   
    acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);
    labelBalance.textContent = `${acc.balance}€`;
}

// ------------------------ Display summery ----------------------------------

const calcDisplaySummery = function(acc) {
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((accu, mov) => accu + mov, 0);
    labelSumIn.textContent = `${incomes}€`

    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((accu, mov) => accu + mov , 0);
    labelSumOut.textContent = `${Math.abs(out)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => deposit * acc.interestRate / 100)
        .filter(int => int > 1)
        .reduce((accu, int) => accu + int);
    labelSumInterest.textContent = `${interest}€`;
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

// ------------------------- Event Handler  ------------------------------
let currentAccount;

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
        currentAccount.movements.push(-amount);
        reciverAccount.movements.push(amount);        
    }
    updateUI(currentAccount);

});

btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (
        amount > 0 && 
        currentAccount.movements.some( mov => mov >= amount * .1 )){

            // add movement
            currentAccount.movements.push(amount);

            // update UI
            updateUI(currentAccount);
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
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
}); 