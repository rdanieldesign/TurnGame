// Global variables
var fighting = true;
var target1Damage = 0;
var playerDamage = 0;
var chosenPlayer;

// Constructors
var Player = function(options){
  options = options || {};
  this.name = options.name;
  this.health = 100;
  this.damage = options.damage;
  this.ammo = options.ammo;
};

var Animal = function(options){
  options = options || {};
  this.name = options.name;
  this.health = options.health;
  this.damage = options.damage;
  this.speed = options.speed;
};

var Level = function(options){
  options = options || {};
  this.scene = options.scene;
  this.player = options.player;
  this.enemies = options.enemies;
};

// Define enemies
var possum = new Animal({
  name: 'possum',
  health: 50,
  damage: 30,
  speed: 1000
});

// Define players
var pistol = new Player({
  name: 'pistol',
  damage: 20,
  ammo: 20
});

// Define Levels
var yard = new Level({
  scene: 'yard',
  player: chosenPlayer,
  enemies: possum
});

// Fight
$(document).ready(function(){
  if(fighting){
    // Target Movement
    var targetMovement = window.setInterval(function(){
      $('.target1').animate({ top: (Math.random() * 600), right: (Math.random() * 1000) }, 2000);
    }, 0);
    if(target1Damage >= 100){
      clearInterval(targetMovement);
      $(target).css('background-color','red');
      console.log('Target is dead!');
    };

    // Attack every 3 seconds until dead
    var targetAttackInt = window.setInterval(function(){
      // When attacked, random damge under 30 done and player turns red.
      playerDamage += (Math.random() * 30);
      console.log(playerDamage);
      // if the target kills you, the timed attacks end
      if(playerDamage >= 100){
        clearInterval(targetAttackInt);
        $('.player').css('background-color','red');
        console.log('You are dead!');
      };
    }, 3000);

    // Player attackes target
    $('.target1').on('mouseover', function(){
      var target = this;
      $('.target1').on('keypress', function(event){
        event.preventDefault();
        console.log("key pressed!");
        // $(target).css({'background-position': '-636px 0', 'width': '340px'});
        // target1Damage += (Math.random() * 100);
        // console.log(target1Damage);
      });
    });
  }
});