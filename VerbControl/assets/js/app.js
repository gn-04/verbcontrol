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
    // Insert cols
    li.innerHTML = `
    <span class='trash'><i class="delete fas fa-trash"></i></span><span class="time">${verb.time}</span>   <span>${verb.text}</span><span class='reward'><i class='far fa-gem'></i></span><span class='star'><i class='fas fa-dragon'></i></span>
    `;

    if(verb.reward) {
      li.classList.add('bonus');
      list.appendChild(li);
    } else if(verb.critical) {
      li.classList.add('critical');
      list.appendChild(li);
    } else {
      list.appendChild(li);
    }
    
    });
    
  }

  static addVerb() {
    const verbs = Store.getVerbs();

    verbs.push(verb);

    verbs.sort(compareTime);

    localStorage.setItem('verbs' , JSON.stringify(verbs));
  }

  static removeVerb(time) {
    const verbs = Store.getVerbs();

    verbs.forEach(function(verb, index) {
      if(verb.time === time) {
        verbs.splice(index, 1);
      }
    });

    localStorage.setItem('verbs' , JSON.stringify(verbs));
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




document.getElementById('verb-list').addEventListener('click', function(event) {
  //if event.target has certain id?
  deleteVerb(event.target);
  Store.removeVerb(event.target.parentElement.nextElementSibling.textContent);                   
});



//Highlight critical verbs by toggling star classes
$("ol").on("click", ".star i", function() {
	$(this).parentsUntil("ol").toggleClass("critical"); 
  $(this).parentsUntil("ol").removeClass("bonus");
  // let time = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
  let time = event.target.parentNode.parentNode.querySelector('.time').textContent;
  console.log(time);
  var verbs = Store.getVerbs();
  verbs.forEach(function(verb, index) {
    if(verb.time === time) {
      console.log('yes');
      verb.critical = !verb.critical;
      verb.reward = false;
    }
  });
	
  localStorage.setItem('verbs' , JSON.stringify(verbs));

});

//Highlight reward verbs by toggling 
$("ol").on("click", ".reward i", function() {
	$(this).parentsUntil("ol").toggleClass("bonus");
	$(this).parentsUntil("ol").removeClass("critical");
  let time = event.target.parentNode.parentNode.querySelector('.time').textContent;
  console.log(time);
  var verbs = Store.getVerbs();
  verbs.forEach(function(verb, index) {
    if(verb.time === time) {
      console.log('yes');
      verb.reward = !verb.reward;
      verb.critical = false;
    }
  });
	
  localStorage.setItem('verbs' , JSON.stringify(verbs));
});


$(".fa-plus").click(function() {
	$("input[type='text']").fadeToggle();
  $("input[type='time']").fadeToggle();
  $("button[type='submit']").fadeToggle();
});

//functions




// function showAlert(message, className) {
//   const alert = document.createElement('div');
//   alert.className = `alert ${className}`;
//   alert.appendChild(document.createTextNode(message));

//   const container = document.querySelector('.container');

//   const form = document.getElementById('verb-form');

//   container.insertBefore(alert, form);

//   setTimeout(function(){
//     document.querySelector('.alert').remove();
//   }, 3000);

// }

function clearForm() {
  document.getElementById('time').value = '';
  document.getElementById('text').value = '';
}


function deleteVerb(target) {
  if(target.classList.contains("delete")) {
    target.parentElement.parentElement.remove();
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