extends Node
class_name EchoManager

signal recording_state_changed(is_recording: bool, elapsed: float, max_duration: float)
signal echo_count_changed(active: int, capacity: int)
signal echo_corrupted(echo: EchoActor)
signal echo_spawned(echo: EchoActor)

@export var max_record_seconds := 8.0
@export var sample_interval := 0.05

var player: PlayerController
var active_echoes: Array[EchoActor] = []
var is_recording := false
var recording_elapsed := 0.0
var _sample_elapsed := 0.0
var _frames: Array = []
var _events: Array = []
var _echo_scene := preload("res://scripts/systems/echo_actor.gd")

func bind_player(player_controller: PlayerController) -> void:
	player = player_controller
	player.echo_toggle_requested.connect(toggle_recording)
	player.remove_echo_requested.connect(remove_most_recent_echo)
	player.interaction_requested.connect(_on_player_interaction)
	GameState.echo_unlock_changed.connect(func(_max_echoes: int) -> void: _emit_count())
	_emit_count()

func _physics_process(delta: float) -> void:
	if not is_recording:
		return
	recording_elapsed += delta
	_sample_elapsed += delta
	if _sample_elapsed >= sample_interval:
		_sample_elapsed = 0.0
		_capture_frame()
	recording_state_changed.emit(true, recording_elapsed, max_record_seconds)
	if recording_elapsed >= max_record_seconds:
		stop_recording()

func toggle_recording() -> void:
	if not GameState.echo_unlocked or GameState.max_echoes <= 0:
		return
	if is_recording:
		stop_recording()
	else:
		start_recording()

func start_recording() -> void:
	if not player or active_echoes.size() >= GameState.max_echoes:
		return
	is_recording = true
	recording_elapsed = 0.0
	_sample_elapsed = sample_interval
	_frames.clear()
	_events.clear()
	AudioFeedback.play_event("record_start")
	recording_state_changed.emit(true, recording_elapsed, max_record_seconds)

func stop_recording() -> void:
	if not is_recording:
		return
	is_recording = false
	_capture_frame()
	AudioFeedback.play_event("record_stop")
	recording_state_changed.emit(false, recording_elapsed, max_record_seconds)
	if _frames.size() > 1 and recording_elapsed > 0.3:
		_spawn_echo({
			"frames": _frames.duplicate(true),
			"events": _events.duplicate(true),
			"duration": recording_elapsed,
		})

func remove_most_recent_echo() -> void:
	if is_recording:
		stop_recording()
		return
	if active_echoes.is_empty():
		return
	var echo := active_echoes.pop_back()
	if is_instance_valid(echo):
		echo.queue_free()
	AudioFeedback.play_event("echo_remove")
	_emit_count()

func clear_echoes() -> void:
	for echo in active_echoes:
		if is_instance_valid(echo):
			echo.queue_free()
	active_echoes.clear()
	if is_recording:
		is_recording = false
		recording_state_changed.emit(false, 0.0, max_record_seconds)
	_emit_count()

func corrupt_next_echo() -> void:
	if active_echoes.is_empty():
		return
	active_echoes[-1].corrupt_at_halfway = true

func _capture_frame() -> void:
	if not player:
		return
	_frames.append({
		"time": recording_elapsed,
		"transform": player.global_transform,
	})

func _spawn_echo(recording: Dictionary) -> void:
	var echo := _echo_scene.new() as EchoActor
	echo.setup(recording, active_echoes.size() + 1)
	add_child(echo)
	if not echo.frames.is_empty():
		echo.global_transform = echo.frames[0]["transform"]
	echo.playback_finished.connect(_on_echo_finished)
	echo.playback_halfway.connect(_on_echo_halfway)
	active_echoes.append(echo)
	AudioFeedback.play_event("echo_spawn")
	echo_spawned.emit(echo)
	_emit_count()

func _on_player_interaction(target: Node) -> void:
	if not is_recording or not target:
		return
	_events.append({
		"time": recording_elapsed,
		"target_path": target.get_path(),
		"event": "interact",
	})

func _on_echo_finished(echo: EchoActor) -> void:
	active_echoes.erase(echo)
	_emit_count()

func _on_echo_halfway(echo: EchoActor) -> void:
	echo_corrupted.emit(echo)

func _emit_count() -> void:
	echo_count_changed.emit(active_echoes.size(), GameState.max_echoes)
