import createRoomFormItem from '@component/form/CreateRoomFormItem';

const CreateRoomForm = () => {
  const date = new Date().getTime().toString(16).slice(-4);
  const defaultTitle = `room-${date}`;
  return `
		<form id="createRoomForm" class="form">
			<div class="container">
					${createRoomFormItem({
            titleId: 'gameTitle',
            title: 'TITLE',
            content: `<span class="fs-13">[</span>
											<input type="text" id="gameTitle" class="form-control w-75 fs-10 bg-transparent" placeholder="title" value="${defaultTitle}"/>
											<span class="fs-13">]</span>`,
            label: true,
          })}
					${createRoomFormItem({
            titleId: 'gameBall',
            title: 'BALL',
            content: `<input type="color" id="gameBall" class="form-control form-control-color p-1 border-1 border-light rounded" value="#e66465"/>
											<span id="gameBallValue" class="px-4">#e66565</span>`,
            label: true,
          })}
					${createRoomFormItem({
            titleId: 'gameSpeed',
            title: 'SPEED',
            content: `<input type="range" id="gameSpeed" class="form-range w-50 border-1 border-light rounded" min="1" max="5" step="1"/>
											<span id="gameSpeedValue" class="px-4">3</span>`,
            label: true,
          })}
					${createRoomFormItem({
            titleId: 'gameMap',
            title: 'MAP',
            content: `<input type="radio" class="btn-check d-none" name="mapOptions" id="gameMap1" data-map="Futuristic Horizon" autocomplete="off" checked/>
											<label class="btn btn-outline-light mx-2 fs-9" for="gameMap1">
												<img src="/img/map_futuristic_horizon.jpg" class="img-fluid" alt="wow"/>
											</label>
											<input type="radio" class="btn-check d-none" name="mapOptions" id="gameMap2" data-map="Mountain" autocomplete="off"/>
											<label class="btn btn-outline-light mx-2 fs-9" for="gameMap2">
												<img src="/img/map_mountain.jpg" class="img-fluid" alt="wow"/>
											</label>
											<input type="radio" class="btn-check d-none" name="mapOptions" id="gameMap3" data-map="Pixel Rain" autocomplete="off"/>
											<label class="btn btn-outline-light mx-2 fs-9" for="gameMap3">
												<img src="/img/map_pixel_rain.jpg" class="img-fluid" alt="wow"/>
											</label>`,
          })}
					${createRoomFormItem({
            titleId: 'gameMode',
            title: 'MODE',
            content: `<div class="col-md-8 h-100 d-flex flex-column flex-xl-row flex-xxl-row justify-content-center align-items-center overflow-scroll">
												<span class="px-3 d-none d-xl-block d-xxl-block">[</span>
												<input type="radio" class="btn-check d-none" name="modeOptions" id="normal" autocomplete="off" checked/>
												<label class="btn btn-outline-light fs-9" for="normal">NORMAL</label>
												<span class="px-3 d-none d-xl-block d-xxl-block">/</span>
												<input type="radio" class="btn-check d-none" name="modeOptions" id="tournament" autocomplete="off"/>
												<label class="btn btn-outline-light fs-9" for="tournament">TOURNAMENT</label>
												<span class="px-3 d-none d-xl-block d-xxl-block">]</span>
											</div>`,
            contentCustom: true,
          })}
			</div>
		</form>
	`;
};

export default CreateRoomForm;
