var fighting = true;
var targetDamage = 0;
var playerDamage = 0;

// Target movement
// $(document).ready(function(){
//   var targetPosition = $('.target').offset().left;
//   $('.target').animate({ right: "0" }, 5000);
//   $('.target').animate({ top: (Math.random() * 600), right: (Math.random() * 1000) }, 2000);
//   $('.target').animate({ top: "400px" }, 2000);
//   $('.target').animate({ top: "30px", right: '600px' }, 2000);
// });
$(document).ready(function(){
  window.setInterval(function(){
    $('.target').animate({ top: (Math.random() * 600), right: (Math.random() * 1000) }, 1000);
  }, 0);
});

// Attack every 3 seconds until dead
var targetAttackInt = window.setInterval(function(){
  // When attacked, random damge under 30 done and player turns red.
  $('.player').css('background-color','red');
  playerDamage += (Math.random() * 30);
  console.log(playerDamage);
  // if the target kills you, the timed attacks end
  if(playerDamage >= 100){
    clearInterval(targetAttackInt);
    alert('You are dead!');
  };
}, 3000);

// Player attackes target
$('.target').on('click', function(){
  var target = this;
  var player = $('.player');
  $(target).css({'background-color': 'yellow', 'transition': 'background-color 1s'});
  targetDamage += (Math.random() * 100);
  console.log(targetDamage);
  if(targetDamage >= 100){
    $(target).css('background-color','red');
    console.log('Target is dead!');
  };
});