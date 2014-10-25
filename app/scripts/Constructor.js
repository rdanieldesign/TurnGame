// Global variables
var fight;
var playerHealth = 100;
var chosenPlayer;
var currentLevel;
var levelEnemies;
var targeted;
var winWidth = $(window).width();
var winHeight = $(window).height();

// Templates
var fightTemp = $('#fight').html();
var renderFightTemp = _.template(fightTemp);

var gameoverTemp = $('#gameover').html();
var rendergameoverTemp = _.template(gameoverTemp);

// Constructors
// Define players
var Player = function(options){
  options = options || {};
  this.weapon = options.weapon;
  this.health = 100;
  this.damage = options.damage;
  this.ammo = options.ammo;
};

var pistol = new Player({
  weapon: 'pistol',
  damage: 20,
  ammo: 20
});

var shotgun = new Player({
  weapon: 'shotgun',
  damage: 30,
  ammo: 10
});

var rifle = new Player({
  weapon: 'rifle',
  damage: 50,
  ammo: 5
});

// Define enemies
var Target = function(options){
  options = options || {};
  this.species = options.species;
  this.health = options.health;
  this.damage = options.damage;
  this.speed = options.speed;
  this.targeted = options.targeted;
};

var possum = new Target({
  species: 'possum',
  health: 50,
  damage: 30,
  speed: 1000,
  targeted: false
});

var deer = new Target({
  species: 'deer',
  health: 100,
  damage: 50,
  speed: 1000,
  targeted: false
});

// Game setup
var Game = function(options){
  options = options || {};
  this.scene = options.scene;
  this.enemies = options.enemies;
};

// Define Levels
var level1 = new Game({
  scene: 'yard',
  enemies: [possum, possum]
});

// Fight
var fight = function(){
  levelEnemies = currentLevel.enemies;
  var targWidth = function(x){
    return $(x).width();
  };
  var targHeight = function(x){
    return $(x).height();
  };
  var targMov = function(x){
      return $(x).animate({ top: Math.random() * (winHeight - targHeight), right: Math.random() * (winWidth - targWidth)});
  };
  var targMovInt = function(x,y){
    setInterval(x, y);
  };
  var targetAttack = function(x){
    // When attacked, random damage under enemy damage done and player turns red.
    playerHealth -= (Math.random() * x);
    console.log(playerHealth);
  };
  var targetAttackInt = function(x, y){
    setInterval(x,y);
  };
  var aim = function(x,y){
    $(x).bind( "mouseenter", function() {
        y = true;
    }).bind( "mouseleave", function() {
        y = false;
    });
  };
  var fire = function(x,y,z){
    $(document).keypress(function(event){
      event.preventDefault();
      if(x){
        $(y).css({'background-position': '-636px 0', 'width': '340px'});
        setTimeout(function(){
          $(y).css({'background-position': '0 0', 'width': '300px'});
        }, 250);
        z -= (Math.random() * 100);
        console.log(z);
      }
    });
  };

  for (var i in levelEnemies){
    var enemyID = '#enemy' + i;
    var targHealth = levelEnemies[i].health;
    var targSpeed = levelEnemies[i].speed;
    var targDamage = levelEnemies[i].damage;
    var isTargeted = levelEnemies[i].targeted;

    targWidth(enemyID);
    targHeight(enemyID);
    targMov(enemyID);
    targMovInt(targMov, targSpeed);
    targetAttack(targDamage);
    targetAttackInt(targetAttack, targSpeed);
    aim(enemyID, isTargeted);
    console.log(aim());
    fire(isTargeted, enemyID, targHealth);

    // if the target kills you, the timed attacks end
    if(playerHealth <= 0){
      clearInterval(targetAttackInt);
      clearInterval(targMovInt);
      $('.player').css('background-color','red');
      console.log('You are dead!');
    }
    // if target is dead, stop and turn red.
    if(targHealth <= 0){
      clearInterval(targetAttackInt);
      clearInterval(targMovInt);
      $(enemyID).addClass('deadTarget');
      console.log('Target is dead!');
    }
  }
}; // End if(fighting)

// Setup
$('.playerChoice').on('click', function(){
  level1.weapon = $(this).attr('name');
  currentLevel = level1;
  $('.container').html(renderFightTemp(currentLevel));
  fight();
});