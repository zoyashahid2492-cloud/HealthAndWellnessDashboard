extends Node

const SAVE_PATH := "user://afterlight_prototype.save"

func _ready() -> void:
	load_game()

func save_game() -> void:
	if not is_inside_tree() or not has_node("/root/GameState"):
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file == null:
		push_warning("Could not open save file for writing.")
		return
	file.store_string(JSON.stringify(GameState.to_save_data(), "\t"))

func load_game() -> void:
	if not FileAccess.file_exists(SAVE_PATH) or not has_node("/root/GameState"):
		return
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return
	var parsed := JSON.parse_string(file.get_as_text())
	if parsed is Dictionary:
		GameState.apply_save_data(parsed)
