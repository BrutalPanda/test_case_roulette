let elementCatch = false;
let circleDegree = null;
let cursorPosition = 0;
let ratesBySector = [0, 0.1, 0.16, 0.17, 0, 0.1, 0.16, 0.17];
let move = 0;
$(document).ready(function(){
   let rate = getCookie('app_rate');
   let userName = getCookie('app_user_name');
   if (userName === undefined) {
      $('#roulette').hide();
   } else if (rate === undefined) {
      $('#requestButton').hide();
      $('#roulette').show();
      setTriggerReady();
   } else {
      $('#requestButton').hide();
      let name = getCookie('app_user_name');
      if (name === undefined) {
         name = 'Пользователь';
      }
      $('#helloModalLabel').text('Привет, ' + name + '!');
      $('#helloModalText').text('Вы уже крутили барабан. Ваша ставка: ' + rate);
      $('#helloModal').modal('show');
   }

   $('#requestButton').click(function () {
      $(this).hide();
      $('#formModal').modal('show');
   });

   $('#formModal').on('hidden.bs.modal', function(){
      let userName = getCookie('app_user_name');
      if (userName === undefined) {
         $('#formModal').modal('show');
      }
   });

   $('#submitIntroductionForm').click(function(){
      let name = validate($('#userName').val());
      let phone = $('#userPhone').val();
      let email = validate($('#userEmail').val(),'email');
      let hasMistakes = false;
      $('#mistakeMessage').hide();

      $('.wrong-input').each(function(){
         $(this).removeClass('wrong-input');
      });
      if (name === null) {
         $('#userName').addClass('wrong-input');
         hasMistakes = true;
      } else {
         $('#userName').addClass('success-input');
      }

      if (email === null) {
         $('#userEmail').addClass('wrong-input');
         hasMistakes = true;
      } else {
         $('#userEmail').addClass('success-input');
      }

      if (phone.length < 10) {
         $('#userPhone').addClass('wrong-input');
         hasMistakes = true;
      } else {
         $('#userPhone').addClass('success-input');
      }

      if (hasMistakes) {
         $('#mistakeMessage').show();
      } else {
         setCookie('app_user_name', name);
         setCookie('app_user_phone', phone);
         setCookie('app_user_email', email);
         $('#formModal').modal('hide');
         $('#roulette').show();
         setTriggerReady();
      }
   });
});

function setTriggerReady() {
   $('#trigger').mousedown(function (evt) {
      elementCatch = true;
      cursorPosition = evt.offsetY;
   }).mouseup(function () {
      if (circleDegree === null) {
         elementCatch = false;
         backToStartPositionAndStartCircle();
      }
   }).mousemove(function (evt) {
      if (elementCatch && evt.pageY !== 0 && circleDegree === null) {
         move = evt.pageY - cursorPosition - $('#roulette').offset().top;
         console.log(move);
         if (move > 260) {
            move = 260;
            elementCatch = false;
            backToStartPositionAndStartCircle();
         } else if (move < 0) {
            move = 0;
         } else {
            $('#trigger').css('top', move);
         }
      }
   }).mouseleave(function () {
      if (elementCatch && circleDegree === null) {
         elementCatch = false;
         backToStartPositionAndStartCircle();
      }
   });
}

function backToStartPositionAndStartCircle() {
   if (circleDegree === null) {
      $('#trigger').animate({top: "-=" + move + "px"}, 'slow');
      startCircle();
   }
}

function startCircle() {
   circleDegree = randomInteger (0, 3*360);
   rotateDegree = circleDegree+90;
   $('.circle').css({'transform' : 'rotate(-'+ rotateDegree +'deg)'});
   getCreditRate();
}

function getCreditRate() {
   let rem = (circleDegree)%360;
   let degreePerSector = 360/ratesBySector.length;
   let index = Math.floor(rem/degreePerSector);
   setCookie('app_rate',ratesBySector[index]);

   let name = getCookie('app_user_name');
   setTimeout(function () {
      $('#helloModalLabel').text('Привет, ' + name + '!');
      $('#helloModalText').text('Ваша ставка: ' + ratesBySector[index]);
      $('#helloModal').modal('show');
   },2000);
}

function randomInteger(min, max) {
   let rand = min + Math.random() * (max + 1 - min);
   return Math.floor(rand);
}

function validate (value, type = 'text') {
   if (value === undefined || value.length === 0) {
      return null;
   }

   let pattern = '[A-Za-zА-Яа-яЁё]{2,}';
   if (type === 'email') {
      pattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])';
   }
   let result = value.match(pattern);

   return result[0] === value ? value : null;
}

function getCookie(name) {
   let matches = document.cookie.match(new RegExp(
       "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
   ));
   return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
   options = {
      path: '/',
     ...options
   };

   if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
   }

   let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

   for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
         updatedCookie += "=" + optionValue;
      }
   }

   document.cookie = updatedCookie;
}
