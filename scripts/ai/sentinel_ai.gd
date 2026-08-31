extends CharacterBody3D
class_name SentinelAI

signal state_changed(new_state: String)

enum State { IDLE, NOTICE, INVESTIGATE, CHASE, RETURN }

@export var notice_radius := 9.0
@export var chase_radius := 4.5
@export var move_speed := 2.8
@export var chase_speed := 4.4
@export var prompt := ""

var state := State.IDLE
var home := Vector3.ZERO
var target_position := Vector3.ZERO
var target_actor: Node3D
var _state_timer := 0.0
var _body: MeshInstance3D
var _eye: OmniLight3D

func _ready() -> void:
	home = global_position
	target_position = home
	_build_visuals()
	_set_state(State.IDLE)

func _physics_process(delta: float) -> void:
	_state_timer += delta
	_scan_for_actors()
	match state:
		State.IDLE:
			velocity = Vector3.ZERO
		State.NOTICE:
			velocity = Vector3.ZERO
			if _state_timer > 0.7:
				_set_state(State.INVESTIGATE)
		State.INVESTIGATE:
			_move_toward(target_position, move_speed, delta)
			if global_position.distance_to(target_position) < 0.8 or _state_timer > 6.0:
				_set_state(State.RETURN)
		State.CHASE:
			if is_instance_valid(target_actor):
				target_position = target_actor.global_position
			_move_toward(target_position, chase_speed, delta)
			if _state_timer > 7.0:
				_set_state(State.RETURN)
		State.RETURN:
			_move_toward(home, move_speed, delta)
			if global_position.distance_to(home) < 0.8:
				_set_state(State.IDLE)
	move_and_slide()

func reset_device() -> void:
	global_position = home
	target_actor = null
	target_position = home
	_set_state(State.IDLE)

func _scan_for_actors() -> void:
	var best_actor: Node3D
	var best_score := INF
	for node in get_tree().get_nodes_in_group("afterlight_actor"):
		if not node is Node3D or node == self:
			continue
		var identity := ActorIdentity.from_node(node)
		if not identity or identity.actor_type == ActorIdentity.ActorType.NPC:
			continue
		var distance := global_position.distance_to(node.global_position)
		var radius := chase_radius if identity.is_real_player() else notice_radius
		if distance <= radius:
			var score := distance - (3.0 if identity.is_echo() else 0.0)
			if score < best_score:
				best_score = score
				best_actor = node
	if best_actor:
		target_actor = best_actor
		target_position = best_actor.global_position
		var identity := ActorIdentity.from_node(best_actor)
		_set_state(State.CHASE if identity and identity.is_echo() else State.NOTICE)

func _move_toward(point: Vector3, speed: float, delta: float) -> void:
	var direction := point - global_position
	direction.y = 0.0
	if direction.length() < 0.1:
		velocity = Vector3.ZERO
		return
	direction = direction.normalized()
	velocity.x = direction.x * speed
	velocity.z = direction.z * speed
	velocity.y -= ProjectSettings.get_setting("physics/3d/default_gravity") * delta
	look_at(global_position + direction, Vector3.UP)

func _set_state(new_state: State) -> void:
	if state == new_state and _state_timer < 0.01:
		return
	state = new_state
	_state_timer = 0.0
	var state_name := _state_name(state)
	state_changed.emit(state_name)
	if _eye:
		match state:
			State.IDLE:
				_eye.light_color = Color(0.25, 0.45, 0.55)
				_eye.light_energy = 0.7
			State.NOTICE, State.INVESTIGATE:
				_eye.light_color = Color(1.0, 0.75, 0.25)
				_eye.light_energy = 1.2
			State.CHASE:
				_eye.light_color = Color(1.0, 0.1, 0.05)
				_eye.light_energy = 1.9
			State.RETURN:
				_eye.light_color = Color(0.25, 0.85, 1.0)
				_eye.light_energy = 0.8

func _build_visuals() -> void:
	var identity := ActorIdentity.new()
	identity.actor_type = ActorIdentity.ActorType.NPC
	identity.can_trigger_echo_devices = false
	identity.display_name = "Sentinel"
	add_child(identity)

	var collider := CollisionShape3D.new()
	var shape := CapsuleShape3D.new()
	shape.radius = 0.42
	shape.height = 1.3
	collider.shape = shape
	collider.position.y = 0.65
	add_child(collider)

	_body = MeshInstance3D.new()
	var mesh := CapsuleMesh.new()
	mesh.radius = 0.42
	mesh.height = 1.3
	_body.mesh = mesh
	_body.position.y = 0.65
	var material := StandardMaterial3D.new()
	material.albedo_color = Color(0.08, 0.08, 0.09)
	material.emission_enabled = true
	material.emission = Color(0.1, 0.18, 0.2)
	material.emission_energy_multiplier = 0.6
	_body.set_surface_override_material(0, material)
	add_child(_body)

	_eye = OmniLight3D.new()
	_eye.position = Vector3(0, 1.1, -0.45)
	_eye.omni_range = 5.0
	add_child(_eye)

func _state_name(value: State) -> String:
	match value:
		State.IDLE:
			return "IDLE"
		State.NOTICE:
			return "NOTICE"
		State.INVESTIGATE:
			return "INVESTIGATE"
		State.CHASE:
			return "CHASE"
		State.RETURN:
			return "RETURN"
	return "UNKNOWN"
