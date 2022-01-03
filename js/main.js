//testing html connection
console.log('connected')

//function open modal
const Modal = { 
  open() {
  document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
  document.querySelector('.modal-overlay').classList.remove('active');
  }
}