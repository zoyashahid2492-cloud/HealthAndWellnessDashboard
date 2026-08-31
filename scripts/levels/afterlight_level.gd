extends Node3D

const PlayerControllerScene = preload("res://scripts/player/player_controller.gd")
const EchoManagerScene = preload("res://scripts/systems/echo_manager.gd")
const HUDScene = preload("res://scripts/ui/hud.gd")
const PressurePlateScene = preload("res://scripts/puzzles/pressure_plate.gd")
const SwitchScene = preload("res://scripts/puzzles/echo_switch.gd")
const DoorScene = preload("res://scripts/puzzles/afterlight_door.gd")
const MovingPlatformScene = preload("res://scripts/puzzles/moving_platform.gd")
const BeamScene = preload("res://scripts/puzzles/energy_beam_device.gd")
const SentinelScene = preload("res://scripts/ai/sentinel_ai.gd")

var player: PlayerController
var echo_manager: EchoManager
var hud: AfterlightHUD
var materials := {}
var section_spawns := [
	Vector3(0, 0.25, 2),
	Vector3(0, 0.25, -18),
	Vector3(0, 0.25, -43),
	Vector3(0, 0.25, -75),
	Vector3(0, 0.25, -121),
	Vector3(0, 0.25, -165),
]
var _triggered := {}
var _puzzle1_plates: Array[PressurePlate] = []
var _puzzle1_door: AfterlightDoor
var _puzzle4_plate: PressurePlate
var _puzzle4_beam: EnergyBeamDevice
var _puzzle4_final_plate: PressurePlate
var _puzzle4_door: AfterlightDoor
var _puzzle4_bridge: MovingPlatform
var _climax_pending_corruption := false
var _ended := false

func _ready() -> void:
	SaveSystem.load_game()
	_make_materials()
	_setup_world()
	_spawn_player()
	_spawn_systems()
	_build_level()
	_play_opening()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("dev_skip"):
		_skip_section()

func _make_materials() -> void:
	materials["floor"] = _mat(Color(0.035, 0.038, 0.045), Color(0, 0, 0), 0.0)
	materials["wall"] = _mat(Color(0.055, 0.058, 0.068), Color(0, 0, 0), 0.0)
	materials["trim"] = _mat(Color(0.11, 0.1, 0.085), Color(0.35, 0.18, 0.06), 0.25)
	materials["afterlight"] = _mat(Color(0.04, 0.16, 0.18), Color(0.0, 0.85, 1.0), 1.4)
	materials["warning"] = _mat(Color(0.16, 0.11, 0.045), Color(1.0, 0.48, 0.05), 0.9)
	materials["dark_glass"] = _mat(Color(0.02, 0.035, 0.05, 0.55), Color(0.0, 0.2, 0.3), 0.5)

func _setup_world() -> void:
	var environment := WorldEnvironment.new()
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.003, 0.005, 0.009)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.04, 0.05, 0.07)
	env.ambient_light_energy = 0.45
	env.fog_enabled = true
	env.fog_density = 0.018
	env.fog_light_color = Color(0.08, 0.16, 0.2)
	environment.environment = env
	add_child(environment)

	var moon := DirectionalLight3D.new()
	moon.rotation_degrees = Vector3(-48, 18, 0)
	moon.light_color = Color(0.45, 0.65, 0.8)
	moon.light_energy = 0.55
	add_child(moon)

func _spawn_player() -> void:
	player = PlayerControllerScene.new()
	add_child(player)
	player.global_position = GameState.current_spawn
	player.prompt_changed.connect(_on_player_prompt_changed)
	player.reset_room_requested.connect(_reset_current_room)
	player.skip_section_requested.connect(_skip_section)

func _spawn_systems() -> void:
	echo_manager = EchoManagerScene.new()
	add_child(echo_manager)
	echo_manager.bind_player(player)
	echo_manager.echo_corrupted.connect(_on_echo_corrupted)
	echo_manager.echo_spawned.connect(_on_echo_spawned)

	hud = HUDScene.new()
	add_child(hud)
	hud.bind_player(player)
	echo_manager.recording_state_changed.connect(hud.set_recording)
	echo_manager.echo_count_changed.connect(hud.set_echo_capacity)
	hud.set_echo_capacity(echo_manager.active_echoes.size(), GameState.max_echoes)

