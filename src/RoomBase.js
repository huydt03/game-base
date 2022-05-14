const InfoBase = require('@drhuy/infobase');

function RoomBase(id, info){

	const EVENTS = [
		'onBeforePlayerEnter',
		'onAfterPlayerEnter',
		'onBeforePlayerLeave',
		'onAfterPlayerLeave'
	];

	let players = {};

	let self = new InfoBase(id, info);

	self.playerEnter = function(player){
		self.handle.onBeforePlayerEnter.fire(player);
		let id = player.id;
		players[id] = player;
		player.roomId = self.id;
		self.handle.onAfterPlayerEnter.fire(player);
	}

	self.playerLeave = function(playerId){
		let player = players[playerId];
		if(!player)
			return false;

		self.handle.onBeforePlayerLeave.fire(player);
		player.roomId = null;
		delete players[playerId];
		self.handle.onAfterPlayerLeave.fire(player);

		return true;
	}

	function init(){
		self.handle.add(EVENTS);
		self.players = players;

		Object.defineProperties(self, {
			players: { get: function(){ return players } },
			nPlayers: { get: function(){ return Object.keys(players).length; } }
		});
	}
	init();

	return self;
}

module.exports = RoomBase;
