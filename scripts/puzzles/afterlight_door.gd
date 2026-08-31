extends Node3D
class_name AfterlightDoor

signal opened
signal closed

@export var width := 3.4
@export var height := 3.2
@export var depth := 0.35
@export var open_height := 3.45
@export var move_speed := 4.0

var is_open := false
var _body: StaticBody3D
var _panel: MeshInstance3D
var _closed_y := 0.0
var _target_y := 0.0

func _ready() -> void:
	_build_visuals()

func _physics_process(delta: float) -> void:
	if not _body:
		return
	_body.position.y = move_toward(_body.position.y, _target_y, move_speed * delta)

func set_open(value: bool) -> void:
	if is_open == value:
		return
	is_open = value
	_target_y = open_height if is_open else _closed_y
	if is_open:
		opened.emit()
	else:
		closed.emit()

func open_for(seconds: float) -> void:
	set_open(true)
	await get_tree().create_timer(seconds).timeout
	if is_instance_valid(self):
		set_open(false)

func reset_device() -> void:
	is_open = false
	_target_y = _closed_y
	if _body:
		_body.position.y = _closed_y

func _build_visuals() -> void:
	_body = StaticBody3D.new()
	add_child(_body)
	var collider := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(width, height, depth)
	collider.shape = shape
	collider.position.y = height * 0.5
	_body.add_child(collider)

	_panel = MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(width, height, depth)
	_panel.mesh = mesh
	_panel.position.y = height * 0.5
	_body.add_child(_panel)
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.05, 0.055, 0.065)
	material.emission_enabled = true
	material.emission = Color(0.0, 0.25, 0.32)
	material.emission_energy_multiplier = 0.35
	_panel.set_surface_override_material(0, material)

	var strip := MeshInstance3D.new()
	var strip_mesh := BoxMesh.new()
	strip_mesh.size = Vector3(width, 0.08, depth + 0.02)
	strip.mesh = strip_mesh
	strip.position = Vector3(0, height * 0.95, 0)
	_body.add_child(strip)
	var strip_material := StandardMaterial3D.new()
	strip_material.albedo_color = Color(0.15, 0.85, 1.0)
	strip_material.emission_enabled = true
	strip_material.emission = Color(0.05, 0.9, 1.0)
	strip_material.emission_energy_multiplier = 1.4
	strip.set_surface_override_material(0, strip_material)