func _build_level() -> void:
	_build_station()
	_build_hall(Vector3(0, 0, -10), Vector3(8, 0.35, 26))
	_build_puzzle1()
	_build_hall(Vector3(0, 0, -38), Vector3(8, 0.35, 16))
	_build_puzzle2()
	_build_hall(Vector3(0, 0, -69), Vector3(8, 0.35, 16))
	_build_puzzle3()
	_build_story_beat()
	_build_hall(Vector3(0, 0, -114), Vector3(8, 0.35, 14))
	_build_puzzle4()
	_build_hall(Vector3(0, 0, -156), Vector3(8, 0.35, 12))
	_build_climax()

func _build_station() -> void:
	_room("Transit Station", Vector3(0, 0, 0), Vector3(14, 5, 14))
	_label("NORTHLINE TRANSIT - AFTERLIGHT CITY", Vector3(0, 2.8, -5.8), 0.0, 0.55)
	_label("SERVICE SUSPENDED: 23 YEARS", Vector3(-5.7, 1.8, -1.5), 90.0, 0.38)
	for i in range(5):
		var light := OmniLight3D.new()
		light.position = Vector3(-5.5 + i * 2.75, 3.4, -3.4)
		light.light_color = Color(1.0, 0.54, 0.23)
		light.light_energy = 0.15
		light.omni_range = 5
		add_child(light)
		_light_up_delayed(light, i * 0.55)
	_checkpoint("Transit Station", Vector3(0, 0.25, 2), Vector3(0, 1, -4), Vector3(10, 3, 1))

func _build_puzzle1() -> void:
	_room("Puzzle1Discovery", Vector3(0, 0, -24), Vector3(16, 5, 20))
	_label("AFTERLIGHT FIELD LAB - AUTHORIZED STAFF ONLY", Vector3(0, 2.6, -15.3), 0.0, 0.42)
	var device := _switch("AfterlightDevice", Vector3(0, 0.02, -16.8), "Press E - take AFTERLIGHT device")
	device.activated.connect(func(_actor: Node) -> void:
		if not GameState.echo_unlocked:
			GameState.unlock_echoes(1)
			hud.show_system("AFTERLIGHT device synchronized. Q records an Echo.")
			hud.show_subtitle("MAYA", "That sound... I remember that room.", 3.4)
	)
	_puzzle1_door = _door("Puzzle1Door", Vector3(0, 0, -33.6), 4.0)
	var left := _plate("P1PlateA", Vector3(-4.2, 0.12, -27.0))
	var right := _plate("P1PlateB", Vector3(4.2, 0.12, -27.0))
	_puzzle1_plates = [left, right]
	left.active_changed.connect(func(_active: bool) -> void: _update_puzzle1())
	right.active_changed.connect(func(_active: bool) -> void: _update_puzzle1())
	_label("TWO AUTHORIZED SIGNATURES REQUIRED", Vector3(0, 1.8, -32.9), 0.0, 0.34)
	_checkpoint("Discovery", Vector3(0, 0.25, -18), Vector3(0, 1, -20), Vector3(12, 3, 1))

func _update_puzzle1() -> void:
	_puzzle1_door.set_open(_puzzle1_plates[0].active and _puzzle1_plates[1].active)

func _build_puzzle2() -> void:
	_room("Puzzle2Sequencing", Vector3(0, 0, -54), Vector3(18, 7, 24))
	_label("KINETIC TRANSFER BAY", Vector3(0, 3.1, -44.3), 0.0, 0.5)
	var switch := _switch("P2TimedSwitch", Vector3(-6.2, 0.02, -49.0), "Press E - cycle platform and timed door")
	var platform := MovingPlatformScene.new() as MovingPlatform
	platform.name = "P2MovingPlatform"
	platform.global_position = Vector3(-5.8, 0.65, -58)
	platform.travel = Vector3(11.5, 0, 0)
	add_child(platform)
	platform.add_to_group("resettable")
	var door := _door("P2TimedDoor", Vector3(0, 0, -65.8), 4.2)
	switch.activated.connect(func(_actor: Node) -> void:
		platform.set_active(true)
		door.open_for(11.0)
		await get_tree().create_timer(11.0).timeout
		if is_instance_valid(platform):
			platform.set_active(false)
	)
	_box("UpperDestination", Vector3(5.8, 1.35, -63.5), Vector3(5, 0.35, 5), materials["floor"])
	_label("PLATFORM WINDOW: 11 SECONDS", Vector3(-5.5, 1.8, -47.8), -35.0, 0.32)
	_checkpoint("Sequencing Chamber", Vector3(0, 0.25, -43), Vector3(0, 1, -45), Vector3(12, 3, 1))

