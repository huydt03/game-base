const InfoBase = require('@drhuy/infobase');

function RoomsBase(id, info){

	const EVENTS = [
		'onBeforePlayerEnter',
		'onAfterPlayerEnter',
		'onBeforePlayerLeave',
		'onAfterPlayerLeave',
		'onBeforeAddRoom',
		'onAfterAddRoom',
		'onBeforeDestroyRoom',
		'onAfterDestroyRoom',
		'onPlayerEntered',
	];

	let players = {};

	let rooms = {};

	let self = new InfoBase(id, {rooms, players, ...info});

	// rooms
	self.addRoom = function(room){
		let id = room.id;
		self.handle.onBeforeAddRoom.fire(room);
		room.onAfterPlayerLeave = function(){
			if(!room.nPlayers)
				self.destroyRoom(room);
		}
		rooms[id] = room;
		self.handle.onAfterAddRoom.fire(room);

		return room;
	}

	self.destroyRoom = function(room){
		let id = room.id;
		self.handle.onBeforeDestroyRoom.fire(room);
		delete rooms[id];
		self.handle.onAfterDestroyRoom.fire(room);
	}

	self.playerEnter = function(player){
		self.handle.onBeforePlayerEnter.fire(player);
		let id = player.id;
		if(players[id])
			self.handle.onPlayerEntered.fire(players[id]);
		players[id] = player;
		player.roomPanelId = self.id;
		self.handle.onAfterPlayerEnter.fire(player);
	}

	self.playerLeave = function(playerId){
		let player = players[playerId];
		if(!player)
			return;
		self.handle.onBeforePlayerLeave.fire(player);
		player.roomPanelId = null;
		let roomId = player.roomId;
		let room = rooms[roomId];
		if(room)
			room.playerLeave(playerId);
		delete players[playerId];
		self.handle.onAfterPlayerLeave.fire(player);
	}

	function init(){
		self.handle.add(EVENTS);
	}
	init();

	return self;
}

module.exports = RoomsBase;