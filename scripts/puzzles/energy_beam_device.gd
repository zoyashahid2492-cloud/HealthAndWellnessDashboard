extends Node3D
class_name EnergyBeamDevice

signal receiver_changed(active: bool)

@export var prompt := "Press E - rotate prism"
@export var beam_length := 9.0

var receiver_active := false
var redirected := false
var _beam: MeshInstance3D
var _receiver: MeshInstance3D
var _source_light: OmniLight3D

func _ready() -> void:
	_build_visuals()
	_update_state()

func interact(actor: Node) -> void:
	if not ActorIdentity.can_activate_echo_device(actor):
		return
	redirected = not redirected
	_update_state()
	AudioFeedback.play_event("activate")

func get_prompt() -> String:
	return prompt

func reset_device() -> void:
	redirected = false
	_update_state()

func _build_visuals() -> void:
	var source := MeshInstance3D.new()
	var source_mesh := CylinderMesh.new()
	source_mesh.top_radius = 0.35
	source_mesh.bottom_radius = 0.35
	source_mesh.height = 1.2
	source.mesh = source_mesh
	source.position = Vector3(0, 0.8, 0)
	add_child(source)
	source.set_surface_override_material(0, _mat(Color(0.05, 0.16, 0.18), Color(0.0, 0.8, 1.0), 0.8))

	_beam = MeshInstance3D.new()
	var beam_mesh := BoxMesh.new()
	beam_mesh.size = Vector3(0.12, 0.12, beam_length)
	_beam.mesh = beam_mesh
	_beam.position = Vector3(0, 1.15, -beam_length * 0.5)
	add_child(_beam)

	_receiver = MeshInstance3D.new()
	var receiver_mesh := BoxMesh.new()
	receiver_mesh.size = Vector3(1.2, 1.2, 0.18)
	_receiver.mesh = receiver_mesh
	_receiver.position = Vector3(0, 1.15, -beam_length)
	add_child(_receiver)

	_source_light = OmniLight3D.new()
	_source_light.light_color = Color(0.2, 0.95, 1.0)
	_source_light.light_energy = 1.0
	_source_light.omni_range = 4.0
	_source_light.position = Vector3(0, 1.2, 0)
	add_child(_source_light)

func _update_state() -> void:
	receiver_active = redirected
	if _beam:
		_beam.rotation_degrees.y = 18.0 if redirected else 0.0
		_beam.set_surface_override_material(0, _mat(Color(0.0, 0.85, 1.0, 0.32), Color(0.0, 0.9, 1.0), 2.1))
	if _receiver:
		var emission := Color(0.0, 0.95, 1.0) if receiver_active else Color(0.08, 0.12, 0.15)
		_receiver.set_surface_override_material(0, _mat(Color(0.08, 0.09, 0.1), emission, 1.8 if receiver_active else 0.2))
	receiver_changed.emit(receiver_active)

func _mat(albedo: Color, emission: Color, energy: float) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = albedo
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA if albedo.a < 1.0 else BaseMaterial3D.TRANSPARENCY_DISABLED
	material.emission_enabled = true
	material.emission = emission
	material.emission_energy_multiplier = energy
	return material
