// Global variables
var fight;
var targetDamage = 0;
var playerDamage = 0;
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
  this.number = options.number || 0;
  this.targeted = options.targeted || false;
};

var possum = new Target({
  species: 'possum',
  health: 50,
  damage: 30,
  speed: 1000
});

var deer = new Target({
  species: 'deer',
  health: 100,
  damage: 50,
  speed: 1000
});

// Game setup
var Game = function(options){
  options = options || {};
  this.scene = options.scene;
  // this.player = chosenPlayer;
  this.enemies = options.enemies;
};

// Define Levels
var level1 = new Game({
  scene: 'yard',
  enemies: [possum, possum]
});

// Setup
$('.playerChoice').on('click', function(){
  level1.weapon = $(this).attr('name');
  currentLevel = level1;
  $('.container').html(renderFightTemp(currentLevel));
  fight();
});

// Fight
var fight = function(){
  // Target Movement
  var targWidth = $('.target').width();
  var targHeight = $('.target').height();
  var levelEnemies = currentLevel.enemies;
  var targMov = function(){
    for (var i in levelEnemies){
      $('#enemy' + i).animate({ top: Math.random() * (winHeight - targHeight), right: Math.random() * (winWidth - targWidth)});
    }
  };
  var targMovInt = setInterval(targMov, 500);

  // Attack every 3 seconds until dead
  for (var i in levelEnemies){
    var targetAttackInt = setInterval(function(){
      // When attacked, random damge under enemy damage done and player turns red.
      playerDamage += (Math.random() * levelEnemies[i].damage);
      console.log(playerDamage);
      // if the target kills you, the timed attacks end
      if(playerDamage >= 100){
        clearInterval(targetAttackInt);
        clearInterval(targMovInt);
        $('.player').css('background-color','red');
        console.log('You are dead!');
      };

    }, levelEnemies[i].speed);
  };

  // if targeted and keypress, cause damage
  for (var i in levelEnemies){
    // Player attackes target
    $('#enemy' + i).mouseenter(function(){
      levelEnemies[i].targeted = true;
    }).mouseleave(function(){
      levelEnemies[i].targeted = false;
    });
    $(document).keypress(function(event){
      event.preventDefault();
      if(levelEnemies[i].targeted){
        $('#enemy' + i).css({'background-position': '-636px 0', 'width': '340px'});
        setTimeout(function(){
          $('#enemy' + i).css({'background-position': '0 0', 'width': '300px'});
        }, 250);
        targetDamage += (Math.random() * 100);
        console.log(targetDamage);
      }
      if(targetDamage >= 100){
        clearInterval(targetAttackInt);
        clearInterval(targMovInt);
        $('#enemy' + i).addClass('deadTarget');
        console.log('Target is dead!');
      }
    });
  };
}; // End if(fighting)


