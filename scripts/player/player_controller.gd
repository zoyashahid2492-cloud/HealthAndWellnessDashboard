extends CharacterBody3D
class_name PlayerController

signal interaction_requested(target: Node)
signal echo_toggle_requested
signal remove_echo_requested
signal reset_room_requested
signal skip_section_requested
signal prompt_changed(text: String)

@export var walk_speed := 5.8
@export var sprint_speed := 8.2
@export var jump_velocity := 7.4
@export var acceleration := 18.0
@export var air_acceleration := 8.0
@export var interact_distance := 3.2
@export var reset_hold_seconds := 0.75

var camera: Camera3D
var _pitch := 0.0
var _reset_hold := 0.0
var _last_prompt := ""

func _ready() -> void:
	Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
	_build_body()

func _build_body() -> void:
	var identity := ActorIdentity.new()
	identity.actor_type = ActorIdentity.ActorType.REAL_PLAYER
	identity.display_name = "Real Player"
	add_child(identity)

	var collider := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.38
	shape.height = 1.72
	collider.shape = shape
	collider.position.y = 0.86
	add_child(collider)

	camera = Camera3D.new()
	camera.name = "Camera"
	camera.position = Vector3(0, 1.55, 0)
	camera.fov = 76.0
	add_child(camera)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		rotate_y(-event.relative.x * GameState.mouse_sensitivity)
		_pitch = clamp(_pitch - event.relative.y * GameState.mouse_sensitivity, -1.45, 1.45)
		camera.rotation.x = _pitch

	if event.is_action_pressed("interact"):
		var target := get_interaction_target()
		if target:
			interaction_requested.emit(target)
			if target.has_method("interact"):
				target.interact(self)
	if event.is_action_pressed("echo_record"):
		echo_toggle_requested.emit()
	if event.is_action_pressed("echo_remove"):
		_reset_hold = 0.0
	if event.is_action_released("echo_remove"):
		if _reset_hold < reset_hold_seconds:
			remove_echo_requested.emit()
		_reset_hold = 0.0
	if event.is_action_pressed("pause"):
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE if Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED else Input.MOUSE_MODE_CAPTURED)
	if event.is_action_pressed("dev_hud"):
		GameState.developer_hud_enabled = not GameState.developer_hud_enabled
	if event.is_action_pressed("dev_skip"):
		skip_section_requested.emit()

func _physics_process(delta: float) -> void:
	_update_movement(delta)
	_update_prompt()
	if Input.is_action_pressed("echo_remove"):
		_reset_hold += delta
		if _reset_hold >= reset_hold_seconds:
			_reset_hold = -1000.0
			reset_room_requested.emit()

func _update_movement(delta: float) -> void:
	var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	var wish_dir := (global_transform.basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	var target_speed := sprint_speed if Input.is_action_pressed("sprint") else walk_speed
	var target_velocity := wish_dir * target_speed
	var accel := acceleration if is_on_floor() else air_acceleration
	velocity.x = move_toward(velocity.x, target_velocity.x, accel * delta)
	velocity.z = move_toward(velocity.z, target_velocity.z, accel * delta)
	if not is_on_floor():
		velocity.y -= ProjectSettings.get_setting("physics/3d/default_gravity") * delta
	elif Input.is_action_just_pressed("jump"):
		velocity.y = jump_velocity
	move_and_slide()

func get_interaction_target() -> Node:
	if not camera:
		return null
	var space := get_world_3d().direct_space_state
	var origin := camera.global_position
	var end := origin + -camera.global_transform.basis.z * interact_distance
	var query := PhysicsRayQueryParameters3D.create(origin, end)
	query.exclude = [self]
	var hit := space.intersect_ray(query)
	if hit.is_empty():
		return null
	var collider := hit.get("collider") as Node
	while collider:
		if collider.has_method("interact"):
			return collider
		collider = collider.get_parent()
	return null

func _update_prompt() -> void:
	var target := get_interaction_target()
	var prompt := ""
	if target:
		prompt = target.get_prompt() if target.has_method("get_prompt") else "Press E"
	if prompt != _last_prompt:
		_last_prompt = prompt
		prompt_changed.emit(prompt)

func teleport_to(transform: Transform3D) -> void:
	global_transform = transform
	velocity = Vector3.ZERO
