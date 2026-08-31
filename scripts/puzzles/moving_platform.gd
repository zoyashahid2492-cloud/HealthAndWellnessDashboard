extends AnimatableBody3D
class_name MovingPlatform

@export var travel := Vector3(0, 0, -7)
@export var speed := 2.4

var active := false
var _start := Vector3.ZERO
var _end := Vector3.ZERO

func _ready() -> void:
	_start = global_position
	_end = _start + travel
	_build_visuals()

func _physics_process(delta: float) -> void:
	var target := _end if active else _start
	global_position = global_position.move_toward(target, speed * delta)

func set_active(value: bool) -> void:
	active = value
	AudioFeedback.play_event("activate")

func reset_device() -> void:
	active = false
	global_position = _start

func _build_visuals() -> void:
	var collider := CollisionShape3D.new()
	var shape := BoxShape3D.new()
	shape.size = Vector3(3.2, 0.28, 3.2)
	collider.shape = shape
	add_child(collider)

	var mesh_instance := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = Vector3(3.2, 0.28, 3.2)
	mesh_instance.mesh = mesh
	add_child(mesh_instance)
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.08, 0.09, 0.1)
	material.emission_enabled = true
	material.emission = Color(0.0, 0.25, 0.34)
	material.emission_energy_multiplier = 0.6
	mesh_instance.set_surface_override_material(0, material)
