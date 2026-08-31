extends Node
class_name ActorIdentity

enum ActorType {
	REAL_PLAYER,
	ECHO,
	NPC,
	PHYSICS_OBJECT,
}

@export var actor_type: ActorType = ActorType.REAL_PLAYER
@export var actor_id := ""
@export var can_trigger_echo_devices := true
@export var display_name := "Actor"

func _ready() -> void:
	if actor_id.is_empty():
		actor_id = "%s_%s" % [display_name.to_lower().replace(" ", "_"), get_instance_id()]
	var owner_node := get_parent()
	if owner_node:
		owner_node.add_to_group("afterlight_actor")
		match actor_type:
			ActorType.REAL_PLAYER:
				owner_node.add_to_group("real_player")
			ActorType.ECHO:
				owner_node.add_to_group("echo_actor")
			ActorType.NPC:
				owner_node.add_to_group("npc_actor")
			ActorType.PHYSICS_OBJECT:
				owner_node.add_to_group("physics_actor")

static func from_node(node: Node) -> ActorIdentity:
	var cursor := node
	while cursor:
		for child in cursor.get_children():
			if child is ActorIdentity:
				return child
		cursor = cursor.get_parent()
	return null

static func can_activate_echo_device(node: Node) -> bool:
	var identity := ActorIdentity.from_node(node)
	return identity != null and identity.can_trigger_echo_devices

func is_echo() -> bool:
	return actor_type == ActorType.ECHO

func is_real_player() -> bool:
	return actor_type == ActorType.REAL_PLAYER
