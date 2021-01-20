const submitBtn = document.getElementById('submit');
const timeInput = document.getElementById('time-input');
const textInput = document.getElementById('text-input');
const verbList = document.getElementById('verb-list');


class Verb {
  constructor(time, text) {
    this.time = time;
    this.text = text;
    this.reward = false;
    this.critical = false;
  }
}


class Store {
  static getVerbs() {
    let verbs;
    if(localStorage.getItem('verbs') === null) {
      verbs = [];
    } else {
      verbs = JSON.parse(localStorage.getItem('verbs'));
    }

    return verbs;
  }

  static displayVerbs() {
    const verbs = Store.getVerbs();
    verbList.textContent = '';

    verbs.forEach(function(verb)  {
    // Create row element
    const li = document.createElement('li');
    const liHidden = document.createElement('li');
    const liDiv = document.createElement('div');
    liDiv.classList.add('liDiv');
    liHidden.classList.add('getsToggled');
    liHidden.classList.add('initHidden');
    liHidden.classList.add('liHidden');
    // Insert cols
    li.innerHTML = `
    <span class="time">${verb.time}</span> <span class="text">${verb.text}</span><span class="reveal getsToggled"><i class="far fa-plus-square"></i></span><span class="done initHidden getsToggled"><i class="far fa-times-circle"></i></span><span class='criticalIcon'><i class='fas fa-dragon'></i></span><span class='bonusIcon'><i class='far fa-gem'></i></span>
    `;

    liHidden.innerHTML = `<span><i class="delete fas fa-trash"></i></span><span><i class="edit fas fa-wrench"></i></span><span><i class='challenge fas fa-dragon'></i></span><span><i class='reward far fa-gem'></i></span>`;

    liDiv.insertAdjacentElement("afterbegin", li);
    liDiv.insertAdjacentElement("beforeend", liHidden);
    liDiv.classList.add('getToggled');

    if(verb.reward === true) {
      li.classList.add('bonus');
    } else if(verb.critical === true) {
      li.classList.add('critical');
    } 

    verbList.appendChild(liDiv);
    
    });
    
  }

  static addVerb(verb) {
    const verbs = Store.getVerbs();

    verbs.push(verb);

    verbs.sort(compareTime);

    localStorage.setItem('verbs' , JSON.stringify(verbs));
  }

  static removeVerb(time, text) {
    const verbs = Store.getVerbs();

    verbs.forEach(function(verb, index) {
      if(verb.time === time && verb.text === text) {
        verbs.splice(index, 1);
      }
    });

    localStorage.setItem('verbs' , JSON.stringify(verbs));
  }


  static getVerbInfo(time, text) {
    const verbs = Store.getVerbs();
    let thisVerb;
    verbs.forEach(function(verb, index) {
      if(verb.time === time && verb.text === text) {
        thisVerb = verb;
      }
    });

    return thisVerb;
  }


  static updateVerbState(oldVerb, newVerb) {
    newVerb.reward = oldVerb.reward;
    newVerb.critical = oldVerb.critical;
  }
}

timeInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    this.nextElementSibling.focus();
    event.preventDefault();
  }
  
});


document.addEventListener('DOMContentLoaded', Store.displayVerbs());

document.getElementById('verb-form').addEventListener('submit', function(event) {
  let time = timeInput.value;
  let text = textInput.value;

  if ( time === '' || text === '') {
    showAlert("Please enter a value for all fields" ,  "error");

  } else {

    verb = new Verb(time, text);

    Store.addVerb(verb);

    Store.displayVerbs();
  
    clearForm();

    document.getElementById('time').focus();
   
  }

  event.preventDefault();
});

document.getElementById('update-form').addEventListener('submit', function(event) {
  let time = document.getElementById('update-time').value;
  let text = document.getElementById('update-text').value;

    newVerb = new Verb(time, text);
    let oldVerb = JSON.parse(localStorage.getItem('tempVerb'));

    Store.updateVerbState(oldVerb, newVerb);
    
    Store.addVerb(newVerb);

    Store.removeVerb(oldVerb.time, oldVerb.text);

    Store.displayVerbs();
  
    clearUpdateForm();

    document.getElementById('update-form').classList.add('initHidden');
    document.getElementById('verb-form').classList.remove('initHidden');
    localStorage.removeItem('tempVerb');

    timeInput.focus();
   

  event.preventDefault();
});


document.getElementById('cancel-update').addEventListener('click', function(event) {
    clearUpdateForm();
    document.getElementById('update-form').classList.add('initHidden');
    document.getElementById('verb-form').classList.remove('initHidden');
    localStorage.removeItem('tempVerb');
    event.preventDefault();
});

verbList.addEventListener('click', (event) => {
  if(event.target.classList.contains('delete')) {
    let time = event.target.parentElement.parentElement.previousSibling.querySelector('.time').textContent;
    let text = event.target.parentElement.parentElement.previousSibling.querySelector('.text').textContent;
    Store.removeVerb(time, text);
    deleteVerb(event.target);
    event.preventDefault();
  }
});