func _build_puzzle3() -> void:
	_room("Puzzle3Sentinel", Vector3(0, 0, -86), Vector3(20, 6, 26))
	_label("SECURITY DORMANT - MOTION ROUTING ONLINE", Vector3(0, 2.8, -76.2), 0.0, 0.42)
	var sentinel := SentinelScene.new() as SentinelAI
	sentinel.name = "Sentinel"
	sentinel.global_position = Vector3(0, 1.0, -87)
	add_child(sentinel)
	sentinel.add_to_group("resettable")
	_box("LeftNoiseRunway", Vector3(-6.5, 0.18, -88), Vector3(3, 0.2, 17), materials["warning"])
	_box("RightQuietRoute", Vector3(6.5, 0.18, -88), Vector3(3, 0.2, 17), materials["afterlight"])
	_label("OBSERVES MOTION. DOES NOT UNDERSTAND MEMORY.", Vector3(0, 1.8, -96.5), 180.0, 0.34)
	_checkpoint("Sentinel Atrium", Vector3(0, 0.25, -75), Vector3(0, 1, -77), Vector3(12, 3, 1))
	_trigger("MayaSentinel", Vector3(0, 1, -79), Vector3(14, 3, 1), func() -> void:
		hud.show_subtitle("MAYA", "Careful. It followed technicians when the lights were still on.", 4.0)
	)

func _build_story_beat() -> void:
	_room("ArchiveAntechamber", Vector3(0, 0, -108), Vector3(14, 5, 12))
	_label("DAMAGED PERSONNEL ARCHIVE", Vector3(0, 2.5, -103.2), 0.0, 0.42)
	var archive := _switch("DamagedRecording", Vector3(0, 0.02, -108.5), "Press E - play damaged recording")
	archive.reusable = false
	archive.activated.connect(func(_actor: Node) -> void:
		hud.show_system("PROJECT DIRECTOR IDENTIFIED.", 3.0)
		await get_tree().create_timer(2.2).timeout
		hud.show_subtitle("MAYA", "That's impossible.", 3.2)
	)

func _build_puzzle4() -> void:
	_room("Puzzle4TwoEchoes", Vector3(0, 0, -136), Vector3(24, 8, 30))
	_label("TRIANGULATION CORE - THREE SIGNATURES REQUIRED", Vector3(0, 3.4, -122.4), 0.0, 0.44)
	_trigger("TwoEchoUnlock", Vector3(0, 1, -123), Vector3(14, 3, 1), func() -> void:
		if GameState.max_echoes < 2:
			GameState.unlock_echoes(2)
			hud.show_system("Echo capacity increased: 2")
			hud.show_subtitle("MAYA", "Two of you. I should be relieved. Why am I not?", 4.0)
	)
	_puzzle4_plate = _plate("P4BridgePlate", Vector3(-8, 0.12, -132))
	_puzzle4_bridge = MovingPlatformScene.new() as MovingPlatform
	_puzzle4_bridge.name = "P4MovingBridge"
	_puzzle4_bridge.global_position = Vector3(-5.0, 1.05, -141)
	_puzzle4_bridge.travel = Vector3(10.0, 0, 0)
	_puzzle4_bridge.speed = 1.8
	add_child(_puzzle4_bridge)
	_puzzle4_bridge.add_to_group("resettable")
	_puzzle4_plate.active_changed.connect(func(active: bool) -> void:
		_puzzle4_bridge.set_active(active)
		_update_puzzle4()
	)
	var beam_switch := _switch("P4BeamSwitch", Vector3(7.8, 0.02, -132), "Press E - redirect energy beam")
	_puzzle4_beam = BeamScene.new() as EnergyBeamDevice
	_puzzle4_beam.name = "P4Beam"
	_puzzle4_beam.global_position = Vector3(7.8, 0.0, -138)
	add_child(_puzzle4_beam)
	_puzzle4_beam.add_to_group("resettable")
	beam_switch.activated.connect(func(actor: Node) -> void:
		_puzzle4_beam.interact(actor)
		_update_puzzle4()
	)
	_puzzle4_final_plate = _plate("P4FinalPlate", Vector3(0, 1.35, -150))
	_puzzle4_final_plate.active_changed.connect(func(_active: bool) -> void: _update_puzzle4())
	_puzzle4_door = _door("P4ExitDoor", Vector3(0, 0, -153.8), 4.6)
	_box("FinalRaisedControl", Vector3(0, 1.18, -150), Vector3(4.5, 0.28, 4.5), materials["floor"])
	_label("BRIDGE / BEAM / DIRECTOR", Vector3(0, 2.5, -151.8), 180.0, 0.38)
	_checkpoint("Triangulation Core", Vector3(0, 0.25, -121), Vector3(0, 1, -124), Vector3(14, 3, 1))

