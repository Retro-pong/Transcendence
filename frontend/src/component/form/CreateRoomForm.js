const CreateRoomForm = () => {
  return `
		<form id="createRoomForm" class="form">
			<div class="container">
				<div class="row h-25 w-100 d-flex align-items-center">
					<div class="col-4 h-100 fs-13 d-flex justify-content-center">
						<label for="gameTitle" class="form-label">TITLE:</label>
					</div>
					<div class="col-8 h-100 d-flex flex-row justify-content-center">
						<div class="fs-13">[</div>
						<input type="text" id="gameTitle" class="form-control w-75 fs-10 bg-transparent" placeholder="title" />
						<div class="fs-13">]</div>
					</div>
				</div>
				<div class="row h-25 w-100 mt-3 fs-13 d-flex justify-content-center align-items-center">
					<div class="col-4 h-100 d-flex justify-content-center">
						<label for="gameColor" class="form-label">COLOR:</label>
					</div>		
					<div class="col-8 h-100 p-0 d-flex justify-content-center align-items-center">
						<input type="color" id="gameColor" class="form-control form-control-color p-1 border-1 border-light rounded" value="#e66465"/>
						<span id="gameColorValue" class="mx-4">#e66565</span>
					</div>
				</div>				
				<div class="row h-25 w-100 mt-3 fs-13 d-flex justify-content-center align-items-center">
					<div class="col-4 h-100 d-flex justify-content-center">
						<label for="gameColor" class="form-label">MODE:</label>
					</div>		
					<div class="col-8 h-100 p-0 d-flex justify-content-center align-items-center">
						<span>[</span>
						<input type="radio" class="btn-check" name="modeOptions" id="rumble" autocomplete="off"/>
						<label class="btn btn-outline-light fs-9" for="rumble">RUMBLE</label>
						<span>/</span>
						<input type="radio" class="btn-check" name="modeOptions" id="tournament" autocomplete="off"/>
						<label class="btn btn-outline-light fs-9" for="tournament">TOURNAMENT</label>
						<span>]</span>
					</div>
				</div>
			</div>
		</form>
	`;
};

export default CreateRoomForm;