verbList.addEventListener('click', (event) => {
  if(event.target.classList.contains('edit')) {
    let time = event.target.parentElement.parentElement.previousSibling.querySelector('.time').textContent;
    let text = event.target.parentElement.parentElement.previousSibling.querySelector('.text').textContent;
    document.getElementById('update-form').classList.remove('initHidden');
    document.getElementById('verb-form').classList.add('initHidden');

    if(document.getElementById('toggleForm').classList.contains('fa-plus-square')) {
      $("input[type='text']").fadeToggle();
      $("input[type='time']").fadeToggle();
      $("button[type='submit']").fadeToggle();
      document.getElementById('toggleForm').classList.toggle('fa-times-circle');
      document.getElementById('toggleForm').classList.toggle('fa-plus-square');
    }
    let thisVerb = Store.getVerbInfo(time, text);
    localStorage.setItem('tempVerb' , JSON.stringify(thisVerb));
    document.getElementById('update-time').value = thisVerb.time;
    document.getElementById('update-text').value = thisVerb.text;
  }
});


//highlight and assign challenge
verbList.addEventListener('click', (event) => {
  if(event.target.classList.contains('challenge')) {
    event.target.parentNode.parentNode.previousSibling.classList.toggle("critical"); 
    event.target.parentNode.parentNode.previousSibling.classList.remove("bonus"); 
    let time = event.target.parentNode.parentNode.previousSibling.querySelector('.time').textContent;
    let text = event.target.parentNode.parentNode.previousSibling.querySelector('.text').textContent;
    var verbs = Store.getVerbs();
    verbs.forEach(function(verb, index) {
      if(verb.time === time && verb.text === text) {
        verb.critical = !verb.critical;
        verb.reward = false;
      }
    });
    localStorage.setItem('verbs' , JSON.stringify(verbs));
  }
});


//highlight rewards
verbList.addEventListener('click', (event) => {
  if(event.target.classList.contains('reward')) {
    event.target.parentNode.parentNode.previousSibling.classList.toggle("bonus"); 
    event.target.parentNode.parentNode.previousSibling.classList.remove("critical");
    let time = event.target.parentNode.parentNode.previousSibling.querySelector('.time').textContent;
    let text = event.target.parentNode.parentNode.previousSibling.querySelector('.text').textContent;
    var verbs = Store.getVerbs();
    verbs.forEach(function(verb, index) {
      if(verb.time === time && verb.text === text) {
        verb.reward = !verb.reward;
        verb.critical = false;
      }
    });
	
  localStorage.setItem('verbs' , JSON.stringify(verbs));
  }
});

//open drawer
verbList.addEventListener('click', (event) => {
  if(event.target.classList.contains('fa-plus-square')) {
    event.target.parentNode.parentNode.nextSibling.classList.toggle('initHidden');
    event.target.parentNode.parentNode.parentNode.classList.toggle('openDrawer');
    
    getsToggled = event.target.parentNode.parentNode.querySelectorAll('.getsToggled');
    
    getsToggled.forEach(function(icon) {
      icon.classList.toggle('initHidden');
    });
  }
});

//close drawer
verbList.addEventListener('click', (event) => {
  if(event.target.classList.contains('fa-times-circle')) {
    event.target.parentNode.parentNode.nextSibling.classList.toggle('initHidden');
    event.target.parentNode.parentNode.parentNode.classList.toggle('openDrawer');
    hiddens = event.target.parentNode.parentNode.querySelectorAll('.getsToggled');
    hiddens.forEach(function(icon) {
    icon.classList.toggle('initHidden');
  });
  }
});

$("#toggleForm").click(function() {
	$("input[type='text']").fadeToggle();
  $("input[type='time']").fadeToggle();
  $("button[type='submit']").fadeToggle();
  this.classList.toggle('fa-times-circle');
  this.classList.toggle('fa-plus-square');
});


function showAlert(message, className) {
  const alert = document.createElement('div');
  alert.className = `alert ${className}`;
  alert.appendChild(document.createTextNode(message));

  const container = document.querySelector('.container');

  const form = document.getElementById('verb-form');

  container.insertBefore(alert, form);

  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000);

}

function clearForm() {
  document.getElementById('time').value = '';
  document.getElementById('text').value = '';
}

function clearUpdateForm() {
  document.getElementById('updateTime').value = '';
  document.getElementById('updateText').value = '';
}


function deleteVerb(target) {
  if(target.classList.contains("delete")) {
    target.parentElement.parentElement.previousSibling.remove();
    target.parentElement.parentElement.parentElement.remove();
  }
}

function compareTime ( a, b ) {
  if ( a.time < b.time ){
    return -1;
  }
  if ( a.time > b.time ){
    return 1;
  }
  return 0;
}