func _update_puzzle4() -> void:
	var bridge_ready := _puzzle4_plate and _puzzle4_plate.active
	var beam_ready := _puzzle4_beam and _puzzle4_beam.receiver_active
	var player_ready := _puzzle4_final_plate and _puzzle4_final_plate.active
	if _puzzle4_door:
		_puzzle4_door.set_open(bridge_ready and beam_ready and player_ready)

func _build_climax() -> void:
	_room("ObservationRoom", Vector3(0, 0, -170), Vector3(16, 5, 16))
	_label("OBSERVATION / RECOVERY", Vector3(0, 2.7, -164.2), 0.0, 0.44)
	_box("Window", Vector3(0, 2.0, -176.9), Vector3(10, 2.6, 0.15), materials["dark_glass"], false)
	var terminal := _switch("ClimaxTerminal", Vector3(0, 0.02, -171), "Press E - align observation terminal")
	terminal.activated.connect(func(actor: Node) -> void:
		var identity := ActorIdentity.from_node(actor)
		if echo_manager.is_recording:
			_climax_pending_corruption = true
			hud.show_system("Temporal signature accepted.", 2.0)
		elif identity and identity.is_echo():
			pass
		else:
			hud.show_system("Terminal requires an Echo-recorded signature.")
			hud.show_subtitle("MAYA", "Just a small alignment. Record it, then let the Echo repeat it.", 4.2)
	)
	_checkpoint("Observation Room", Vector3(0, 0.25, -165), Vector3(0, 1, -165), Vector3(12, 3, 1))

func _on_echo_spawned(echo: EchoActor) -> void:
	if _climax_pending_corruption:
		_climax_pending_corruption = false
		echo.corrupt_at_halfway = true

func _on_player_prompt_changed(text: String) -> void:
	if hud:
		hud.set_prompt(text)

func _on_echo_corrupted(echo: EchoActor) -> void:
	if _ended:
		return
	echo.look_at_actor(player)
	hud.show_subtitle("ECHO", "Don't trust her.", 3.0)
	await get_tree().create_timer(1.8).timeout
	hud.show_subtitle("MAYA", "What did it say?", 2.6)
	await get_tree().create_timer(1.6).timeout
	_end_prototype()

func _end_prototype() -> void:
	_ended = true
	AudioFeedback.play_event("warning")
	var blackout := ColorRect.new()
	blackout.color = Color.BLACK
	blackout.size = Vector2(4000, 4000)
	hud.add_child(blackout)
	var title := Label.new()
	title.text = "PROJECT AFTERLIGHT\nEND OF PROTOTYPE"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	title.position = Vector2(390, 270)
	title.size = Vector2(500, 150)
	title.add_theme_font_size_override("font_size", 34)
	hud.add_child(title)

func _play_opening() -> void:
	await get_tree().create_timer(1.0).timeout
	hud.show_subtitle("MAYA", "Can you hear me?", 3.0)
	await get_tree().create_timer(3.6).timeout
	hud.show_subtitle("MAYA", "Please tell me it's really you.", 3.4)

func _reset_current_room() -> void:
	echo_manager.clear_echoes()
	player.teleport_to(Transform3D(Basis(), GameState.current_spawn))
	for node in get_tree().get_nodes_in_group("resettable"):
		if node.has_method("reset_device"):
			node.reset_device()
	hud.show_system("Checkpoint reset: %s" % GameState.current_checkpoint, 1.8)

func _skip_section() -> void:
	var current := player.global_position.z
	for spawn in section_spawns:
		if spawn.z < current - 2.0:
			player.teleport_to(Transform3D(Basis(), spawn))
			GameState.set_checkpoint("Developer Skip", spawn)
			return

func _checkpoint(name: String, spawn: Vector3, position: Vector3, size: Vector3) -> void:
	_trigger("Checkpoint_%s" % name, position, size, func() -> void:
		GameState.set_checkpoint(name, spawn)
	)

func _trigger(id: String, position: Vector3, size: Vector3, callback: Callable) -> void:
	var area := Area3D.new()
	area.name = id
	area.global_position = position
	var collider := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = size
	collider.shape = shape
	area.add_child(collider)
	add_child(area)
	area.body_entered.connect(func(body: Node3D) -> void:
		if _triggered.get(id, false):
			return
		var identity := ActorIdentity.from_node(body)
		if identity and identity.is_real_player():
			_triggered[id] = true
			callback.call()
	)

