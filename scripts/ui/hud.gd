extends CanvasLayer
class_name AfterlightHUD

signal sensitivity_changed(value: float)
signal subtitle_scale_changed(value: float)
signal resume_requested

var _prompt: Label
var _recording: Label
var _capacity: Label
var _subtitle: RichTextLabel
var _dev: Label
var _pause_panel: Control
var _recording_active := false
var _recording_elapsed := 0.0
var _recording_max := 8.0
var _echo_count := 0
var _echo_capacity := 0
var _player: Node3D

func _ready() -> void:
	_build_ui()
	set_process(true)

func bind_player(player: Node3D) -> void:
	_player = player

func set_prompt(text: String) -> void:
	_prompt.text = text
	_prompt.visible = not text.is_empty()

func set_recording(active: bool, elapsed: float, max_duration: float) -> void:
	_recording_active = active
	_recording_elapsed = elapsed
	_recording_max = max_duration
	_update_recording()

func set_echo_capacity(active: int, capacity: int) -> void:
	_echo_count = active
	_echo_capacity = capacity
	_capacity.text = "ECHO %d/%d" % [_echo_count, _echo_capacity]
	_capacity.visible = capacity > 0

func show_subtitle(speaker: String, line: String, seconds := 3.2) -> void:
	_subtitle.visible = true
	_subtitle.clear()
	_subtitle.append_text("[center][b]%s:[/b] %s[/center]" % [speaker, line])
	_subtitle.scale = Vector2.ONE * GameState.subtitle_scale
	var token := Time.get_ticks_msec()
	_subtitle.set_meta("token", token)
	await get_tree().create_timer(seconds).timeout
	if is_instance_valid(_subtitle) and _subtitle.get_meta("token") == token:
		_subtitle.visible = false

func show_system(text: String, seconds := 2.8) -> void:
	show_subtitle("SYSTEM", text, seconds)

func toggle_pause() -> void:
	_pause_panel.visible = not _pause_panel.visible
	get_tree().paused = _pause_panel.visible
	Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE if _pause_panel.visible else Input.MOUSE_MODE_CAPTURED)

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("pause"):
		toggle_pause()
	_update_recording()
	_update_dev()

func _update_recording() -> void:
	_recording.visible = _recording_active
	if _recording_active:
		var remain := max(0.0, _recording_max - _recording_elapsed)
		_recording.text = "REC %.1fs" % remain

func _update_dev() -> void:
	_dev.visible = GameState.developer_hud_enabled
	if not _dev.visible:
		return
	var coords := Vector3.ZERO
	if _player:
		coords = _player.global_position
	_dev.text = "DEV\ncheckpoint: %s\nrecording: %s %.2f/%0.1f\nechoes: %d/%d\nplayer: %.1f, %.1f, %.1f\nF3 skip section | F2 HUD | Hold R reset" % [
		GameState.current_checkpoint,
		str(_recording_active),
		_recording_elapsed,
		_recording_max,
		_echo_count,
		_echo_capacity,
		coords.x,
		coords.y,
		coords.z,
	]

func _build_ui() -> void:
	_prompt = Label.new()
	_prompt.position = Vector2(490, 610)
	_prompt.add_theme_font_size_override("font_size", 22)
	_prompt.visible = false
	add_child(_prompt)

	_recording = Label.new()
	_recording.position = Vector2(44, 42)
	_recording.add_theme_font_size_override("font_size", 26)
	_recording.add_theme_color_override("font_color", Color(1.0, 0.22, 0.18))
	_recording.visible = false
	add_child(_recording)

	_capacity = Label.new()
	_capacity.position = Vector2(44, 82)
	_capacity.add_theme_font_size_override("font_size", 20)
	_capacity.add_theme_color_override("font_color", Color(0.55, 0.95, 1.0))
	_capacity.visible = false
	add_child(_capacity)

	_subtitle = RichTextLabel.new()
	_subtitle.bbcode_enabled = true
	_subtitle.fit_content = true
	_subtitle.scroll_active = false
	_subtitle.position = Vector2(240, 560)
	_subtitle.size = Vector2(800, 90)
	_subtitle.add_theme_font_size_override("normal_font_size", 25)
	_subtitle.visible = false
	add_child(_subtitle)

	_dev = Label.new()
	_dev.position = Vector2(930, 30)
	_dev.add_theme_font_size_override("font_size", 15)
	_dev.add_theme_color_override("font_color", Color(0.7, 1.0, 0.75))
	_dev.visible = false
	add_child(_dev)

	_build_pause_menu()

func _build_pause_menu() -> void:
	_pause_panel = PanelContainer.new()
	_pause_panel.process_mode = Node.PROCESS_MODE_ALWAYS
	_pause_panel.position = Vector2(430, 170)
	_pause_panel.size = Vector2(420, 330)
	_pause_panel.visible = false
	add_child(_pause_panel)

	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 24)
	margin.add_theme_constant_override("margin_right", 24)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_bottom", 24)
	_pause_panel.add_child(margin)

	var box := VBoxContainer.new()
	box.add_theme_constant_override("separation", 14)
	margin.add_child(box)

	var title := Label.new()
	title.text = "PROJECT AFTERLIGHT"
	title.add_theme_font_size_override("font_size", 26)
	box.add_child(title)

	var resume := Button.new()
	resume.text = "Resume"
	resume.pressed.connect(toggle_pause)
	box.add_child(resume)

	var sensitivity := HSlider.new()
	sensitivity.min_value = 0.0008
	sensitivity.max_value = 0.006
	sensitivity.step = 0.0001
	sensitivity.value = GameState.mouse_sensitivity
	sensitivity.value_changed.connect(func(value: float) -> void:
		GameState.mouse_sensitivity = value
		SaveSystem.save_game()
	)
	box.add_child(_labeled("Mouse sensitivity", sensitivity))

	var subtitle_slider := HSlider.new()
	subtitle_slider.min_value = 0.8
	subtitle_slider.max_value = 1.6
	subtitle_slider.step = 0.1
	subtitle_slider.value = GameState.subtitle_scale
	subtitle_slider.value_changed.connect(func(value: float) -> void:
		GameState.subtitle_scale = value
		SaveSystem.save_game()
	)
	box.add_child(_labeled("Subtitle size", subtitle_slider))

	var help := Label.new()
	help.text = "WASD move  Mouse look  Space jump  Shift sprint\nE interact  Q record Echo  R remove  Hold R reset"
	help.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	box.add_child(help)

func _labeled(text: String, control: Control) -> Control:
	var box := VBoxContainer.new()
	var label := Label.new()
	label.text = text
	box.add_child(label)
	box.add_child(control)
	return box
