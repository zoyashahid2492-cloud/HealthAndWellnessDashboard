extends StaticBody3D
class_name EchoSwitch

signal activated(actor: Node)

@export var prompt := "Press E - activate switch"
@export var reusable := true
@export var hold_seconds := 0.0

var is_on := false
var _mesh: MeshInstance3D
var _light: OmniLight3D

func _ready() -> void:
	add_to_group("interactable")
	_build_visuals()

func _build_visuals() -> void:
	var collider := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(0.75, 1.2, 0.26)
	collider.shape = shape
	collider.position.y = 0.6
	add_child(collider)

	_mesh = MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(0.75, 1.2, 0.26)
	_mesh.mesh = mesh
	_mesh.position.y = 0.6
	add_child(_mesh)

	_light = OmniLight3D.new()
	_light.light_color = Color(0.2, 0.95, 1.0)
	_light.omni_range = 2.6
	_light.position = Vector3(0, 0.8, -0.25)
	add_child(_light)
	_update_visuals()

func interact(actor: Node) -> void:
	if not ActorIdentity.can_activate_echo_device(actor):
		return
	if not reusable and is_on:
		return
	is_on = true
	_update_visuals()
	AudioFeedback.play_event("activate")
	activated.emit(actor)
	if hold_seconds > 0.0:
		var token := Time.get_ticks_msec()
		set_meta("hold_token", token)
		await get_tree().create_timer(hold_seconds).timeout
		if is_instance_valid(self) and get_meta("hold_token") == token:
			is_on = false
			_update_visuals()

func get_prompt() -> String:
	return prompt

func reset_device() -> void:
	is_on = false
	_update_visuals()

func _update_visuals() -> void:
	if not _mesh:
		return
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.04, 0.12, 0.14)
	material.emission_enabled = true
	material.emission = Color(0.0, 0.95, 1.0) if is_on else Color(0.0, 0.16, 0.22)
	material.emission_energy_multiplier = 1.7 if is_on else 0.45
	_mesh.set_surface_override_material(0, material)
	_light.light_energy = 1.4 if is_on else 0.35
