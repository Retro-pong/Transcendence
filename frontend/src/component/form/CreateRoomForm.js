import createRoomFormItem from '@component/form/CreateRoomFormItem';

const CreateRoomForm = () => {
  return `
		<form id="createRoomForm" class="form">
			<div class="container">
					${createRoomFormItem({
            labelFor: 'gameTitle',
            labelContent: 'TITLE',
            content: `<span class="fs-13">[</span>
											<input type="text" id="gameTitle" class="form-control w-75 fs-10 bg-transparent" placeholder="title" />
											<span class="fs-13">]</span>`,
          })}
					${createRoomFormItem({
            labelFor: 'gameBall',
            labelContent: 'BALL',
            content: `<input type="color" id="gameBall" class="form-control form-control-color p-1 border-1 border-light rounded" value="#e66465"/>
											<span id="gameBallValue" class="mx-4">#e66565</span>`,
          })}
					${createRoomFormItem({
            labelFor: 'gameSpeed',
            labelContent: 'SPEED',
            content: `<input type="range" id="gameSpeed" class="form-range w-50 border-1 border-light rounded" min="1" max="5" step="1"/>
											<span id="gameSpeedValue" class="mx-4">3</span>`,
          })}
					${createRoomFormItem({
            labelFor: 'gameMap',
            labelContent: 'MAP',
            content: `<input type="radio" class="btn-check" name="mapOptions" id="gameMap1" autocomplete="off"/>
											<label class="btn btn-outline-light mx-2 fs-9" for="gameMap1">
												<img src="/img/map_futuristic_horizon.jpg" height="100%" width="100%" alt="wow"/>
											</label>
											<input type="radio" class="btn-check" name="mapOptions" id="gameMap2" autocomplete="off"/>
											<label class="btn btn-outline-light mx-2 fs-9" for="gameMap2">
												<img src="/img/map_mountain.jpg" height="100%" width="100%" alt="wow"/>
											</label>
											<input type="radio" class="btn-check" name="mapOptions" id="gameMap3" autocomplete="off"/>
											<label class="btn btn-outline-light mx-2 fs-9" for="gameMap3">
												<img src="/img/map_pixel_rain.jpg" height="100%" width="100%" alt="wow"/>
											</label>`,
          })}
					${createRoomFormItem({
            labelFor: 'gameMode',
            labelContent: 'MODE',
            content: `<span>[</span>
											<input type="radio" class="btn-check" name="modeOptions" id="rumble" autocomplete="off"/>
											<label class="btn btn-outline-light mx-3 fs-9" for="rumble">RUMBLE</label>
											<span>/</span>
											<input type="radio" class="btn-check" name="modeOptions" id="tournament" autocomplete="off"/>
											<label class="btn btn-outline-light mx-3 fs-9" for="tournament">TOURNAMENT</label>
											<span>]</span>`,
          })}
			</div>
		</form>
	`;
};

export default CreateRoomForm;
