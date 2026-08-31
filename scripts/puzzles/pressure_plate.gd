extends Area3D
class_name PressurePlate

signal active_changed(active: bool)

@export var label := "Pressure Plate"
@export var prompt := ""

var active := false
var _activators: Array[Node] = []
var _top: MeshInstance3D
var _light: OmniLight3D

func _ready() -> void:
	collision_layer = 0
	collision_mask = 1
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)
	_build_visuals()

func _build_visuals() -> void:
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(1.8, 0.16, 1.8)
	shape.shape = box
	add_child(shape)

	_top = MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(1.9, 0.12, 1.9)
	_top.mesh = mesh
	_top.position.y = -0.02
	_top.set_surface_override_material(0, _material(false))
	add_child(_top)

	_light = OmniLight3D.new()
	_light.light_color = Color(0.1, 0.85, 1.0)
	_light.light_energy = 0.0
	_light.omni_range = 3.0
	_light.position.y = 0.4
	add_child(_light)

func _on_body_entered(body: Node3D) -> void:
	if ActorIdentity.can_activate_echo_device(body) and not _activators.has(body):
		_activators.append(body)
		_set_active(true)

func _on_body_exited(body: Node3D) -> void:
	_activators.erase(body)
	_set_active(not _activators.is_empty())

func _set_active(value: bool) -> void:
	if active == value:
		return
	active = value
	_top.position.y = -0.07 if active else -0.02
	_top.set_surface_override_material(0, _material(active))
	_light.light_energy = 1.6 if active else 0.0
	AudioFeedback.play_event("activate")
	active_changed.emit(active)

func _material(is_active: bool) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.2, 0.95, 1.0) if is_active else Color(0.08, 0.12, 0.14)
	material.emission_enabled = true
	material.emission = Color(0.0, 0.8, 1.0) if is_active else Color(0.0, 0.12, 0.16)
	material.emission_energy_multiplier = 1.4 if is_active else 0.25
	return material

func reset_device() -> void:
	_activators.clear()
	_set_active(false)
