extends CharacterBody3D
class_name EchoActor

signal playback_finished(actor: EchoActor)
signal playback_halfway(actor: EchoActor)

var frames: Array = []
var events: Array = []
var duration := 0.0
var playback_time := 0.0
var echo_index := 0
var corrupt_at_halfway := false
var _next_event_index := 0
var _halfway_emitted := false
var _frozen := false

func setup(recording: Dictionary, index: int) -> void:
	frames = recording.get("frames", [])
	events = recording.get("events", [])
	duration = float(recording.get("duration", 0.0))
	echo_index = index

func _ready() -> void:
	name = "EchoActor%d" % echo_index
	_build_visuals()
	add_to_group("afterlight_actor")
	add_to_group("echo_actor")

func _build_visuals() -> void:
	var identity := ActorIdentity.new()
	identity.actor_type = ActorIdentity.ActorType.ECHO
	identity.display_name = "Echo"
	add_child(identity)

	var collider := CollisionShape3D.new()
	var capsule := CapsuleShape3D.new()
	capsule.radius = 0.35
	capsule.height = 1.68
	collider.shape = capsule
	collider.position.y = 0.84
	add_child(collider)

	var mesh_instance := MeshInstance3D.new()
	var capsule_mesh := CapsuleMesh.new()
	capsule_mesh.radius = 0.34
	capsule_mesh.height = 1.55
	mesh_instance.mesh = capsule_mesh
	mesh_instance.position.y = 0.86
	var material := StandardMaterial3D.new()
	material.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	material.albedo_color = Color(0.2, 0.95, 1.0, 0.34)
	material.emission_enabled = true
	material.emission = Color(0.0, 0.85, 1.0)
	material.emission_energy_multiplier = 1.8
	mesh_instance.set_surface_override_material(0, material)
	add_child(mesh_instance)

	var light := OmniLight3D.new()
	light.light_color = Color(0.35, 0.95, 1.0)
	light.light_energy = 0.7
	light.omni_range = 3.0
	light.position.y = 1.2
	add_child(light)

func _physics_process(delta: float) -> void:
	if _frozen:
		return
	if frames.is_empty():
		playback_finished.emit(self)
		queue_free()
		return
	playback_time += delta
	if corrupt_at_halfway and not _halfway_emitted and playback_time >= duration * 0.5:
		_halfway_emitted = true
		_frozen = true
		playback_halfway.emit(self)
		return
	_apply_frame(playback_time)
	_replay_events(playback_time)
	if playback_time >= duration:
		playback_finished.emit(self)
		queue_free()

func _apply_frame(time: float) -> void:
	if frames.size() == 1:
		global_transform = frames[0]["transform"]
		return
	var previous: Dictionary = frames[0]
	var next: Dictionary = frames[frames.size() - 1]
	for i in range(frames.size() - 1):
		if float(frames[i]["time"]) <= time and float(frames[i + 1]["time"]) >= time:
			previous = frames[i]
			next = frames[i + 1]
			break
	var span := max(0.001, float(next["time"]) - float(previous["time"]))
	var t := clamp((time - float(previous["time"])) / span, 0.0, 1.0)
	var a: Transform3D = previous["transform"]
	var b: Transform3D = next["transform"]
	global_transform = a.interpolate_with(b, t)

func _replay_events(time: float) -> void:
	while _next_event_index < events.size() and float(events[_next_event_index].get("time", 0.0)) <= time:
		var event: Dictionary = events[_next_event_index]
		var path := NodePath(str(event.get("target_path", "")))
		var target := get_node_or_null(path)
		if target and target.has_method("interact"):
			target.interact(self)
		_next_event_index += 1

func look_at_actor(actor: Node3D) -> void:
	if not actor:
		return
	var target := actor.global_position
	target.y = global_position.y
	look_at(target, Vector3.UP)
