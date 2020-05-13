const submitBtn = document.getElementById('submit');


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
    const list = document.getElementById('verb-list');
    list.textContent = '';

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

    liHidden.innerHTML = `<span class='trash'><i class="delete fas fa-trash"></i></span><span class="edit"><i class="fas fa-wrench"></i></span><span class='star'><i class='fas fa-dragon'></i></span><span class='reward'><i class='far fa-gem'></i></span>`;

    liDiv.insertAdjacentElement("afterbegin", li);
    liDiv.insertAdjacentElement("beforeend", liHidden);
    liDiv.classList.add('getToggled');

    if(verb.reward === true) {
      li.classList.add('bonus');
      
      list.appendChild(liDiv);
      // list.appendChild(liHidden);
    } else if(verb.critical === true) {
      li.classList.add('critical');
      
      list.appendChild(liDiv);
      // list.appendChild(liHidden);
    } else {
      list.appendChild(liDiv);
      // list.appendChild(liHidden);
    }
    
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

$("input[type='time']").keypress(function(event) {
	if(event.which === 13){
			$(this).next('input').focus(); 
	}
});

document.addEventListener('DOMContentLoaded', Store.displayVerbs());

document.getElementById('verb-form').addEventListener('submit', function(event) {
  let time = document.getElementById('time').value;
  let text = document.getElementById('text').value;

  if ( time === '' || text === '') {
    showAlert("Please enter a value for all fields" ,  "error");

  } else {

    verb = new Verb(time, text);

    Store.addVerb(verb);

    Store.displayVerbs();
  
    clearForm();

    document.getElementById('time').focus();
   
    // showAlert("Verb Added!" , 'success');
  }

  event.preventDefault();
});

document.getElementById('update-form').addEventListener('submit', function(event) {
  let time = document.getElementById('updateTime').value;
  let text = document.getElementById('updateText').value;

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

    document.getElementById('time').focus();
   
    // showAlert("Verb Added!" , 'success');

  event.preventDefault();
});


document.getElementById('cancelUpdate').addEventListener('click', function(event) {
    clearUpdateForm();
    document.getElementById('update-form').classList.add('initHidden');
    document.getElementById('verb-form').classList.remove('initHidden');
    localStorage.removeItem('tempVerb');
    event.preventDefault();
});


$("ol").on("click", ".trash i", function() {
    // console.log(event.target.parentElement.parentElement.previousSibling);
    // Store.removeVerb(event.target.parentElement.parentElement.previousSibling.firstChild.textContent);
    let time = event.target.parentElement.parentElement.previousSibling.querySelector('.time').textContent;
    let text = event.target.parentElement.parentElement.previousSibling.querySelector('.text').textContent
    Store.removeVerb(time, text);
    deleteVerb(event.target);
    // document.querySelector("#verb-list > li:nth-child(1) > span.time")
});


$("ol").on("click", ".edit i", function() {
    // console.log(event.target.parentElement.parentElement.previousSibling);
    // Store.removeVerb(event.target.parentElement.parentElement.previousSibling.firstChild.textContent);
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
    document.getElementById('updateTime').value = thisVerb.time;
    document.getElementById('updateText').value = thisVerb.text;
});

//Highlight critical verbs by toggling star classes
$("ol").on("click", ".star i", function() {
	event.target.parentNode.parentNode.previousSibling.classList.toggle("critical"); 
	event.target.parentNode.parentNode.previousSibling.classList.remove("bonus"); 
  // let time = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
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

});

//Highlight reward verbs by toggling 
$("ol").on("click", ".reward i", function() {
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
  // event.target.parentNode.classList.toggle('getsToggled');
	
  localStorage.setItem('verbs' , JSON.stringify(verbs));
});

$("#toggleForm").click(function() {
	$("input[type='text']").fadeToggle();
  $("input[type='time']").fadeToggle();
  $("button[type='submit']").fadeToggle();
  this.classList.toggle('fa-times-circle');
  this.classList.toggle('fa-plus-square');
});


// document.getElementById('closeForm').addEventListener('click', function() {

// });


$("ol").on("click", ".fa-plus-square", function() {
  
  event.target.parentNode.parentNode.nextSibling.classList.toggle('initHidden');
  event.target.parentNode.parentNode.parentNode.classList.toggle('inFocus');
  
  getsToggled = event.target.parentNode.parentNode.querySelectorAll('.getsToggled');
  
  
  // getsToggled.forEach(function(icon) {
  //   icon.classList.toggle('initHidden');
  // });
  getsToggled.forEach(function(icon) {
    icon.classList.toggle('initHidden');
  });
  // event.target.parentNode.classList.add('.initHidden');
  // console.log(event.target.parentNode);
});

$("ol").on("click", ".fa-times-circle", function() {
  // $(this).parentNode.parentElement.querySelectorAll(".initHidden").toggle(250);
  event.target.parentNode.parentNode.nextSibling.classList.toggle('initHidden');
  event.target.parentNode.parentNode.parentNode.classList.toggle('inFocus');
  hiddens = event.target.parentNode.parentNode.querySelectorAll('.getsToggled');
  hiddens.forEach(function(icon) {
    icon.classList.toggle('initHidden');
  });
});

//functions




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
    // showAlert("Verb Deleted!", "success");
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