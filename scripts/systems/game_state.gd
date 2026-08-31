extends Node

signal echo_unlock_changed(max_echoes: int)
signal checkpoint_changed(checkpoint_name: String, spawn: Vector3)

var echo_unlocked := false
var max_echoes := 0
var current_checkpoint := "Transit Station"
var current_spawn := Vector3(0, 0.25, 0)
var mouse_sensitivity := 0.0022
var subtitle_scale := 1.0
var developer_hud_enabled := false

func unlock_echoes(new_max: int) -> void:
	echo_unlocked = true
	max_echoes = max(max_echoes, new_max)
	echo_unlock_changed.emit(max_echoes)
	SaveSystem.save_game()

func set_checkpoint(name: String, spawn: Vector3) -> void:
	current_checkpoint = name
	current_spawn = spawn
	checkpoint_changed.emit(current_checkpoint, current_spawn)
	SaveSystem.save_game()

func to_save_data() -> Dictionary:
	return {
		"echo_unlocked": echo_unlocked,
		"max_echoes": max_echoes,
		"current_checkpoint": current_checkpoint,
		"current_spawn": [current_spawn.x, current_spawn.y, current_spawn.z],
		"mouse_sensitivity": mouse_sensitivity,
		"subtitle_scale": subtitle_scale,
	}

func apply_save_data(data: Dictionary) -> void:
	echo_unlocked = data.get("echo_unlocked", echo_unlocked)
	max_echoes = int(data.get("max_echoes", max_echoes))
	current_checkpoint = str(data.get("current_checkpoint", current_checkpoint))
	var spawn_data: Array = data.get("current_spawn", [current_spawn.x, current_spawn.y, current_spawn.z])
	if spawn_data.size() == 3:
		current_spawn = Vector3(float(spawn_data[0]), float(spawn_data[1]), float(spawn_data[2]))
	mouse_sensitivity = float(data.get("mouse_sensitivity", mouse_sensitivity))
	subtitle_scale = float(data.get("subtitle_scale", subtitle_scale))
