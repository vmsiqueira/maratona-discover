//testing html connection
console.log('connected')

//function toggle modal
/*
const toggleModal = function () {
  const modal = document.querySelector('.modal-overlay');
  if(modal.classList.contains('active') == false) {
    modal.classList.add('active');
  } else {
    modal.classList.remove('active')
  }
}
*/
//segunda forma de executar a função
const toggleModal = function () {
  const modal = document.querySelector('.modal-overlay');
  modal.classList.toggle('active');
}

const transactions = [
  {
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021'
  },
  {
    description: 'Website',
    amount: 500000,
    date: '23/01/2021'
  },
  {
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021'
  }
]

// save user transactions at local storage
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
  },
  set(transactions){
    localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions));
  }
}

const Transaction = {
  all: Storage.get(),
  //add functionality
  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  //remove functionality
  remove(index) {
    Transaction.all.splice(index, 1)
    App.reload();
  },
  //calculate the incomes
  incomes() {
    // get all transactions
    // for each transaction if the transaction is higher than 0
    // add to a variable and return the variable
    let income = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        // income = income + transaction.amount;
        income += transaction.amount;
      }
    })
    return income;
  },
  // calculate the expenses
  expenses(){
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        // income = income + transaction.amount;
        expense += transaction.amount;
      }
    })
    return expense;
  },
  // calculate the total amount
  total(){
    return Transaction.incomes() + Transaction.expenses();
  }
}

// substitute data from HTML with JS data
const DOM = {
  // contains the table body in a variable
  transactionsContainer: document.querySelector('#data-table tbody'),

  // add a transaction row in a tr tag via js
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    //show transaction via JS in HTML
    DOM.transactionsContainer.appendChild(tr);
  },
  // html model for a transaction
  innerHTMLTransaction(transaction, index) {
    // change CSS class based on amount value (positive or negative)
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
    // currency format
    const amount = Utils.formatCurrency(transaction.amount)
    // built HTML in index.html
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="/assets/minus.svg" alt="Remover transação">
      </td>
      `
      return html;
  },
  //update the Balance cards in our application via js
  updateBalance(){
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },
  //clear the transaction container
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = '';
  },
}

// change to the currency format
const Utils = {
  // format amount values posted by users
  formatAmount(value){
    value = Number(value.replace(/\,\./g), '') * 100;
    return value;
  },
  //format the date posted by user
  formatDate(date){
    const splittedDate = date.split('-');
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  //format the value to currency mode
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return signal + value;
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  // function to get the values
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  // format data in order to save
  formatValues() {
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date
    }
  },
  // verify if the fields are empty
  validateFields() {
    const { description, amount, date } = Form.getValues();
    if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {
      throw new Error('Por favor, preencha todos os campos')
    }
  },
  // clear form fields after add a transaction
  clearFields(){
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },


  submit(event) {
    event.preventDefault();

    try {
      // validate form fields
      Form.validateFields();
      // format form values sent by the users
      const transaction = Form.formatValues();
      // save form data - add a transaction
      Transaction.add(transaction);
      // clear form data
      Form.clearFields();
      // close modal
      toggleModal();
      // reload Application - add method already does it
    } catch (error) {
      alert(error.message)
    }
  }
}

//App
const App = {
  init() {
    Transaction.all.forEach(function(transaction, index){
      DOM.addTransaction(transaction, index);
    })
    
    DOM.updateBalance();

    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions()
    App.init();
  },
}

App.init();