func _room(room_name: String, center: Vector3, size: Vector3) -> void:
	_box("%sFloor" % room_name, center + Vector3(0, -0.1, 0), Vector3(size.x, 0.25, size.z), materials["floor"])
	_box("%sCeiling" % room_name, center + Vector3(0, size.y, 0), Vector3(size.x, 0.25, size.z), materials["wall"])
	_box("%sLeftWall" % room_name, center + Vector3(-size.x * 0.5, size.y * 0.5, 0), Vector3(0.35, size.y, size.z), materials["wall"])
	_box("%sRightWall" % room_name, center + Vector3(size.x * 0.5, size.y * 0.5, 0), Vector3(0.35, size.y, size.z), materials["wall"])
	for offset in [-size.z * 0.38, 0, size.z * 0.38]:
		_strip(center + Vector3(-size.x * 0.5 + 0.25, 2.4, offset), true)
		_strip(center + Vector3(size.x * 0.5 - 0.25, 2.4, offset), true)
	var light := OmniLight3D.new()
	light.position = center + Vector3(0, size.y - 0.8, 0)
	light.light_color = Color(0.25, 0.9, 1.0)
	light.light_energy = 0.55
	light.omni_range = max(size.x, size.z) * 0.65
	add_child(light)

func _build_hall(center: Vector3, size: Vector3) -> void:
	_room("Hall%s" % str(center.z), center, Vector3(size.x, 4.2, size.z))

func _box(node_name: String, position: Vector3, size: Vector3, material: Material, collides := true) -> MeshInstance3D:
	var mesh_instance := MeshInstance3D.new()
	mesh_instance.name = node_name
	var mesh := BoxMesh.new()
	mesh.size = size
	mesh_instance.mesh = mesh
	mesh_instance.global_position = position
	mesh_instance.set_surface_override_material(0, material)
	add_child(mesh_instance)
	if collides:
		var body := StaticBody3D.new()
		body.name = "%sBody" % node_name
		body.global_position = position
		var collider := CollisionShape3D.new()
		var shape := BoxShape3D.new()
		shape.size = size
		collider.shape = shape
		body.add_child(collider)
		add_child(body)
	return mesh_instance

func _strip(position: Vector3, vertical := false) -> void:
	var strip := _box("AfterlightStrip", position, Vector3(0.08, 0.08, 3.2) if vertical else Vector3(3.2, 0.08, 0.08), materials["afterlight"], false)
	strip.rotation_degrees.y = 90.0 if vertical else 0.0

func _plate(node_name: String, position: Vector3) -> PressurePlate:
	var plate := PressurePlateScene.new() as PressurePlate
	plate.name = node_name
	plate.global_position = position
	add_child(plate)
	plate.add_to_group("resettable")
	return plate

func _switch(node_name: String, position: Vector3, prompt_text: String) -> EchoSwitch:
	var button := SwitchScene.new() as EchoSwitch
	button.name = node_name
	button.global_position = position
	button.prompt = prompt_text
	add_child(button)
	button.add_to_group("resettable")
	return button

func _door(node_name: String, position: Vector3, width: float) -> AfterlightDoor:
	var door := DoorScene.new() as AfterlightDoor
	door.name = node_name
	door.global_position = position
	door.width = width
	add_child(door)
	door.add_to_group("resettable")
	return door

func _label(text: String, position: Vector3, yaw_degrees: float, scale_value: float) -> void:
	var label := Label3D.new()
	label.text = text
	label.pixel_size = 0.02
	label.modulate = Color(0.64, 0.95, 1.0)
	label.outline_modulate = Color(0, 0, 0)
	label.billboard = BaseMaterial3D.BILLBOARD_DISABLED
	label.global_position = position
	label.rotation_degrees.y = yaw_degrees
	label.scale = Vector3.ONE * scale_value
	add_child(label)

func _mat(albedo: Color, emission: Color, energy: float) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = albedo
	if albedo.a < 1.0:
		material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.emission_enabled = energy > 0.0
	material.emission = emission
	material.emission_energy_multiplier = energy
	return material

func _light_up_delayed(light: Light3D, delay: float) -> void:
	var final_energy := 0.9
	await get_tree().create_timer(delay).timeout
	if is_instance_valid(light):
		light.light_energy = final_energy
