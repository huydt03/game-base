const InfoBase = require('@drhuy/infobase');

function PlayerBase(id, info){

	const EVENTS = [
		'onJoinRoom',
		'onLeaveRoom',
		'onJoinRoomPanel',
		'onLeaveRoomPanel',
	];

	let roomId;

	let roomPanelId;

	let status;

	let self = new InfoBase(id, {status, roomId, roomPanelId, ...info});

	function init(){
		
		self.handle.add(EVENTS);

		self.onRoomIdUpdate = function(data){
			if(data[2])
				self.handle.onJoinRoom.fire(self);
			else
				self.handle.onLeaveRoom.fire(self);
		}

		self.onRoomPanelIdUpdate = function(data){
			if(data[2])
				self.handle.onJoinRoomPanel.fire(self);
			else
				self.handle.onLeaveRoomPanel.fire(self);
		}
	}
	init();

	return self;
}

module.exports = PlayerBase;